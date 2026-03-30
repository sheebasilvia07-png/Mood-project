const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/recommend/:mood", (req, res) => {
  const mood = req.params.mood;

  db.query(
    "SELECT * FROM recommendations WHERE mood=?",
    [mood],
    (err, result) => {
      if (result.length === 0)
        return res.json({ message: "No data" });

      res.json(result[0]);
    }
  );
});

module.exports = router;