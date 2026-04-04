const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
    // Auto-create users table on boot
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`, (err) => {
        if (err) console.error("Error creating users table:", err);
    });
  }
});

// Polyfill the mysql2 .promise().query() API so we don't have to rewrite auth.js!
db.promise = () => ({
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      // Replace parameter placeholders '?' just in case, though they are identical in sqlite
      if (sql.trim().toUpperCase().startsWith("SELECT")) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve([rows]); // return array of rows inside an array to match mysql2 destructuring: const [result] = ...
        });
      } else {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
        });
      }
    });
  }
});

module.exports = db;