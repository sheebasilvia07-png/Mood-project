const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "hopper.proxy.rlwy.net",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "AbjSlBTJBoSxJHCCclxslixBHhDZXGLX",
  database: process.env.MYSQLDATABASE || "railway",
  port: process.env.MYSQLPORT || 21920
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB connection failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;