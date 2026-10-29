/* TechBridge Task 7 + 8: Intern Dashboard connected to the Task Management API
   Builds on the Task 6 dashboard. Plain JavaScript only (no frameworks).
   The tasks are no longer written in this file: they are requested from the
   backend with fetch(). See backend/server.js. */

// 1. DATA ---------------------------------------------------------------
var intern = {
  name: "Alex",
  track: "Web Development Intern"
};

// Where the API lives is decided once in api.js (window.TB_API_BASE).
var API_BASE = typeof window.TB_API_BASE === "string"
  ? window.TB_API_BASE
  : (window.location.port === "3000" ? "" : "http://localhost:3000");

// The tasks now come from the API. This array starts empty and is filled by loadTasks().
var tasks = [];

var techData = {
  next: {
    name: "Next.js",
    tagline: "A React framework for building full web applications",
    what: "Next.js is a framework built on top of React. React alone only handles the user interface, while Next.js adds the extra pieces a real website needs: page routing, server-side rendering, and the ability to build backend API routes in the same project.",
    used: [
      "Marketing sites, blogs and e-commerce stores that must load fast and rank well on search engines",
      "Web apps that need both a fast frontend and a small backend in one codebase",
      "Dashboards and platforms built by teams that already use React"
    ],
    why: "Pages can be rendered on the server before they reach the browser, which improves speed and SEO.",
    url: "https://nextjs.org/docs"
  },
  vue: {
    name: "Vue.js",
    tagline: "A friendly JavaScript framework for interactive interfaces",
    what: "Vue.js is a progressive JavaScript framework for building user interfaces. You split the page into small reusable components, and Vue automatically updates the screen when the data behind it changes. It is known for being easy to learn.",
    used: [
      "Interactive interfaces such as dashboards, forms and admin panels",
      "Single-page applications where the page updates without reloading",
      "Adding interactivity to an existing website step by step"
    ],
    why: "Its gentle learning curve and clear structure make it popular with beginners and small teams.",
    url: "https://vuejs.org/guide/introduction.html"
  },
  angular: {
    name: "Angular",
    tagline: "A complete framework for large, structured applications",
    what: "Angular is a full framework maintained by Google. It is written in TypeScript and comes with routing, forms, HTTP tools and testing built in, so teams do not have to choose many extra libraries.",
    used: [
      "Large enterprise applications such as banking, insurance and internal company tools",
      "Big projects where many developers must follow the same structure",
      "Long-lived products that need strong typing and consistent code"
    ],
    why: "Its opinionated structure keeps large teams and large codebases organised.",
    url: "https://angular.dev/overview"
  },
  backend: {
    name: "Backend Development",
    tagline: "The part of a website that users never see",
    what: "Backend development is the server-side of a web platform. It stores data in a database, applies the business rules, handles logins and security, and sends information to the frontend. The frontend is what the user sees and clicks. When the user does something, the frontend sends a request to the backend, the backend works with the database, and sends the answer back, usually as JSON, for the frontend to display.",
    flow: ["Frontend (browser)", "Request", "Backend (server)", "Database", "Response (JSON)", "Frontend updates"],
    techs: [
      { name: "Node.js", text: "Runs JavaScript on the server, so one language can power both frontend and backend.", url: "https://nodejs.org/en/learn" },
      { name: "Express.js", text: "A small, popular framework on top of Node.js for building web servers and APIs.", url: "https://expressjs.com/" },
      { name: "Django", text: "A Python framework with many features built in: database tools, admin panel and security.", url: "https://docs.djangoproject.com/" },
      { name: "Flask", text: "A lightweight Python framework, ideal for small apps and simple APIs.", url: "https://flask.palletsprojects.com/" },
      { name: "Laravel", text: "A PHP framework known for clean syntax and fast development of web applications.", url: "https://laravel.com/docs" },
      { name: ".NET", text: "Microsoft's platform (C#) for building fast, secure web APIs and enterprise systems.", url: "https://learn.microsoft.com/dotnet/" }
    ],
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction"
  }
};

// 2. STATE --------------------------------------------------------------
var loadState = "loading";      // "loading" | "ready" | "error"
var backendOnline = null;       // null = checking, true = connected, false = offline
var currentFilter = "All";
var lastFocus = null;
var toastTimer = null;
var modalRequest = 0;           // lets us ignore an old "View Task" response

