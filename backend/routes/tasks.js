// /api/tasks: list, read one, update status, reset
const express = require("express");
const store = require("../store");

const router = express.Router();

function findTask(id) {
  return store.getTasks().find((t) => t.id === id);
}

// GET /api/tasks: all tasks
router.get("/", (req, res) => {
  res.json(store.getTasks());
});

// POST /api/tasks/reset: put every task back to its starting status
// (declared before "/:id" so "reset" is never read as an id)
router.post("/reset", (req, res) => {
  res.json(store.resetTasks());
});

// GET /api/tasks/:id: one task
router.get("/:id", (req, res) => {
  const task = findTask(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: "Task " + req.params.id + " was not found." });
  }
  res.json(task);
});

// PUT /api/tasks/:id: update a task's status. Body: { "status": "completed" }
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = findTask(id);
  if (!task) {
    return res.status(404).json({ error: "Task " + req.params.id + " was not found." });
  }

  const status = store.normalizeStatus(req.body && req.body.status);
  if (!status) {
    return res.status(400).json({
      error: "Invalid status. Use one of: " + store.VALID_STATUSES.join(", ") + "."
    });
  }

  task.status = status;

  // Keep one current task: when a task is completed and nothing else is in
  // progress, the next task that has not started becomes the current one.
  const tasks = store.getTasks();
  let promoted = null;
  if (status === "completed" && !tasks.some((t) => t.status === "in-progress")) {
    promoted = tasks.find((t) => t.status === "not-started") || null;
    if (promoted) { promoted.status = "in-progress"; }
  }

  res.json({ message: "Task " + id + " updated.", task, promoted });
});

module.exports = router;
