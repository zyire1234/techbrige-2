/* TechBridge Task 6: Intern Dashboard
   Plain JavaScript only (no frameworks). */

// 1. DATA ---------------------------------------------------------------
var intern = {
  name: "Alex",
  track: "Web Development Intern"
};

// Every internship task is an object in one array. The cards are built from this data.
var tasks = [
  { id: 1, title: "Build the TechBridge Homepage", status: "Completed", day: "Day 1", page: "index.html",
    description: "Create the first version of the TechBridge website using HTML and CSS.",
    objective: "Design and build the TechBridge homepage with a header, hero section, about area and footer.",
    tech: "HTML5, CSS3", time: "3 to 4 hours",
    builds: "This is the starting point of the whole internship website.",
    deliverable: "A responsive homepage on GitHub and a live link." },
  { id: 2, title: "Build the TechBridge Programs Experience", status: "Completed", day: "Day 4", page: "programs.html",
    description: "Create a Programs experience that presents TechBridge's available learning programs.",
    objective: "Present the Data Analytics and Web Development programs clearly so visitors can compare them.",
    tech: "HTML5, CSS3", time: "3 to 4 hours",
    builds: "Task 1: it reuses the homepage design and navigation.",
    deliverable: "A Programs page linked from the homepage." },
  { id: 3, title: "Build the Internship Tasks Experience", status: "Completed", day: "Day 8", page: "internship-tasks.html",
    description: "Create an interface that presents the TechBridge internship tasks and the internship journey.",
    objective: "Show all 8 internship tasks in order so interns understand the journey from start to finish.",
    tech: "HTML5, CSS3", time: "4 to 5 hours",
    builds: "Tasks 1 and 2: same design system, extended with a task timeline.",
    deliverable: "An Internship Tasks page with a clear task timeline." },
  { id: 4, title: "Build an Interactive Internship Roadmap", status: "Completed", day: "Day 11", page: "roadmap.html",
    description: "Use JavaScript to make the internship experience interactive and track progress.",
    objective: "Turn the static task list into an interactive roadmap that reacts to what the user clicks.",
    tech: "HTML5, CSS3, JavaScript", time: "4 to 6 hours",
    builds: "Task 3: it adds JavaScript behaviour to the internship journey.",
    deliverable: "An interactive roadmap page." },
  { id: 5, title: "Build the TechBridge Challenge Hub", status: "Completed", day: "Day 15", page: "challenges.html",
    description: "Let users explore practical challenges and filter them by track and difficulty.",
    objective: "Build a Challenge Hub where users can filter, search and open challenges to read the full details.",
    tech: "HTML5, CSS3, JavaScript", time: "4 to 6 hours",
    builds: "Task 4: it uses the same JavaScript data, filtering and modal ideas.",
    deliverable: "A working Challenge Hub with 8 challenges." },
  { id: 6, title: "Build the TechBridge Intern Dashboard", status: "In Progress", day: "Day 19", page: "dashboard.html",
    description: "Track progress, view all tasks, explore web technologies and reach the Challenge Hub.",
    objective: "Build an interactive dashboard that behaves like a real working platform instead of a collection of pages.",
    tech: "HTML5, CSS3, JavaScript", time: "4 to 6 hours",
    builds: "Task 5: it links to the Challenge Hub and reuses the filtering and modal skills.",
    deliverable: "A dashboard with progress tracking, task filters, task details and a Technology Explorer." },
  { id: 7, title: "Build the Task Submission System", status: "Not Started", day: "Day 22", page: "",
    description: "Create an interface through which interns can prepare and submit their task work.",
    objective: "Give interns a clear place to prepare their work and submit it for review.",
    tech: "HTML5, CSS3, JavaScript", time: "4 to 6 hours",
    builds: "Task 6: submissions will appear next to the tasks on the dashboard.",
    deliverable: "A submission page with form validation and a confirmation message." },
  { id: 8, title: "Build the Complete TechBridge Internship Platform", status: "Not Started", day: "Day 26", page: "",
    description: "Combine the components built during the internship into one complete platform.",
    objective: "Join all earlier pages into one consistent, polished and responsive internship platform.",
    tech: "HTML5, CSS3, JavaScript", time: "6 to 8 hours",
    builds: "Tasks 1 to 7: this is the final combination of everything you built.",
    deliverable: "The finished TechBridge internship platform, live on the web." }
];

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
var STORAGE_KEY = "tb-dashboard-progress";
var currentFilter = "All";
var lastFocus = null;
var toastTimer = null;
var defaults = tasks.map(function (t) { return t.status; });

var VALID = ["Completed", "In Progress", "Not Started"];

function loadProgress() {
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) { return; }
    tasks.forEach(function (t) {
      if (VALID.indexOf(saved[t.id]) !== -1) { t.status = saved[t.id]; }
    });
  } catch (e) { /* storage unavailable: keep defaults */ }
}

