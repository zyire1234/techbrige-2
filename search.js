// GET /api/search?q=javascript: search tasks and challenges together
const express = require("express");
const store = require("../store");

const router = express.Router();

const STATUS_WORDS = { "completed": "completed", "in-progress": "in progress", "not-started": "not started" };

// Every word typed must appear somewhere in the item's text (case-insensitive).
function matches(terms, parts) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  return terms.every((term) => text.includes(term));
}

router.get("/", (req, res) => {
  const q = String(req.query.q || "").trim().slice(0, 100);
  if (!q) {
    return res.json({ query: "", tasks: [], challenges: [] });
  }
  const terms = q.toLowerCase().split(/\s+/);

  const tasks = store.getTasks().filter((t) => matches(terms, [
    "task " + t.id, t.title, t.description, t.objective, t.tech, t.builds, t.deliverable,
    STATUS_WORDS[t.status]
  ]));

  const challenges = store.getChallenges().filter((c) => matches(terms, [
    c.title, c.track, c.difficulty, c.description, c.outcome, c.objective, c.skills, c.tools, c.produce
  ]));

  res.json({ query: q, tasks, challenges });
});

module.exports = router;
