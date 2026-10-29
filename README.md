# TechBridge Internship Website

Static TechBridge website (Tasks 1 to 6) plus the **Task 7 Task Management API**, which powers the Intern Dashboard.

```
Intern Dashboard (dashboard.html + dashboard.js)
        |  fetch()
        v
REST API  ->  Node.js + Express (backend/server.js)
        |
        v
Task data (backend/data/tasks.json)
```

## Project structure

```
/                       website files (index.html, dashboard.html, dashboard.js, dashboard.css, ...)
backend/
├── server.js           Express server and API endpoints
├── package.json
├── package-lock.json
└── data/
    └── tasks.json      the 8 internship tasks
```

## Run it locally

```bash
cd backend
npm install
npm start
```

Then open **http://localhost:3000/dashboard.html**.

The Express server also serves the website files, so the dashboard and the API share one address. If you open the dashboard another way (for example VS Code Live Server), it still finds the API at `http://localhost:3000`.

## API documentation

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task's status |
| GET | `/api/health` | Check the backend is running (used by "Backend Status") |
| POST | `/api/tasks/reset` | Put every task back to its starting status (used by "Reset progress") |

### GET /api/tasks
Returns every task as a JSON array. The dashboard uses it to build the task cards, the progress bar and the filters.

### GET /api/tasks/:id
Returns one task, for example `GET /api/tasks/3` returns Task 3. If the task does not exist the server answers `404` with `{ "error": "Task 99 was not found." }`. The **View Task** button uses this endpoint to fill the task window.

### PUT /api/tasks/:id
Updates the status of one task. Send JSON:

```json
{ "status": "completed" }
```

Valid statuses are `completed`, `in-progress` and `not-started`. The response is:

```json
{ "message": "Task 7 updated.", "task": { "id": 7, "status": "completed" }, "promoted": { "id": 8, "status": "in-progress" } }
```

`promoted` is the next task that moved to *in progress* automatically when the completed task was the only one in progress (otherwise it is `null`). An invalid status returns `400`, an unknown id returns `404`. The **Mark as Completed** button uses this endpoint, then the dashboard updates the progress count and percentage.

### Task object

```json
{
  "id": 1,
  "title": "Build the TechBridge Homepage",
  "description": "Create the first version of the TechBridge website using HTML and CSS.",
  "status": "completed",
  "day": "Day 1",
  "page": "index.html",
  "objective": "...",
  "tech": "HTML5, CSS3",
  "time": "3 to 4 hours",
  "builds": "...",
  "deliverable": "..."
}
```

## How the dashboard uses the API

- **Loading state:** "Loading tasks..." is shown while the request is on its way.
- **Error state:** if the backend cannot be reached, the dashboard shows "Unable to load tasks. Please check your connection or try again." with a **Try again** button. It also retries by itself when the backend comes back.
- **Backend Status:** the hero shows *Connected* or *Offline*, checked every 5 seconds.
- **Filters:** All, Completed, In Progress and Not Started filter the tasks received from the API.

## Notes

Task data is kept **in memory**. Changing a status updates the running server, and restarting the server loads `data/tasks.json` again (a fresh start). Storing the data in a database is the optional challenge.

## Testing checklist

1. Open the dashboard: the tasks load.
2. Stop the backend and refresh: the error message appears.
3. Start the backend again: the dashboard recovers.
4. Click **View Task**: the correct task opens.
5. Click **Mark as Completed**: the status changes.
6. The progress count and percentage update.
7. The filters still work.
