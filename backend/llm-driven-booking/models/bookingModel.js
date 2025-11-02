const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../../shared-db/database.sqlite");
const db = new sqlite3.Database(dbPath);

/**
 * Normalize an event name for matching purposes.
 * - Trims leading/trailing spaces
 * - Collapses multiple spaces
 * - Converts to lowercase
 *
 * @param {string} name - Event name
 * @returns {string} Normalized event name
 */
function normalizeName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Finds an event by name.
 * Matching is case-insensitive and allows partial matches using SQL LIKE.
 *
 * @param {string} name - Name of the event to search for
 * @param {function(Error|null, Object|null)} callback - Callback with (err, event)
 *   - event {Object} Event row from the database
 *
 */
function findEventByName(name, callback) {
  if (!name) return callback(new Error("No event name provided"));
  const searchName = name.trim().toLowerCase();

  const sql = `
    SELECT * 
    FROM events 
    WHERE LOWER(name) LIKE '%' || ? || '%'
       OR ? LIKE '%' || LOWER(name) || '%'
    LIMIT 1
  `;

  db.get(sql, [searchName, searchName], (err, row) => {
    if (err) return callback(err);
    if (!row)
      return callback(new Error(`Could not find an event matching "${name}".`));
    callback(null, row);
  });
}

/**
 * Transactionally books tickets for an event.
 * Ensures:
 *   - Tickets are only booked if enough are available
 *   - Updates to the events table and bookings table are atomic
 *
 * @param {string} eventName - Name of the event to book
 * @param {number} qty - Number of tickets to book
 * @param {function(Error|null, Object|null)} callback - Callback with (err, booking)
 *   - booking {Object} Details of the booking:
 *       - bookingId {number}: ID of the newly inserted booking
 *       - eventId {number}: ID of the booked event
 *       - qty {number}: Number of tickets booked
 *
 */
function bookTicketsTransactional(eventName, qty, callback) {
  if (!Number.isInteger(qty) || qty <= 0)
    return callback(new Error("Invalid quantity"));

  findEventByName(eventName, (err, event) => {
    if (err) return callback(err);
    if (!event)
      return callback(
        new Error(`Could not find an event matching "${eventName}".`)
      );

    db.serialize(() => {
      db.run("BEGIN TRANSACTION", function (beginErr) {
        if (beginErr) return callback(new Error("DB busy, please retry"));

        const update = `UPDATE events SET tickets = tickets - ? WHERE id = ? AND tickets >= ?`;
        db.run(update, [qty, event.id, qty], function (updateErr) {
          if (updateErr)
            return db.run("ROLLBACK", () =>
              callback(new Error("Database update error"))
            );

          if (this.changes === 0)
            return db.run("ROLLBACK", () =>
              callback(new Error("Not enough tickets available"))
            );

          const insert = `INSERT INTO bookings (event_id, qty, created_at) VALUES (?, ?, datetime('now'))`;
          db.run(insert, [event.id, qty], function (insertErr) {
            if (insertErr)
              return db.run("ROLLBACK", () =>
                callback(new Error("Failed to record booking"))
              );

            db.run("COMMIT", (commitErr) => {
              if (commitErr)
                return db.run("ROLLBACK", () =>
                  callback(new Error("Failed to commit booking"))
                );

              callback(null, {
                bookingId: this.lastID,
                eventId: event.id,
                qty,
              });
            });
          });
        });
      });
    });
  });
}

module.exports = { bookTicketsTransactional, findEventByName };