// The API stores statuses as "completed", "in-progress", "not-started".
// The dashboard shows readable labels, so we translate in both directions.
var LABELS = { "completed": "Completed", "in-progress": "In Progress", "not-started": "Not Started" };
var SLUGS = { "Completed": "completed", "In Progress": "in-progress", "Not Started": "not-started" };

// 3. API ----------------------------------------------------------------
// One small helper for every request: sends it, checks the response, returns the JSON.
function api(path, options) {
  options = options || {};
  var controller = typeof AbortController === "function" ? new AbortController() : null;
  var timer = controller ? setTimeout(function () { controller.abort(); }, 8000) : null;
  var init = { method: options.method || "GET", headers: {}, signal: controller ? controller.signal : undefined };
  if (options.body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(options.body);
  }

  return fetch(API_BASE + path, init).then(function (res) {
    clearTimeout(timer);
    return res.json().catch(function () { return null; }).then(function (data) {
      if (!res.ok) {
        // The server answered, but with an error (404, 400...).
        var err = new Error((data && data.error) || "The server returned an error (" + res.status + ").");
        err.status = res.status;
        throw err;
      }
      setBackendStatus(true);
      return data;
    });
  }, function (networkError) {
    // The server could not be reached at all.
    clearTimeout(timer);
    setBackendStatus(false);
    throw networkError;
  });
}

function fromApi(t) {
  var copy = {};
  Object.keys(t).forEach(function (k) { copy[k] = t[k]; });
  copy.status = LABELS[t.status] || "Not Started";
  return copy;
}

function setBackendStatus(online) {
  if (backendOnline === online) { return; }
  backendOnline = online;
  renderBackendStatus();
  // The backend came back after an error: load the tasks again by itself.
  if (online && loadState === "error") { loadTasks(); }
}

function checkBackend() {
  if (document.hidden) { return; }
  var controller = typeof AbortController === "function" ? new AbortController() : null;
  var timer = controller ? setTimeout(function () { controller.abort(); }, 4000) : null;
  fetch(API_BASE + "/api/health", { signal: controller ? controller.signal : undefined })
    .then(function (res) { clearTimeout(timer); setBackendStatus(res.ok); })
    .catch(function () { clearTimeout(timer); setBackendStatus(false); });
}

// 4. HELPERS ------------------------------------------------------------
function $(id) { return document.getElementById(id); }

