// TechBridge Task 7: Task Management API
// Node.js + Express. Task data is read from data/tasks.json and kept in memory.

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. DATA ---------------------------------------------------------------
const DATA_FILE = path.join(__dirname, "data", "tasks.json");
const VALID_STATUSES = ["completed", "in-progress", "not-started"];

function readTasksFromFile() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// The live list lives in memory. Restarting the server loads tasks.json again.
let tasks = readTasksFromFile();

// Accepts "completed", "Completed", "In Progress", "in_progress"... and returns
// the stored form ("in-progress"), or null when it is not a valid status.
function normalizeStatus(value) {
  if (typeof value !== "string") { return null; }
  const s = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return VALID_STATUSES.includes(s) ? s : null;
}

function findTask(id) {
  return tasks.find((t) => t.id === id);
}

// 2. MIDDLEWARE ---------------------------------------------------------
// Parse JSON request bodies (needed for PUT).
app.use(express.json());

// Allow the dashboard to call the API when it is opened from another origin,
// for example VS Code Live Server on http://127.0.0.1:5500.
app.use((req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  if (req.method === "OPTIONS") { return res.sendStatus(204); }
  next();
});

// 3. API ENDPOINTS ------------------------------------------------------

// Health check: the dashboard uses this for "Backend Status".
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /api/tasks: all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET /api/tasks/:id: one task
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: "Task " + req.params.id + " was not found." });
  }
  res.json(task);
});

// PUT /api/tasks/:id: update a task's status. Body: { "status": "completed" }
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: "Task " + req.params.id + " was not found." });
  }

  const status = normalizeStatus(req.body && req.body.status);
  if (!status) {
    return res.status(400).json({
      error: "Invalid status. Use one of: " + VALID_STATUSES.join(", ") + "."
    });
  }

  task.status = status;

  // Keep one current task: when a task is completed and nothing else is in
  // progress, the next task that has not started becomes the current one.
  let promoted = null;
  if (status === "completed" && !tasks.some((t) => t.status === "in-progress")) {
    promoted = tasks.find((t) => t.status === "not-started") || null;
    if (promoted) { promoted.status = "in-progress"; }
  }

  res.json({ message: "Task " + id + " updated.", task, promoted });
});

// POST /api/tasks/reset: put every task back to the original data (used by "Reset progress").
app.post("/api/tasks/reset", (req, res) => {
  tasks = readTasksFromFile();
  res.json(tasks);
});

// Unknown API routes return JSON instead of an HTML page.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Endpoint not found." });
});

// 4. SERVE THE WEBSITE --------------------------------------------------
// The website files sit in the folder above /backend. Serving them here means
// http://localhost:3000/dashboard.html and /api/tasks share one origin.
const SITE_DIR = path.join(__dirname, "..");
app.use("/backend", (req, res) => res.status(404).send("Not found"));
app.use(express.static(SITE_DIR));

// 5. ERRORS -------------------------------------------------------------
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  console.log("TechBridge API running at http://localhost:" + PORT);
  console.log("Dashboard: http://localhost:" + PORT + "/dashboard.html");
});
