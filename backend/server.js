

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
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(" Messages table is ready");
  } catch (err) {
    console.error(" Error creating table:", err);
  }
}

createTable();

// Middleware
app.use(cors());
app.use(express.json());

// Contact form submission route
app.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required"
      });
    }

    // Insert into DB
    await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3)",
      [name, email, message]
    );

    console.log(` Message from ${name} inserted successfully`);

    
    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (err) {
    console.error(" FULL ERROR:", err);

    res.status(500).json({
      success: false,
      error: "Failed to send message"
    });
  }
});

// Health check route 
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running"
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is running"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});