require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ import auth routes
const authRoutes = require("./auth");

// ✅ middleware
app.use(cors());
app.use(express.json());


// ✅ auth routes
app.use("/auth", authRoutes);

// ✅ mood route
app.get("/recommend", (req, res) => {
  const mood = req.query.mood;

  const data = {
    happy: {
      songs: [
        "Happy - Pharrell Williams",
        "Good Time - Owl City",
        "Can't Stop the Feeling - Justin Timberlake"
      ],
      activities: [
        "Dance 💃",
        "Go out with friends 🎉",
        "Listen to music 🎧"
      ]
    },

    sad: {
      songs: [
        "Let Her Go - Passenger",
        "Fix You - Coldplay",
        "Someone Like You - Adele"
      ],
      activities: [
        "Watch a movie 🎬",
        "Take a walk 🌿",
        "Write your thoughts ✍️"
      ]
    },

    angry: {
      songs: [
        "Stronger - Kanye West",
        "Believer - Imagine Dragons",
        "Numb - Linkin Park"
      ],
      activities: [
        "Workout 🏋️",
        "Go for a run 🏃",
        "Meditation 🧘"
      ]
    },

    relaxed: {
      songs: [
        "Weightless - Marconi Union",
        "Perfect - Ed Sheeran",
        "Let It Be - The Beatles"
      ],
      activities: [
        "Read a book 📖",
        "Listen to calm music 🎶",
        "Take a nap 😴"
      ]
    }
  };

  res.json(data[mood] || { songs: [], activities: [] });
});

// ✅ start server
app.listen(5000, () => {
  console.log("https://mood-project-x67z.onrender.com");
});