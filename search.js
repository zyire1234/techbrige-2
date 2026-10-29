/* TechBridge Task 8: Search tasks and challenges
   Asks the API (GET /api/search?q=...) and draws the matching cards.
   Plain JavaScript only (no frameworks). */

var form = document.getElementById("search-form");
var input = document.getElementById("q");
var summary = document.getElementById("summary");
var stateBox = document.getElementById("state");
var taskGroup = document.getElementById("task-results");
var challengeGroup = document.getElementById("challenge-results");
var taskList = document.getElementById("task-list");
var challengeList = document.getElementById("challenge-list");

var LABELS = { "completed": "Completed", "in-progress": "In Progress", "not-started": "Not Started" };
var timer = null;
var requestId = 0;      // used to ignore an old response when a newer search was made

function esc(text) {
  var d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

// Highlight the searched words inside already-escaped text.
function mark(text, terms) {
  var html = esc(text);
  terms.forEach(function (term) {
    if (!term) { return; }
    var safe = esc(term).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp("(" + safe + ")(?![^<]*>)", "gi"), "<mark>$1</mark>");
  });
  return html;
}

function badge(status) {
  var label = LABELS[status] || "Not Started";
  var cls = status === "completed" ? "b-done" : (status === "in-progress" ? "b-progress" : "b-todo");
  return '<span class="badge ' + cls + '">' + label + "</span>";
}

function statusClass(status) {
  return status === "completed" ? "s-done" : (status === "in-progress" ? "s-progress" : "s-todo");
}

function levelOf(difficulty) {
  return difficulty === "Beginner" ? 1 : (difficulty === "Intermediate" ? 2 : 3);
}

function meter(level) {
  var bars = "";
  for (var i = 1; i <= 4; i++) { bars += '<i class="' + (i <= level ? "on" : "") + '"></i>'; }
  return '<span class="meter" aria-hidden="true">' + bars + "</span>";
}

// 1. STATES -------------------------------------------------------------
function showState(kind, html) {
  stateBox.hidden = false;
  stateBox.className = kind === "error" ? "state-box state-error search-empty" : "state-box search-empty";
  stateBox.innerHTML = html;
}

function hideResults() {
  taskGroup.hidden = true;
  challengeGroup.hidden = true;
  taskList.innerHTML = "";
  challengeList.innerHTML = "";
}

function showIdle() {
  hideResults();
  summary.textContent = "";
  showState("info", "<h3>Search the platform</h3><p>Type a keyword above to find tasks and challenges.</p>");
}

function showLoading() {
  hideResults();
  summary.textContent = "";
  showState("info", '<span class="spinner" aria-hidden="true"></span><p class="state-title">Searching...</p>');
}

function showError() {
  hideResults();
  summary.textContent = "";
  showState("error", "<h3>Unable to load results.</h3><p>Please try again.</p>" +
    '<p class="state-hint">Is the backend running? Start it with <code>npm start</code> inside the backend folder.</p>' +
    '<button type="button" class="btn btn-outline" id="retry">Try again</button>');
}

// 2. RENDER -------------------------------------------------------------
function renderResults(data) {
  var terms = data.query.toLowerCase().split(/\s+/);
  var total = data.tasks.length + data.challenges.length;

  if (total === 0) {
    hideResults();
    summary.textContent = "";
    showState("info", "<h3>No matching results found.</h3><p>Nothing matched &ldquo;" + esc(data.query) + "&rdquo;. Try a different keyword, such as JavaScript or SQL.</p>");
    return;
  }

  stateBox.hidden = true;
  summary.textContent = total + (total === 1 ? " result" : " results") + " for \u201C" + data.query + "\u201D";

  taskList.innerHTML = "";
  data.tasks.forEach(function (t) {
    var card = document.createElement("article");
    card.className = "t-card " + statusClass(t.status);
    card.innerHTML =
      '<p class="t-no">Task ' + t.id + "</p>" +
      "<h3>" + mark(t.title, terms) + "</h3>" +
      "<p>" + mark(t.description, terms) + "</p>" +
      '<p class="t-status"><strong>Status:</strong> ' + badge(t.status) + "</p>" +
      '<div class="t-btns"><a class="btn btn-outline" href="dashboard.html?open=' + t.id + '" aria-label="View task ' + t.id + ' on the dashboard">View Task</a></div>';
    taskList.appendChild(card);
  });
  taskGroup.hidden = data.tasks.length === 0;
  document.getElementById("task-n").textContent = data.tasks.length;

  challengeList.innerHTML = "";
  data.challenges.forEach(function (c) {
    var card = document.createElement("article");
    card.className = "ch-card " + (c.track === "Web Development" ? "web" : "data");
    card.innerHTML =
      '<div class="tag-row"><span class="track-tag">' + esc(c.track) + "</span>" +
      '<span class="level">' + meter(levelOf(c.difficulty)) + esc(c.difficulty) + "</span></div>" +
      "<h3>" + mark(c.title, terms) + "</h3>" +
      "<p>" + mark(c.description, terms) + "</p>" +
      '<p class="outcome"><strong>Expected outcome</strong>' + esc(c.outcome) + "</p>" +
      '<a class="btn btn-green" href="challenges.html?open=' + c.id + '" aria-label="View challenge: ' + esc(c.title) + '">View Challenge</a>';
    challengeList.appendChild(card);
  });
  challengeGroup.hidden = data.challenges.length === 0;
  document.getElementById("challenge-n").textContent = data.challenges.length;
}

// 3. SEARCH -------------------------------------------------------------
function runSearch() {
  var q = input.value.trim();
  var id = ++requestId;

  // Keep the address in sync so a search can be bookmarked or shared.
  try {
    history.replaceState(null, "", q ? "?q=" + encodeURIComponent(q) : window.location.pathname);
  } catch (e) { /* ignore */ }

  if (!q) { showIdle(); return; }
  showLoading();

  window.tbRequest("/api/search?q=" + encodeURIComponent(q)).then(function (data) {
    if (id !== requestId) { return; }
    renderResults(data);
  }).catch(function () {
    if (id !== requestId) { return; }
    showError();
  });
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  clearTimeout(timer);
  runSearch();
});

// Search while typing, after a short pause so we do not ask the server on every key.
input.addEventListener("input", function () {
  clearTimeout(timer);
  timer = setTimeout(runSearch, 300);
});

document.getElementById("suggest").addEventListener("click", function (e) {
  var btn = e.target.closest("button[data-term]");
  if (!btn) { return; }
  input.value = btn.getAttribute("data-term");
  clearTimeout(timer);
  runSearch();
  input.focus();
});

stateBox.addEventListener("click", function (e) {
  if (e.target.closest("#retry")) { runSearch(); }
});

// 4. START --------------------------------------------------------------
(function () {
  var q = "";
  try { q = new URLSearchParams(window.location.search).get("q") || ""; } catch (e) { /* ignore */ }
  input.value = q;
  runSearch();
})();
