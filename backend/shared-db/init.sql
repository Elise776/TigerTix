CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    tickets INTEGER NOT NULL
);

UPDATE events
SET tickets = 34
WHERE id = 1 AND tickets > 0;