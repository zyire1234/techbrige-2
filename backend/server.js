// TechBridge Intern Management Platform: backend (Tasks 7 and 8)
// Node.js + Express. Serves the REST API under /api and the website files.

const express = require("express");
const path = require("path");

const tasksRouter = require("./routes/tasks");
const challengesRouter = require("./routes/challenges");
const searchRouter = require("./routes/search");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARE ---------------------------------------------------------
// Parse JSON request bodies (needed for PUT).
app.use(express.json());

// Allow the website to call the API when it is opened from another origin,
// for example VS Code Live Server on http://127.0.0.1:5500 or a separate host.
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  if (req.method === "OPTIONS") { return res.sendStatus(204); }
  next();
});

// 2. API ----------------------------------------------------------------
// Health check: the dashboard uses this for "Backend Status".
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", tasksRouter);
app.use("/api/challenges", challengesRouter);
app.use("/api/search", searchRouter);

// Unknown API routes return JSON instead of an HTML page.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// 3. SERVE THE WEBSITE --------------------------------------------------
// The website files sit in the folder above /backend. Serving them here means
// http://localhost:3000/dashboard.html and /api/tasks share one origin.
const SITE_DIR = path.join(__dirname, "..");
app.use("/backend", (req, res) => res.status(404).send("Not found"));
app.use(express.static(SITE_DIR));

// 4. ERRORS -------------------------------------------------------------
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log("TechBridge platform running at http://localhost:" + PORT);
  console.log("Home:      http://localhost:" + PORT + "/index.html");
  console.log("Dashboard: http://localhost:" + PORT + "/dashboard.html");
});
