import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import path from "path";
import env from "dotenv";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import cors from "cors";
import pgSession from "connect-pg-simple";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000; // Express backend on port 5000
env.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);

const PgSession = pgSession(session);

// Allow requests from the frontend (React app running on port 3000)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // Allow cookies/session credentials
  })
);

// Database (PG)
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(
  session({
    store: new PgSession({
      pool: db,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

console.log(path.join(__dirname, "..", "client", "build"));
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// Intializes Passport for incoming requests, allowing authentication strategies to be applied.
app.use(passport.initialize());
// Middleware that will restore login state from a session.
app.use(passport.session());

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
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hash]
    );
    const user = result.rows[0];

    const login = promisify(req.login.bind(req));
    await login(user);

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Serve the React app's index.html when visiting /dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    // If authenticated, serve the React app (index.html)
    return res.sendFile(
      path.join(__dirname, "..", "client", "build", "index.html")
    );
  } else {
    // If not authenticated, redirect to the login page
    res.redirect("http://localhost:3000/login");
  }
});

// route to get user data (for frontend to fetch)
app.get("/api/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    // Send user data as JSON
    return res.json({
      message: "Authenticated",
      user: req.user, // This contains user data like email, etc.
    });
  } else {
    // If not authenticated, send an error message
    res.status(401).json({ message: "Not Authenticated" });
  }
});

app.get("/api/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true });
  } else {
    return res.json({ isAuthenticated: false });
  }
});

app.post("/api/updatepreferences", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id; // Get the authenticated user's ID
    const { currency, darkMode } = req.body;

    try {
      const result = await db.query(
        "SELECT * FROM user_preferences WHERE user_id = $1",
        [userId]
      );

      if (result.rows.length > 0) {
        // If preferences exist, update them
        const updateQuery = `
          UPDATE user_preferences
          SET currency = $1, dark_mode = $2
          WHERE user_id = $3
          RETURNING *`;
        const updateResult = await db.query(updateQuery, [
          currency,
          darkMode,
          userId,
        ]);
        console.log("Preferences updated");
        return res.status(200).json({
          message: "Preferences updated",
          preferences: updateResult.rows[0],
        });
      } else {
        // If no preferences exist, insert new
        const insertQuery = `
          INSERT INTO user_preferences (user_id, currency, dark_mode)
          VALUES ($1, $2, $3)
          RETURNING *`;
        const insertResult = await db.query(insertQuery, [
          userId,
          currency,
          darkMode,
        ]);
        console.log("Preferences saved");
        return res.status(200).json({
          message: "Preferences saved",
          preferences: insertResult.rows[0],
        });
      }
    } catch (err) {
      console.error("Error updating preferences:", err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(401).json({ message: "User not authenticated" });
  }
});

app.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return next(err);

      // Clear session and cookies
      res.clearCookie("connect.sid"); // Clear session cookie
      req.session.destroy((err) => {
        if (err) return next(err);

        // Optionally send a response to frontend or redirect to login page
        res.status(200).json({ message: "Logout successful" });
      });
    });
  } else {
    res.status(400).json({ message: "User is not authenticated" }); // Handle case where user is not authenticated
  }
});
// Applies the google strategy to the incoming request, in order to authenticate the request.
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/dashboard",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "Login failed" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

passport.use(
  "local",
  new Strategy(
    { usernameField: "email", passwordField: "password" },
    async function verify(username, password, cb) {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1 ", [
          username,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.password;
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                return cb(null, user);
              } else {
                return cb(null, false);
              }
            }
          });
        } else {
          return cb(null, false, { message: "User not found" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/dashboard",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [profile.email, "google"]
          );
          return cb(null, newUser.rows[0]);
        } else {
          return cb(null, result.rows[0]);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);

// Registers a function used to serialize user objects into the session.
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      cb(null, result.rows[0]);
    } else {
      cb(null, false);
    }
  } catch (err) {
    cb(err);
  }
});

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
