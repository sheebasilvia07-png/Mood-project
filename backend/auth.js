const express = require("express");
const router = express.Router();
const db = require("./db");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }

    const [existing] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.json({ message: "User already exists" });
    }

    await db.promise().query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, password]
    );

    res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ message: "All fields are required" });
    }

    const [result] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (result.length === 0) {
      return res.json({ message: "Invalid credentials" });
    }

    const user = result[0];

    if (user.password.trim() === password.trim()) {
      res.json({ message: "Login successful" });
    } else {
      res.json({ message: "Invalid credentials" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;