function saveProgress() {
  try {
    var data = {};
    tasks.forEach(function (t) { data[t.id] = t.status; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

// 3. HELPERS ------------------------------------------------------------
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

// 4. RENDER -------------------------------------------------------------
function renderWelcome() {
  var done = countBy("Completed");
  var overall = done === tasks.length ? "Completed" : (done === 0 && countBy("In Progress") === 0 ? "Not Started" : "In Progress");
  $("intern-name").textContent = intern.name;
  $("intern-track").textContent = intern.track;
  $("intern-status").innerHTML = badge(overall);
  $("welcome-msg").textContent = done === tasks.length
    ? "You have finished every task. Well done on completing the TechBridge internship."
    : "Here is your internship at a glance. Keep going, one task at a time.";
}

function renderProgress() {
  var total = tasks.length;
  var done = countBy("Completed");
  var pct = (done / total) * 100;
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
  var t = getCurrent();
  var box = $("current-body");
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
    el.textContent = key === "All" ? tasks.length : countBy(key);
  });
}

function renderTasks() {
  var list = tasks.filter(function (t) { return currentFilter === "All" || t.status === currentFilter; });
  var grid = $("task-grid");
  grid.innerHTML = "";

  list.forEach(function (t) {
    var card = document.createElement("article");
    card.className = "t-card " + statusClass(t.status);
    card.setAttribute("data-id", t.id);

    var buttons = '<button type="button" class="btn btn-outline" data-action="view" data-id="' + t.id + '">View Task</button>';
    if (t.status === "Completed") {
      buttons += '<button type="button" class="btn btn-link" data-action="undo" data-id="' + t.id + '">Undo</button>';
    } else {
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
  renderWelcome();
  renderProgress();
  renderCurrent();
  renderCounts();
  renderTasks();
}

// 5. ACTIONS ------------------------------------------------------------
function completeTask(id) {
  var t = byId(id);
  if (!t || t.status === "Completed") { return; }
  t.status = "Completed";

  // Keep one current task: if nothing is in progress, start the next one.
  var next = null;
  if (!tasks.some(function (x) { return x.status === "In Progress"; })) {
    next = tasks.filter(function (x) { return x.status === "Not Started"; })[0] || null;
    if (next) { next.status = "In Progress"; }
  }

  saveProgress();
  renderAll();
  markDone(id);

  if (countBy("Completed") === tasks.length) {
    showToast("All 8 tasks completed. Congratulations!");
  } else {
    showToast("Task " + id + " marked as completed" + (next ? ". Task " + next.id + " is now in progress." : "."));
  }
}

function undoTask(id) {
  var t = byId(id);
  if (!t || t.status !== "Completed") { return; }
  // Only one task should be in progress: if another is, send this one back to Not Started.
  var busy = tasks.some(function (x) { return x.status === "In Progress"; });
  t.status = busy ? "Not Started" : "In Progress";
  saveProgress();
  renderAll();
  showToast("Task " + id + " moved back to " + t.status.toLowerCase() + ".");
}

function startTask(id) {
  var t = byId(id);
  if (!t || t.status !== "Not Started") { return; }
  t.status = "In Progress";
  saveProgress();
  renderAll();
}

function markDone(id) {
  var card = document.querySelector('.t-card[data-id="' + id + '"]');
  if (!card) { return; }
  card.classList.add("just-done");
  var btn = card.querySelector('[data-action="view"]');
  if (btn) { btn.focus({ preventScroll: true }); }
}

function resetProgress() {
  if (!window.confirm("Reset all task progress back to the starting point?")) { return; }
  tasks.forEach(function (t, i) { t.status = defaults[i]; });
  saveProgress();
  renderAll();
  showToast("Progress has been reset.");
}

// 6. TASK DETAILS (modal) -----------------------------------------------
var modal = $("modal");

function openTask(id, trigger) {
  var t = byId(id);
  if (!t) { return; }
  lastFocus = trigger || null;

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
    actions += '<a class="btn btn-outline" href="' + t.page + '">Open this page</a>';
  }
  actions += '<button type="button" class="btn btn-outline" data-action="modal-close">Back to dashboard</button>';
  $("m-actions").innerHTML = actions;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
  document.body.classList.add("modal-open");
}

function closeModal() {
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

// 7. EVENTS: tracker ----------------------------------------------------
$("task-grid").addEventListener("click", function (e) {
  var btn = e.target.closest("button[data-action]");
  if (!btn) { return; }
  var id = Number(btn.getAttribute("data-id"));
  var action = btn.getAttribute("data-action");
  if (action === "view") { openTask(id, btn); }
  if (action === "complete") { completeTask(id); }
  if (action === "undo") { undoTask(id); }
});

$("current-body").addEventListener("click", function (e) {
  var btn = e.target.closest('button[data-action="continue"]');
  if (!btn) { return; }
  var id = Number(btn.getAttribute("data-id"));
  startTask(id);
  openTask(id, $("current-body").querySelector("button"));
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

// 8. TECHNOLOGY EXPLORER ------------------------------------------------
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

// 9. START --------------------------------------------------------------
loadProgress();
renderAll();
selectTech("next", false);
