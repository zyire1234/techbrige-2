# TechBridge Intern Management Platform

A complete internship platform for TechBridge interns: a professional homepage, an Intern Dashboard with live progress tracking, a Challenge Hub, site-wide search, and a Node.js + Express REST API behind it all.

This project combines the work from Task 5 (Challenge Hub), Task 6 (Intern Dashboard) and Task 7 (Task Management API) into one working platform.

## Project description

Interns use the platform to:

- **Track their internship progress** with a progress bar, completed and remaining counts
- **Access all 8 internship tasks** and open each one for full details
- **Update task status** (Not Started, In Progress, Completed) and see the totals change straight away
- **Explore challenges** in Data Analytics and Web Development, filtered by track and difficulty
- **Search** tasks and challenges from one page
- **Build practical experience** by following the roadmap from the first page to the final project

The website never keeps the task or challenge lists in its own HTML. It asks the backend API for them with `fetch()`, shows a loading message while waiting, and shows an error message if the backend cannot be reached.

## Technologies used

- HTML5
- CSS3 (responsive layout, light and dark mode)
- JavaScript (plain, no frameworks) with `fetch()`
- Node.js
- Express.js
- REST API
- JSON data files

## Main features

- Professional homepage that introduces the platform, with Dashboard and Challenges links
- Intern Dashboard: intern name, track, internship status, total / completed / remaining tasks, progress percentage and progress bar
- Tasks 1 to 8 loaded from the API, each with number, title, description, status and **View Task**
- **View Task** opens a window with extra details, loaded from `GET /api/tasks/:id`, without a page refresh
- **Start Task**, **Mark as Completed** and **Undo** buttons that update the backend and then the dashboard
- Task filters: All, Completed, In Progress, Not Started
- Challenge Hub with 8 challenges (4 Data Analytics, 4 Web Development), each with title, track, difficulty, description, expected outcome and **View Challenge**; filters by track and difficulty plus a name search
- Search page that finds tasks and challenges together, highlights the matches and shows "No matching results found." when nothing matches
- Backend Status indicator (Connected / Offline), checked every 5 seconds
- Loading and error states on the dashboard, Challenge Hub and search page, with a **Try again** button
- Dark mode switch that remembers your choice (localStorage)
- Responsive design for desktop, tablet and mobile

## How to run the project

You need [Node.js](https://nodejs.org/) installed.

```bash
cd backend
npm install
npm start
```

(`npm start` runs `node server.js`, so `node server.js` works too.)

Then open **http://localhost:3000** in your browser.

| Page | Address |
| ---- | ------- |
| Home | http://localhost:3000/index.html |
| Dashboard | http://localhost:3000/dashboard.html |
| Challenge Hub | http://localhost:3000/challenges.html |
| Search | http://localhost:3000/search.html |

The Express server serves both the website and the API, so they share one address. If you open the pages another way (for example VS Code Live Server), they still find the API at `http://localhost:3000`, so keep the backend running.

## Project structure

```
/                          the website (open through the backend)
├── index.html             homepage
├── dashboard.html         Intern Dashboard (progress + task management)
├── challenges.html        Challenge Hub
├── search.html            search tasks and challenges
├── programs.html, internship-tasks.html, roadmap.html   information pages
├── style.css              shared styles (colours, header, footer, buttons, loading/error boxes)
├── dashboard.css, challenges.css, roadmap.css, search.css   page styles
├── api.js                 shared helper: where the API is and how to call it
├── dashboard.js           dashboard logic (fetch tasks, view, update, filters, progress)
├── challenges.js          Challenge Hub logic (fetch challenges, filters, details)
├── search.js              search page logic
├── theme.js               light / dark mode
├── images/                logo and favicon
├── render.yaml            optional deployment config (see Deployment)
└── backend/
    ├── server.js          starts Express, mounts the routes, serves the website
    ├── store.js           loads the JSON data and keeps it in memory
    ├── routes/
    │   ├── tasks.js       /api/tasks
    │   ├── challenges.js  /api/challenges
    │   └── search.js      /api/search
    ├── data/
    │   ├── tasks.json     the 8 internship tasks
    │   └── challenges.json  the 8 challenges
    ├── package.json
    └── package-lock.json
```

## API documentation

Base URL: `http://localhost:3000`

| Method | Endpoint | Purpose |
| ------ | -------- | ------- |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task's status |
| POST | `/api/tasks/reset` | Put every task back to its starting status |
| GET | `/api/challenges` | Get all challenges (optional `?track=` and `?difficulty=`) |
| GET | `/api/challenges/:id` | Get one challenge |
| GET | `/api/search?q=term` | Search tasks and challenges |
| GET | `/api/health` | Check the backend is running |

**PUT /api/tasks/:id** expects `{ "status": "completed" }` (also `in-progress` or `not-started`) and answers with the updated task. When the completed task was the only one in progress, the next task that has not started becomes *in progress* and is returned as `promoted`. An invalid status returns `400`, an unknown id returns `404`.

**GET /api/search?q=javascript** returns `{ "query": "javascript", "tasks": [...], "challenges": [...] }`. Every word typed must appear in the item (title, description, tools, skills and so on), ignoring upper and lower case.

## Testing checklist

- [x] Homepage works and navigation works
- [x] Dashboard loads and Tasks 1 to 8 appear
- [x] API returns tasks, challenges and search results
- [x] View Task shows the correct task
- [x] Task status can be updated and the count, percentage and progress bar change
- [x] Challenge Hub works and the track and difficulty filters work
- [x] Search works and shows a message when nothing matches
- [x] Loading state shows while data is on its way
- [x] Error state shows when the backend is stopped, and the page recovers when it is started again
- [x] Works on mobile, tablet and desktop
- [x] No console errors

## Notes

Task status changes are kept **in memory**. They update the running server straight away, and restarting the server loads `backend/data/tasks.json` again. **Reset progress** on the dashboard does the same without a restart. Storing the data in a database is a possible next step.

## Deployment

The website is static, but the dashboard, Challenge Hub and search need the backend, so the backend must be hosted too.

- **One service (simplest):** deploy the repository as a Node web service, for example on [Render](https://render.com). `render.yaml` is included: it runs `npm install` and `npm start` inside `backend/`, and Express serves the website and the API from one address.
- **Website and API on different hosts** (for example Netlify and Render): deploy the API, then put its address in `PRODUCTION_API` at the top of `api.js`, for example `"https://your-api.onrender.com"`.
