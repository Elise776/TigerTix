const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "../../shared-db/database.sqlite");
const db = new sqlite3.Database(dbPath);

/**
 * Normalize event name for matching.
 */
function normalizeName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Finds an event by name (normalized, case-insensitive, fallback LIKE).
 */
function findEventByName(name, callback) {
  if (!name) return callback(new Error("No event name provided"));
  const searchName = name.trim().toLowerCase();

  const sql = `
    SELECT * 
    FROM events 
    WHERE LOWER(name) = ? 
       OR LOWER(name) LIKE ?
    LIMIT 1
  `;
  db.get(sql, [searchName, `%${searchName}%`], (err, row) => {
    if (err) return callback(err);
    callback(null, row || null);
  });
}

/**
 * Transactionally book tickets
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
      db.run("BEGIN IMMEDIATE", function (beginErr) {
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
