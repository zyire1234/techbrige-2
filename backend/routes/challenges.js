// /api/challenges: list (with optional filters) and read one
const express = require("express");
const store = require("../store");

const router = express.Router();

// GET /api/challenges?track=Web%20Development&difficulty=Beginner
router.get("/", (req, res) => {
  const { track, difficulty } = req.query;
  let list = store.getChallenges();
  if (track) { list = list.filter((c) => c.track.toLowerCase() === String(track).toLowerCase()); }
  if (difficulty) { list = list.filter((c) => c.difficulty.toLowerCase() === String(difficulty).toLowerCase()); }
  res.json(list);
});

// GET /api/challenges/:id
router.get("/:id", (req, res) => {
  const challenge = store.getChallenges().find((c) => c.id === Number(req.params.id));
  if (!challenge) {
    return res.status(404).json({ error: "Challenge " + req.params.id + " was not found." });
  }
  res.json(challenge);
});

module.exports = router;
