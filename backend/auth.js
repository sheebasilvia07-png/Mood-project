const express = require("express");
const router = express.Router();
const db = require("./db");

// ================= REGISTER =================
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Server error" });
      }

      if (result.length > 0) {
        return res.json({ message: "User already exists" });
      }

      db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err) => {
          if (err) {
            console.log(err);
            return res.json({ message: "Error registering user" });
          }

          res.json({ message: "Registered successfully" });
        }
      );
    }
  );
});

// ================= LOGIN =================
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "All fields are required" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Server error" });
      }

      if (result.length === 0) {
        return res.json({ message: "Invalid credentials" });
      }

      const user = result[0];

      if (user.password.trim() === password.trim()) {
        res.json({ message: "Login successful" });
      } else {
        res.json({ message: "Invalid credentials" });
      }
    }
  );
});

module.exports = router;