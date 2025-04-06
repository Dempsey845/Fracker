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

// Backend Route to Get User Preferences
app.get("/api/user/preferences", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id; // Assuming the user is authenticated

    try {
      const query = "SELECT currency FROM user_preferences WHERE user_id = $1";
      const result = await db.query(query, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "User preferences not found." });
      }

      return res.status(200).json({ currency: result.rows[0].currency });
    } catch (err) {
      console.error("Error fetching user preferences:", err);
      return res.status(500).json({
        message: "An error occurred while fetching user preferences.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

app.get("/api/incomes/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.id; // Get the userId from the URL params

    try {
      const query = "SELECT * FROM incomes WHERE user_id = $1"; // Get all incomes for the user
      const result = await db.query(query, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "No incomes found for this user",
        });
      }

      return res.status(200).json({
        message: "Incomes fetched successfully",
        incomes: result.rows,
      });
    } catch (err) {
      console.error("Error fetching incomes:", err);
      return res.status(500).json({
        message: "An error occurred while fetching incomes.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

app.get("/api/expenses/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.params.id; // Get the userId from the URL params

    try {
      const query = "SELECT * FROM expenses WHERE user_id = $1"; // Get all expenses for the user
      const result = await db.query(query, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "No expenses found for this user",
        });
      }

      return res.status(200).json({
        message: "Expenses fetched successfully",
        expenses: result.rows,
      });
    } catch (err) {
      console.error("Error fetching expenses:", err);
      return res.status(500).json({
        message: "An error occurred while fetching expenses.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

app.post("/api/addincome", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const { amount, note, date, category } = req.body;

    try {
      // Insert the new income into the database
      const insertQuery = `
        INSERT INTO incomes (user_id, amount, note, date, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

      const insertResult = await db.query(insertQuery, [
        userId,
        amount,
        note,
        date,
        category,
      ]);

      return res.status(201).json({
        message: "Income added successfully",
        income: insertResult.rows[0],
      });
    } catch (err) {
      console.error("Error adding income:", err);
      return res.status(500).json({
        message: "An error occurred while adding income.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

app.post("/api/addexpense", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const { amount, note, date, category } = req.body;

    try {
      const insertQuery = `
        INSERT INTO expenses (user_id, amount, note, date, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;

      const insertResult = await db.query(insertQuery, [
        userId,
        amount,
        note,
        date,
        category,
      ]);

      return res.status(201).json({
        message: "Expense added successfully",
        expense: insertResult.rows[0],
      });
    } catch (err) {
      console.error("Error adding expense:", err);
      return res.status(500).json({
        message: "An error occurred while adding Expense.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
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

// Route to update income
app.put("/api/updateincome/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const { amount, note, date, category } = req.body;

    try {
      const updateQuery = `
        UPDATE incomes
        SET amount = $1, note = $2, date = $3, category = $4
        WHERE id = $5 AND user_id = $6
        RETURNING *`;

      const updateResult = await db.query(updateQuery, [
        amount,
        note,
        date,
        category,
        incomeId,
        userId,
      ]);

      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          message:
            "Income not found or you don't have permission to edit this income",
        });
      }

      return res.status(200).json({
        message: "Income updated successfully",
        income: updateResult.rows[0],
      });
    } catch (err) {
      console.error("Error updating income:", err);
      return res.status(500).json({
        message: "An error occurred while updating income.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

// Route to update expense
app.put("/api/updateexpense/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const expenseId = req.params.id;
    const { amount, note, date, category } = req.body;

    try {
      const updateQuery = `
        UPDATE expenses
        SET amount = $1, note = $2, date = $3, category = $4
        WHERE id = $5 AND user_id = $6
        RETURNING *`;

      const updateResult = await db.query(updateQuery, [
        amount,
        note,
        date,
        category,
        expenseId,
        userId,
      ]);

      if (updateResult.rows.length === 0) {
        return res.status(404).json({
          message:
            "Expense not found or you don't have permission to edit this expense",
        });
      }

      return res.status(200).json({
        message: "Expense updated successfully",
        expense: updateResult.rows[0],
      });
    } catch (err) {
      console.error("Error updating expense:", err);
      return res.status(500).json({
        message: "An error occurred while updating expense.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

// Route to delete income
app.delete("/api/deleteincome/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const incomeId = req.params.id;

    try {
      const deleteQuery = `
        DELETE FROM incomes
        WHERE id = $1 AND user_id = $2
        RETURNING *`;

      const deleteResult = await db.query(deleteQuery, [incomeId, userId]);

      if (deleteResult.rows.length === 0) {
        return res.status(404).json({
          message:
            "Income not found or you don't have permission to delete this income",
        });
      }

      return res.status(200).json({
        message: "Income deleted successfully",
        income: deleteResult.rows[0],
      });
    } catch (err) {
      console.error("Error deleting income:", err);
      return res.status(500).json({
        message: "An error occurred while deleting income.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }
});

// Route to delete expense
app.delete("/api/deleteexpense/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const expenseId = req.params.id;

    try {
      const deleteQuery = `
        DELETE FROM expenses
        WHERE id = $1 AND user_id = $2
        RETURNING *`;

      const deleteResult = await db.query(deleteQuery, [expenseId, userId]);

      if (deleteResult.rows.length === 0) {
        return res.status(404).json({
          message:
            "Expense not found or you don't have permission to delete this expense",
        });
      }

      return res.status(200).json({
        message: "Expense deleted successfully",
        expense: deleteResult.rows[0],
      });
    } catch (err) {
      console.error("Error deleting expense:", err);
      return res.status(500).json({
        message: "An error occurred while deleting expense.",
        error: err.message,
      });
    }
  } else {
    return res.status(401).json({
      message: "User not authenticated",
    });
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
