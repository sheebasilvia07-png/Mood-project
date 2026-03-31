const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "hopper.proxy.rlwy.net",
  user: "root",              // or Railway user
  password: "AbjSlBTJBoSxJHCCclxslixBHhDZXGLX", // from Railway Variables tab
  database: "railway",       // or whatever DB name Railway gave
  port: 21920
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;