function esc(text) {
  var d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

function byId(id) {
  return tasks.filter(function (t) { return t.id === id; })[0];
}

function countBy(status) {
  return tasks.filter(function (t) { return t.status === status; }).length;
}

function statusClass(status) {
  if (status === "Completed") { return "s-done"; }
  if (status === "In Progress") { return "s-progress"; }
  return "s-todo";
}

function badge(status) {
  var cls = status === "Completed" ? "b-done" : (status === "In Progress" ? "b-progress" : "b-todo");
  return '<span class="badge ' + cls + '">' + status + "</span>";
}

function formatPercent(n) {
  return Number(n.toFixed(1)) + "%";
}

// The current task is the one in progress, otherwise the first one not started.
function getCurrent() {
  var p = tasks.filter(function (t) { return t.status === "In Progress"; })[0];
  return p || tasks.filter(function (t) { return t.status === "Not Started"; })[0] || null;
}

function showToast(message) {
  var el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
}

// 5. RENDER -------------------------------------------------------------
function renderBackendStatus() {
  var el = $("api-status");
  if (backendOnline === null) {
    el.innerHTML = '<span class="badge b-checking">Checking...</span>';
  } else if (backendOnline) {
    el.innerHTML = '<span class="badge b-done">Connected</span>';
  } else {
    el.innerHTML = '<span class="badge b-offline">Offline</span>';
  }
}

function renderWelcome() {
  $("intern-name").textContent = intern.name;
  $("intern-track").textContent = intern.track;
  if (loadState !== "ready") {
    $("intern-status").innerHTML = '<span class="badge b-checking">Unknown</span>';
    return;
  }
  var done = countBy("Completed");
  var overall = done === tasks.length ? "Completed" : (done === 0 && countBy("In Progress") === 0 ? "Not Started" : "In Progress");
  $("intern-status").innerHTML = badge(overall);
  $("welcome-msg").textContent = done === tasks.length
    ? "You have finished every task. Well done on completing the TechBridge internship."
    : "Here is your internship at a glance. Keep going, one task at a time.";
}

function renderProgress() {
  var ids = ["done-count", "total-count", "stat-total", "stat-done", "stat-left"];
  if (loadState !== "ready") {
    ids.forEach(function (id) { $(id).textContent = "-"; });
    $("pct").textContent = "-";
    $("bar-fill").style.width = "0%";
    $("bar").removeAttribute("aria-valuenow");
    $("bar").setAttribute("aria-valuetext", loadState === "loading" ? "Loading" : "Unavailable");
    $("celebrate").hidden = true;
    return;
  }
  var total = tasks.length;
  var done = countBy("Completed");
  var pct = total ? (done / total) * 100 : 0;
  $("done-count").textContent = done;
  $("total-count").textContent = total;
  $("stat-total").textContent = total;
  $("stat-done").textContent = done;
  $("stat-left").textContent = total - done;
  $("pct").textContent = formatPercent(pct);
  $("bar-fill").style.width = pct + "%";
  $("bar").setAttribute("aria-valuenow", String(Math.round(pct)));
  $("bar").setAttribute("aria-valuetext", done + " of " + total + " tasks completed, " + formatPercent(pct));
  $("celebrate").hidden = done !== total;
}

function renderCurrent() {
  var box = $("current-body");
  if (loadState === "loading") { box.innerHTML = "<p>Loading tasks...</p>"; return; }
  if (loadState === "error") { box.innerHTML = "<p>Unable to load tasks.</p>"; return; }
  var t = getCurrent();
  if (!t) {
    box.innerHTML = '<h3>All done</h3><p>Every task is completed. Nothing left to continue.</p>';
    return;
  }
  var label = t.status === "In Progress" ? "Continue Task" : "Start Task";
  box.innerHTML =
    '<p class="t-no">Task ' + t.id + " &middot; " + esc(t.day) + "</p>" +
    "<h3>" + esc(t.title) + "</h3>" +
    "<p>" + esc(t.description) + "</p>" +
    '<button type="button" class="btn btn-green" data-action="continue" data-id="' + t.id + '">' + label + "</button>";
}

function renderCounts() {
  $("status-filters").querySelectorAll("[data-count]").forEach(function (el) {
    var key = el.getAttribute("data-count");
    if (loadState !== "ready") { el.textContent = "-"; return; }
    el.textContent = key === "All" ? tasks.length : countBy(key);
  });
}

// Loading and error messages share one box above the task grid.
function renderState() {
  var box = $("task-state");
  if (loadState === "ready") { box.hidden = true; box.innerHTML = ""; return; }
  box.hidden = false;
  if (loadState === "loading") {
    box.className = "state-box";
    box.innerHTML = '<span class="spinner" aria-hidden="true"></span><p class="state-title">Loading tasks...</p>';
  } else {
    box.className = "state-box state-error";
    box.innerHTML =
      '<h3>Unable to load tasks.</h3>' +
      "<p>Please try again.</p>" +
      '<p class="state-hint">Is the backend running? Start it with <code>npm start</code> inside the backend folder.</p>' +
      '<button type="button" class="btn btn-outline" id="retry-load">Try again</button>';
  }
}

function renderTasks() {
  var grid = $("task-grid");
  grid.innerHTML = "";

  if (loadState !== "ready") {
    $("task-empty").hidden = true;
    $("results-line").textContent = "";
    return;
  }

  var list = tasks.filter(function (t) { return currentFilter === "All" || t.status === currentFilter; });

  list.forEach(function (t) {
    var card = document.createElement("article");
    card.className = "t-card " + statusClass(t.status);
    card.setAttribute("data-id", t.id);

    var buttons = '<button type="button" class="btn btn-outline" data-action="view" data-id="' + t.id + '">View Task</button>';
    if (t.status === "Completed") {
      buttons += '<button type="button" class="btn btn-link" data-action="undo" data-id="' + t.id + '">Undo</button>';
    } else {
      if (t.status === "Not Started") {
        buttons += '<button type="button" class="btn btn-outline" data-action="start" data-id="' + t.id + '">Start Task</button>';
      }
      buttons += '<button type="button" class="btn btn-green" data-action="complete" data-id="' + t.id + '">Mark as Completed</button>';
    }

    card.innerHTML =
      '<p class="t-no">Task ' + t.id + "</p>" +
      "<h3>" + esc(t.title) + "</h3>" +
      "<p>" + esc(t.description) + "</p>" +
      '<p class="t-status"><strong>Status:</strong> ' + badge(t.status) + "</p>" +
      '<div class="t-btns">' + buttons + "</div>";
    grid.appendChild(card);
  });

  $("task-empty").hidden = list.length !== 0;
  $("results-line").textContent = currentFilter === "All"
    ? "Showing all " + tasks.length + " tasks"
    : "Showing " + list.length + " " + currentFilter.toLowerCase() + " " + (list.length === 1 ? "task" : "tasks");
}

function renderAll() {
  renderBackendStatus();
  renderWelcome();
  renderProgress();
  renderCurrent();
  renderCounts();
  renderState();
  renderTasks();
}

// 6. LOAD TASKS (GET /api/tasks) ----------------------------------------
function loadTasks() {
  loadState = "loading";
  renderAll();
  return api("/api/tasks").then(function (data) {
    tasks = data.map(fromApi);
    loadState = "ready";
    renderAll();
    openFromAddress();
  }).catch(function () {
    tasks = [];
    loadState = "error";
    renderAll();
  });
}

// Links from the search page look like dashboard.html?open=3: open that task once.
var openedFromAddress = false;
function openFromAddress() {
  if (openedFromAddress) { return; }
  openedFromAddress = true;
  var id = null;
  try { id = Number(new URLSearchParams(window.location.search).get("open")); } catch (e) { /* ignore */ }
  if (id && byId(id)) { openTask(id, null); }
}

// 7. ACTIONS ------------------------------------------------------------
// Sends the new status to the backend (PUT /api/tasks/:id). The dashboard only
// changes after the backend has answered, so the page always matches the server.
function updateStatus(id, label) {
  return api("/api/tasks/" + id, { method: "PUT", body: { status: SLUGS[label] } }).then(function (res) {
    var t = byId(id);
    if (t) { t.status = LABELS[res.task.status]; }
    if (res.promoted) {
      var next = byId(res.promoted.id);
      if (next) { next.status = LABELS[res.promoted.status]; }
    }
    return res;
  });
}

function updateFailed(id) {
  renderAll();
  showToast("Could not update Task " + id + ". Please check the backend and try again.");
}

function completeTask(id) {
  var t = byId(id);
  if (!t || t.status === "Completed") { return; }
  updateStatus(id, "Completed").then(function (res) {
    renderAll();
    markDone(id);
    if (countBy("Completed") === tasks.length) {
      showToast("All " + tasks.length + " tasks completed. Congratulations!");
    } else {
      showToast("Task " + id + " marked as completed" + (res.promoted ? ". Task " + res.promoted.id + " is now in progress." : "."));
    }
  }).catch(function () { updateFailed(id); });
}

function undoTask(id) {
  var t = byId(id);
  if (!t || t.status !== "Completed") { return; }
  // Only one task should be in progress: if another is, send this one back to Not Started.
  var busy = tasks.some(function (x) { return x.status === "In Progress"; });
  var target = busy ? "Not Started" : "In Progress";
  updateStatus(id, target).then(function () {
    renderAll();
    showToast("Task " + id + " moved back to " + target.toLowerCase() + ".");
  }).catch(function () { updateFailed(id); });
}

function startTask(id) {
  var t = byId(id);
  if (!t) { return Promise.resolve(); }
  if (t.status !== "Not Started") { return Promise.resolve(); }
  return updateStatus(id, "In Progress").then(renderAll);
}

// "Start Task" on a card: Not Started -> In Progress
function startFromCard(id) {
  startTask(id).then(function () {
    showToast("Task " + id + " is now in progress.");
  }).catch(function () { updateFailed(id); });
}

function markDone(id) {
  var card = document.querySelector('.t-card[data-id="' + id + '"]');
  if (!card) { return; }
  card.classList.add("just-done");
  var btn = card.querySelector('[data-action="view"]');
  if (btn) { btn.focus({ preventScroll: true }); }
}

function resetProgress() {
  if (loadState !== "ready") { return; }
  if (!window.confirm("Reset all task progress back to the starting point?")) { return; }
  api("/api/tasks/reset", { method: "POST" }).then(function (data) {
    tasks = data.map(fromApi);
    renderAll();
    showToast("Progress has been reset.");
  }).catch(function () {
    showToast("Could not reset progress. Please check the backend and try again.");
  });
}

// 8. TASK DETAILS (modal, GET /api/tasks/:id) ---------------------------
var modal = $("modal");

function showModalShell() {
  if (typeof modal.showModal === "function") {
    if (!modal.open) { modal.showModal(); }
  } else {
    modal.setAttribute("open", "");
  }
  document.body.classList.add("modal-open");
}

function openTask(id, trigger) {
  lastFocus = trigger || null;
  var request = ++modalRequest;

  // Open straight away with a loading message, then fill it in when the API answers.
  $("m-tags").innerHTML = "<span>Task " + id + "</span>";
  $("m-title").textContent = "Loading task...";
  $("m-lead").textContent = "";
  $("m-facts").innerHTML = "";
  $("m-actions").innerHTML = '<button type="button" class="btn btn-outline" data-action="modal-close">Back to dashboard</button>';
  showModalShell();

  api("/api/tasks/" + id).then(function (data) {
    if (request !== modalRequest) { return; }
    fillModal(fromApi(data));
  }).catch(function (err) {
    if (request !== modalRequest) { return; }
    $("m-title").textContent = "Unable to load this task.";
    $("m-lead").textContent = err.status === 404
      ? "This task could not be found."
      : "Please try again.";
  });
}

function fillModal(t) {
  $("m-tags").innerHTML = "<span>Task " + t.id + " &middot; " + esc(t.day) + "</span>" + badge(t.status);
  $("m-title").textContent = t.title;
  $("m-lead").textContent = t.description;

  var rows = [
    ["Objective", t.objective],
    ["Technologies", t.tech],
    ["Estimated time", t.time],
    ["Builds on", t.builds],
    ["You will deliver", t.deliverable]
  ];
  var facts = $("m-facts");
  facts.innerHTML = "";
  rows.forEach(function (r) {
    var row = document.createElement("div");
    var dt = document.createElement("dt");
    var dd = document.createElement("dd");
    dt.textContent = r[0];
    dd.textContent = r[1];
    row.appendChild(dt);
    row.appendChild(dd);
    facts.appendChild(row);
  });

  var actions = "";
  if (t.status !== "Completed") {
    actions += '<button type="button" class="btn btn-green" data-action="modal-complete" data-id="' + t.id + '">Mark as Completed</button>';
  }
  if (t.page && t.page !== "dashboard.html") {
    actions += '<a class="btn btn-outline" href="' + esc(t.page) + '">Open this page</a>';
  }
  actions += '<button type="button" class="btn btn-outline" data-action="modal-close">Back to dashboard</button>';
  $("m-actions").innerHTML = actions;
}

function closeModal() {
  modalRequest++;
  if (typeof modal.close === "function") { modal.close(); } else { modal.removeAttribute("open"); }
}

modal.addEventListener("close", function () {
  document.body.classList.remove("modal-open");
  if (lastFocus && document.body.contains(lastFocus)) { lastFocus.focus(); }
});
modal.addEventListener("click", function (e) { if (e.target === modal) { closeModal(); } });
$("m-close").addEventListener("click", closeModal);
$("m-actions").addEventListener("click", function (e) {
  var btn = e.target.closest("button");
  if (!btn) { return; }
  if (btn.getAttribute("data-action") === "modal-close") { closeModal(); }
  if (btn.getAttribute("data-action") === "modal-complete") {
    lastFocus = null;
    closeModal();
    completeTask(Number(btn.getAttribute("data-id")));
  }
});

// 9. EVENTS: tracker ----------------------------------------------------
// Stops a second click while the first request is still on its way.
function lockButton(btn, text) {
  btn.disabled = true;
  btn.textContent = text;
}

$("task-grid").addEventListener("click", function (e) {
  var btn = e.target.closest("button[data-action]");
  if (!btn || btn.disabled) { return; }
  var id = Number(btn.getAttribute("data-id"));
  var action = btn.getAttribute("data-action");
  if (action === "view") { openTask(id, btn); }
  if (action === "complete") { lockButton(btn, "Updating..."); completeTask(id); }
  if (action === "undo") { lockButton(btn, "Updating..."); undoTask(id); }
  if (action === "start") { lockButton(btn, "Updating..."); startFromCard(id); }
});

$("current-body").addEventListener("click", function (e) {
  var btn = e.target.closest('button[data-action="continue"]');
  if (!btn || btn.disabled) { return; }
  var id = Number(btn.getAttribute("data-id"));
  lockButton(btn, "Opening...");
  startTask(id).then(function () {
    openTask(id, $("current-body").querySelector("button"));
  }).catch(function () { updateFailed(id); });
});

$("task-state").addEventListener("click", function (e) {
  if (e.target.closest("#retry-load")) { loadTasks(); }
});

function setFilter(value) {
  currentFilter = value;
  $("status-filters").querySelectorAll(".chip").forEach(function (b) {
    var on = b.getAttribute("data-value") === value;
    b.classList.toggle("active", on);
    b.setAttribute("aria-pressed", String(on));
  });
  renderTasks();
}

$("status-filters").addEventListener("click", function (e) {
  var btn = e.target.closest(".chip");
  if (btn) { setFilter(btn.getAttribute("data-value")); }
});
$("show-all").addEventListener("click", function () { setFilter("All"); });
$("reset-progress").addEventListener("click", resetProgress);

// 10. TECHNOLOGY EXPLORER ------------------------------------------------
function renderTech(key) {
  var d = techData[key];
  var html = "<h3>" + esc(d.name) + "</h3>" +
    '<p class="tagline">' + esc(d.tagline) + "</p>" +
    "<p>" + esc(d.what) + "</p>";

  if (key === "backend") {
    html += "<h4>How the frontend and backend connect</h4>" + '<ul class="flow" aria-label="Request flow">';
    d.flow.forEach(function (step, i) {
      if (i > 0) { html += '<li class="arrow" aria-hidden="true">&rarr;</li>'; }
      html += "<li>" + esc(step) + "</li>";
    });
    html += "</ul><h4>Popular backend technologies</h4>" + '<div class="be-grid">';
    d.techs.forEach(function (b) {
      html += '<div class="be-item"><h5>' + esc(b.name) + "</h5><p>" + esc(b.text) + '</p><a href="' + b.url + '" target="_blank" rel="noopener">Learn more</a></div>';
    });
    html += "</div>";
  } else {
    html += "<h4>Commonly used for</h4><ul>";
    d.used.forEach(function (u) { html += "<li>" + esc(u) + "</li>"; });
    html += "</ul><h4>Why developers choose it</h4><p>" + esc(d.why) + "</p>";
  }

  html += '<a class="btn btn-green" href="' + d.url + '" target="_blank" rel="noopener">Learn More</a>';
  $("tech-panel").innerHTML = html;
}

function selectTech(key, focusTab) {
  var tabs = $("tech-tabs").querySelectorAll('[role="tab"]');
  tabs.forEach(function (tab) {
    var on = tab.getAttribute("data-key") === key;
    tab.classList.toggle("active", on);
    tab.setAttribute("aria-selected", String(on));
    tab.setAttribute("tabindex", on ? "0" : "-1");
    if (on) {
      $("tech-panel").setAttribute("aria-labelledby", tab.id);
      if (focusTab) { tab.focus(); }
    }
  });
  renderTech(key);
}

$("tech-tabs").addEventListener("click", function (e) {
  var tab = e.target.closest('[role="tab"]');
  if (tab) { selectTech(tab.getAttribute("data-key"), false); }
});

// Arrow keys move between tabs
$("tech-tabs").addEventListener("keydown", function (e) {
  var tabs = Array.prototype.slice.call($("tech-tabs").querySelectorAll('[role="tab"]'));
  var i = tabs.indexOf(document.activeElement);
  if (i === -1) { return; }
  var n = null;
  if (e.key === "ArrowRight") { n = (i + 1) % tabs.length; }
  if (e.key === "ArrowLeft") { n = (i - 1 + tabs.length) % tabs.length; }
  if (e.key === "Home") { n = 0; }
  if (e.key === "End") { n = tabs.length - 1; }
  if (n !== null) {
    e.preventDefault();
    selectTech(tabs[n].getAttribute("data-key"), true);
  }
});

// 11. START -------------------------------------------------------------
loadTasks();
selectTech("next", false);
checkBackend();
setInterval(checkBackend, 5000);
