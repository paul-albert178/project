const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

console.log("DB URL:", process.env.DATABASE_URL);

// Create messages table if it doesn't exist
async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log("Messages table is ready");
}

createTable().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Contact form submission route
app.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    console.log(`Message from ${name} inserted successfully`);

    // Send simple plain text response
    res.send("Message sent successfully");

  } catch (err) {
    console.error("FULL ERROR:", err);
    res.status(500).send("Failed to send message");
  }
});

// Health check route for CI
app.get("/health", (req, res) => {
  res.send("Backend is running!");
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});