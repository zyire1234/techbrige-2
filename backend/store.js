// In-memory data store. Reads the JSON files in /data once when the server starts.
const fs = require("fs");
const path = require("path");

const TASKS_FILE = path.join(__dirname, "data", "tasks.json");
const CHALLENGES_FILE = path.join(__dirname, "data", "challenges.json");

const VALID_STATUSES = ["completed", "in-progress", "not-started"];

function read(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

let tasks = read(TASKS_FILE);
const challenges = read(CHALLENGES_FILE);

// Accepts "completed", "Completed", "In Progress", "in_progress"... and returns
// the stored form ("in-progress"), or null when it is not a valid status.
function normalizeStatus(value) {
  if (typeof value !== "string") { return null; }
  const s = value.trim().toLowerCase().replace(/[\s_]+/g, "-");
  return VALID_STATUSES.includes(s) ? s : null;
}

module.exports = {
  VALID_STATUSES,
  normalizeStatus,
  getTasks: () => tasks,
  getChallenges: () => challenges,
  // Put every task back to what data/tasks.json says (used by "Reset progress").
  resetTasks: () => { tasks = read(TASKS_FILE); return tasks; }
};
