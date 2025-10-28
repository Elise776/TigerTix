/**
 * Returns a static list of Clemson campus events.
 *
 * @returns {Array<Object>} Array of event objects with properties:
 *   - id {number}: Unique event ID
 *   - name {string}: Name of the event
 *   - date {string}: Event date in YYYY-MM-DD format
 */
const getEvents = () => {
  return [
    { id: 1, name: "Clemson Football Game", date: "2025-09-01", tickets: 100 },
    { id: 2, name: "Campus Concert", date: "2025-09-10" },
    { id: 3, name: "Career Fair", date: "2025-09-15" },
  ];
};
module.exports = { getEvents };
