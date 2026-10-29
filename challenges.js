/* TechBridge Task 5 + 8: Challenge Hub
   Plain JavaScript only (no frameworks).
   Task 8: the challenges are loaded from the backend API. */

// 1. DATA
// The challenges now come from the API (GET /api/challenges), not from this file.
var challenges = [];
var loadState = "loading";   // "loading" | "ready" | "error"

// 2. STATE: the currently selected filters
var filters = { track: "All", difficulty: "All", search: "" };

// DOM references
var cardsEl = document.getElementById("cards");
var countEl = document.getElementById("count");
var emptyEl = document.getElementById("empty");
var resetBtn = document.getElementById("reset");
var emptyResetBtn = document.getElementById("empty-reset");
var stateEl = document.getElementById("ch-state");
var searchEl = document.getElementById("search");
var modal = document.getElementById("modal");
var lastOpener = null;

// Turn a difficulty label into a level from 1 to 3
function getLevel(difficulty) {
  if (difficulty === "Beginner") { return 1; }
  if (difficulty === "Intermediate") { return 2; }
  return 3;
}

// The 4-bar difficulty meter (same style as the other TechBridge pages)
function buildMeter(level) {
  var bars = "";
  for (var i = 1; i <= 4; i++) {
    bars += '<i class="' + (i <= level ? "on" : "") + '"></i>';
  }
  return '<span class="meter" aria-hidden="true">' + bars + "</span>";
}

function trackClass(track) {
  return track === "Web Development" ? "web" : "data";
}

