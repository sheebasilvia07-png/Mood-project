const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Silvia", // your MySQL password
  database: "mood_app"
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL connection error:", err);
  } else {
    console.log("✅ MySQL connected");
  }
});

module.exports = db;