require("dotenv").config();

console.log("DB HOST:", process.env.DB_HOST);

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

const axios = require("axios");

let spotifyToken = null;
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  if (spotifyToken && Date.now() < tokenExpiresAt) {
    return spotifyToken;
  }
  
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!client_id || !client_secret) {
    console.error("Missing Spotify credentials in .env");
    return null;
  }

  try {
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: 'grant_type=client_credentials'
    };

    const response = await axios(authOptions);
    spotifyToken = response.data.access_token;
    tokenExpiresAt = Date.now() + ((response.data.expires_in - 60) * 1000);
    return spotifyToken;
  } catch (error) {
    console.error("Spotify Auth Error:", error?.response?.data || error.message);
    return null;
  }
}

async function searchSpotifySongs(mood) {
  const token = await getSpotifyToken();
  if (!token) return [];

  const moodMap = {
    happy: "genre:pop happy",
    sad: "genre:acoustic sad",
    angry: "genre:metal angry",
    relaxed: "genre:chill relaxing"
  };

  const query = moodMap[mood] || 'genre:pop';

  try {
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.tracks.items.map(t => `${t.name} - ${t.artists[0].name}`);
  } catch (error) {
    console.error("Spotify Search Error:", error.message);
    return [];
  }
}

// ✅ mood route
app.post("/recommend", async (req, res) => {
  const mood = req.body.mood;

  const data = {
    happy: { activities: ["Dance 💃", "Go out with friends 🎉", "Listen to music 🎧"] },
    sad:   { activities: ["Watch a movie 🎬", "Take a walk 🌿", "Write your thoughts ✍️"] },
    angry: { activities: ["Workout 🏋️", "Go for a run 🏃", "Meditation 🧘"] },
    relaxed: { activities: ["Read a book 📖", "Listen to calm music 🎶", "Take a nap 😴"] }
  };

  const selectedData = data[mood] || { activities: [] };

  const spotifySongs = await searchSpotifySongs(mood);

  // Fallbacks if Spotify hasn't been configured or hits a rate limit
  const fallbackSongs = {
    happy: ["Happy - Pharrell Williams", "Good Time - Owl City", "Can't Stop the Feeling - Justin Timberlake"],
    sad: ["Let Her Go - Passenger", "Fix You - Coldplay", "Someone Like You - Adele"],
    angry: ["Stronger - Kanye West", "Believer - Imagine Dragons", "Numb - Linkin Park"],
    relaxed: ["Weightless - Marconi Union", "Perfect - Ed Sheeran", "Let It Be - The Beatles"]
  };

  selectedData.songs = spotifySongs.length > 0 ? spotifySongs : (fallbackSongs[mood] || []);

  res.json(selectedData);
});

// ✅ start server
app.listen(5000, () => {
  console.log("https://mood-project-x67z.onrender.com");
});