// Escape text before putting it into HTML
function esc(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// 3. FILTERING: returns only the challenges that match every active filter
function getVisible() {
  var term = filters.search.trim().toLowerCase();
  return challenges.filter(function (c) {
    var okTrack = filters.track === "All" || c.track === filters.track;
    var okLevel = filters.difficulty === "All" || c.difficulty === filters.difficulty;
    var okSearch = term === "" || c.title.toLowerCase().indexOf(term) !== -1;
    return okTrack && okLevel && okSearch;
  });
}

function isFiltered() {
  return filters.track !== "All" || filters.difficulty !== "All" || filters.search.trim() !== "";
}

// 4. RENDER: draw the cards, the count and the "no results" message
function renderState() {
  if (loadState === "ready") { stateEl.hidden = true; stateEl.innerHTML = ""; return; }
  stateEl.hidden = false;
  if (loadState === "loading") {
    stateEl.className = "state-box";
    stateEl.innerHTML = '<span class="spinner" aria-hidden="true"></span><p class="state-title">Loading challenges...</p>';
  } else {
    stateEl.className = "state-box state-error";
    stateEl.innerHTML = "<h3>Unable to load challenges.</h3><p>Please try again.</p>" +
      '<p class="state-hint">Is the backend running? Start it with <code>npm start</code> inside the backend folder.</p>' +
      '<button type="button" class="btn btn-outline" id="ch-retry">Try again</button>';
  }
}

function render() {
  renderState();
  if (loadState !== "ready") {
    cardsEl.innerHTML = "";
    emptyEl.hidden = true;
    resetBtn.hidden = true;
    countEl.textContent = loadState === "loading" ? "Loading challenges..." : "Challenges unavailable";
    return;
  }
  var list = getVisible();
  var html = "";
  list.forEach(function (c) {
    html +=
      '<article class="ch-card ' + trackClass(c.track) + '">' +
        '<div class="tag-row">' +
          '<span class="track-tag">' + esc(c.track) + "</span>" +
          '<span class="level">' + buildMeter(getLevel(c.difficulty)) + esc(c.difficulty) + "</span>" +
        "</div>" +
        "<h3>" + esc(c.title) + "</h3>" +
        "<p>" + esc(c.description) + "</p>" +
        '<p class="outcome"><strong>Expected outcome</strong>' + esc(c.outcome) + "</p>" +
        '<button type="button" class="btn btn-green" data-id="' + c.id + '" aria-label="View challenge: ' + esc(c.title) + '">View Challenge</button>' +
      "</article>";
  });
  cardsEl.innerHTML = html;

  if (list.length === 0) {
    countEl.textContent = "No challenges match your filters";
  } else if (!isFiltered()) {
    countEl.textContent = "Showing all " + challenges.length + " challenges";
  } else {
    countEl.textContent = "Showing " + list.length + " of " + challenges.length + " challenges";
  }
  emptyEl.hidden = list.length !== 0;
  resetBtn.hidden = !isFiltered();
}

// 5. FILTER BUTTONS: update the state, highlight the chosen button, redraw
document.querySelectorAll(".chips").forEach(function (group) {
  group.addEventListener("click", function (e) {
    var btn = e.target.closest(".chip");
    if (!btn) { return; }
    filters[group.getAttribute("data-filter")] = btn.getAttribute("data-value");
    group.querySelectorAll(".chip").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
    render();
  });
});

searchEl.addEventListener("input", function () {
  filters.search = searchEl.value;
  render();
});

function resetFilters() {
  filters = { track: "All", difficulty: "All", search: "" };
  searchEl.value = "";
  document.querySelectorAll(".chips").forEach(function (group) {
    group.querySelectorAll(".chip").forEach(function (b) {
      var on = b.getAttribute("data-value") === "All";
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  });
  render();
}
resetBtn.addEventListener("click", resetFilters);
emptyResetBtn.addEventListener("click", resetFilters);

// 6. CHALLENGE DETAILS: open a popup without leaving the page
function openChallenge(id) {
  var c = challenges.filter(function (item) { return item.id === id; })[0];
  if (!c) { return; }
  document.getElementById("m-tags").innerHTML =
    '<span class="tag-row"><span class="track-tag ' + trackClass(c.track) + '">' + esc(c.track) + "</span>" +
    '<span class="level">' + buildMeter(getLevel(c.difficulty)) + esc(c.difficulty) + "</span></span>";
  document.getElementById("m-title").textContent = c.title;
  document.getElementById("m-lead").textContent = c.description;
  var rows = [
    ["Objective", c.objective],
    ["Skills required", c.skills],
    ["Tools", c.tools],
    ["What you produce", c.produce],
    ["Estimated time", c.time],
    ["Expected result", c.outcome]
  ];
  var facts = "";
  rows.forEach(function (r) {
    facts += "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>";
  });
  document.getElementById("m-facts").innerHTML = facts;
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

cardsEl.addEventListener("click", function (e) {
  var btn = e.target.closest("button[data-id]");
  if (!btn) { return; }
  lastOpener = btn;
  openChallenge(Number(btn.getAttribute("data-id")));
});

document.getElementById("m-close").addEventListener("click", closeModal);
document.getElementById("m-close2").addEventListener("click", closeModal);
// Click on the dark backdrop closes the popup
modal.addEventListener("click", function (e) { if (e.target === modal) { closeModal(); } });
modal.addEventListener("close", function () {
  document.body.classList.remove("modal-open");
  if (lastOpener && document.body.contains(lastOpener)) { lastOpener.focus(); }
});

// 7. LOAD FROM THE API (GET /api/challenges) ----------------------------
function loadChallenges() {
  loadState = "loading";
  render();
  return window.tbRequest("/api/challenges").then(function (data) {
    challenges = data;
    loadState = "ready";
    render();
    // Links from the search page look like challenges.html?open=5
    var wanted = null;
    try { wanted = Number(new URLSearchParams(window.location.search).get("open")); } catch (e) { /* ignore */ }
    if (wanted) { lastOpener = null; openChallenge(wanted); }
  }).catch(function () {
    challenges = [];
    loadState = "error";
    render();
  });
}

stateEl.addEventListener("click", function (e) {
  if (e.target.closest("#ch-retry")) { loadChallenges(); }
});

loadChallenges();
