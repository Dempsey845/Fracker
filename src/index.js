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

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000; // Express backend on port 5000
env.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10);

// Allow requests from the frontend (React app running on port 3000)
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true, // Allow cookies/session credentials
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
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
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/dashboard");
          });
          res.status(201).json({ message: "User registered successfully" });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
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

app.get("/logout", (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } else {
    res.redirect("/");
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
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comapring passwords: ", err);
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
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
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
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
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
