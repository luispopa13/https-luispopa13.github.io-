// Import dependencies
const express = require("express");
const cors = require("cors");
const path = require("path");
const { MongoClient } = require("mongodb");
const animeSearch = require("./animeSearch");
const { fetchTrendingAndUpcomingAnime } = require("./trendingAndUpcoming");

// MongoDB URI and database name
const uri = "mongodb://localhost:27017"; // Change if needed
const dbName = "animeDB"; // Database name

// Initialize MongoDB client
const client = new MongoClient(uri);

// Express app setup
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let db;
(async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
})();

// API endpoint for scraping anime
app.get("/api/scrape-anime", async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).json({ error: "Anime title is required." });
  }
  try {
    const animeList = await animeSearch(title);
    res.json(animeList);
  } catch (error) {
    console.error("Error scraping anime:", error.message);
    res.status(500).json({ error: "Failed to fetch anime details." });
  }
});

// API endpoint for trending/upcoming anime
app.get("/api/trending-upcoming", async (req, res) => {
  try {
    const data = await fetchTrendingAndUpcomingAnime();
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending/upcoming anime:", error.message);
    res.status(500).json({ error: "Failed to fetch trending/upcoming anime." });
  }
});

// API endpoint for fetching comments
app.get("/api/comments/:animeId", async (req, res) => {
  const { animeId } = req.params;
  try {
    const comments = await db.collection("comments").findOne({ animeId });
    res.json(comments || { animeId, comments: [] });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// API endpoint for posting comments
app.post("/api/comments", async (req, res) => {
  const { animeId, comment } = req.body;
  if (!animeId || !comment) {
    return res.status(400).json({ error: "animeId and comment are required." });
  }
  try {
    await db.collection("comments").updateOne(
      { animeId },
      { $push: { comments: { comment, timestamp: new Date() } } },
      { upsert: true }
    );
    res.status(200).json({ message: "Comment added successfully." });
  } catch (error) {
    console.error("Error posting comment:", error.message);
    res.status(500).json({ error: "Failed to post comment." });
  }
});

// Serve React frontend
// Update buildPath if your build folder is located at the project root:
const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));

// Catch-all route for React Router (ensure API routes are defined above)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
