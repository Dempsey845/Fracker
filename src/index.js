import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import env from "dotenv";

const app = express();
const port = 5000; // Express backend on port 5000
env.config();

const saltRounds = process.env.SALT_ROUNDS;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Database (PG)
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// API Routes
app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error hashing password: ", err);
          return res.status(500).json({ message: "Server error" });
        } else {
          await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          res.status(201).json({ message: "User registered successfully" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// TODO: Add more API routes like login, logout, etc.

// Serve React's build folder after running 'npm run build' in the React client
if (process.env.NODE_ENV === "production") {
  // Serve static files from React frontend
  app.use(express.static(path.join(__dirname, "client", "build")));

  // Send index.html for all routes that aren't API
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
