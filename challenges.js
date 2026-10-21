/* TechBridge Task 5: Challenge Hub
   Plain JavaScript only (no frameworks). */

// 1. DATA: every challenge is an object in one array
var challenges = [
  { id: 1, title: "Monthly Sales Dashboard", track: "Data Analytics", difficulty: "Beginner",
    description: "Analyze a small retail sales dataset and find out which products and months perform best.",
    outcome: "A one-page dashboard showing monthly sales performance.",
    objective: "Clean a small sales dataset and turn it into charts that show trends in revenue by product and by month.",
    skills: "Data cleaning, formulas, Pivot Tables, basic charts",
    tools: "Google Sheets or Excel",
    produce: "A cleaned dataset, a Pivot Table summary and a dashboard with at least three charts.",
    time: "3 to 4 hours" },
  { id: 2, title: "Customer Churn Analysis", track: "Data Analytics", difficulty: "Intermediate",
    description: "Explore customer records to discover who is leaving a subscription service, and why.",
    outcome: "A short report with the main churn drivers and two recommendations.",
    objective: "Calculate the churn rate, compare it across customer groups and recommend ways to keep more customers.",
    skills: "SQL queries, GROUP BY and aggregates, data comparison, writing insights",
    tools: "SQL (SQLite or MySQL), Google Sheets or Excel",
    produce: "The queries you wrote, a summary table of churn by segment and a one-page findings report.",
    time: "5 to 6 hours" },
  { id: 3, title: "Company Expense Analysis", track: "Data Analytics", difficulty: "Beginner",
    description: "Review a year of company expenses and spot where the money is going.",
    outcome: "A summary sheet that ranks spending categories and highlights unusual costs.",
    objective: "Organize raw expense records, group them by category and flag anything that looks unusually high.",
    skills: "Sorting and filtering, SUMIF formulas, Pivot Tables, conditional formatting",
    tools: "Google Sheets or Excel",
    produce: "A tidy expense sheet, a category summary and a short list of three cost-saving observations.",
    time: "2 to 3 hours" },
  { id: 4, title: "Employee Data Business Dashboard", track: "Data Analytics", difficulty: "Advanced",
    description: "Combine several related tables into an interactive dashboard for a fictional HR team.",
    outcome: "A multi-table analysis and a dashboard that answers five HR questions.",
    objective: "Join employee, department and salary tables, then build a dashboard that answers questions about headcount, pay and turnover.",
    skills: "SQL joins, lookup functions, data wrangling, dashboard design, storytelling with data",
    tools: "SQL, Excel or Google Sheets (Power BI or Looker Studio optional)",
    produce: "A merged dataset, the SQL used, a dashboard and a short summary for non-technical readers.",
    time: "8 to 10 hours" },
  { id: 5, title: "Responsive Landing Page", track: "Web Development", difficulty: "Beginner",
    description: "Build a clean landing page for a made-up product that looks good on any screen.",
    outcome: "A live, responsive one-page website.",
    objective: "Design and code a landing page with a hero section, features, and a call-to-action that adapts to phones, tablets and desktops.",
    skills: "Semantic HTML, CSS Flexbox or Grid, media queries",
    tools: "HTML, CSS, a code editor, GitHub and Netlify",
    produce: "A GitHub repository and a live website link that works on mobile and desktop.",
    time: "3 to 4 hours" },
  { id: 6, title: "Contact Form with Validation", track: "Web Development", difficulty: "Intermediate",
    description: "Create a contact form that checks the visitor's input and shows helpful messages.",
    outcome: "A working form that blocks bad input and confirms success.",
    objective: "Build a form with name, email and message fields, validate them with JavaScript and give clear feedback without reloading the page.",
    skills: "HTML forms, JavaScript events, DOM manipulation, accessible error messages",
    tools: "HTML, CSS, JavaScript",
    produce: "A form page with validation, error and success messages, and the code on GitHub.",
    time: "4 to 5 hours" },
  { id: 7, title: "Personal Portfolio Website", track: "Web Development", difficulty: "Beginner",
    description: "Present yourself, your skills and your projects in a simple multi-section portfolio.",
    outcome: "A live portfolio you can share with employers.",
    objective: "Plan and build a portfolio with an about section, projects, skills and contact details in a consistent design.",
    skills: "HTML structure, CSS styling, layout and spacing, basic design sense",
    tools: "HTML, CSS, GitHub, Netlify",
    produce: "A live portfolio link and a GitHub repository with organized files.",
    time: "4 to 5 hours" },
  { id: 8, title: "Interactive Product Store", track: "Web Development", difficulty: "Advanced",
    description: "Build a small online store front where visitors can search, filter and add items to a cart.",
    outcome: "A working shopping experience that remembers the cart.",
    objective: "Create a product grid with search and filters, a product details view and a cart with totals that survives a page reload.",
    skills: "JavaScript arrays and objects, DOM updates, localStorage, responsive layout, code organization",
    tools: "HTML, CSS, JavaScript, GitHub, Netlify",
    produce: "A live store, a clean repository and a short README explaining how it works.",
    time: "8 to 10 hours" }
];

// 2. STATE: the currently selected filters
var filters = { track: "All", difficulty: "All", search: "" };

// DOM references
var cardsEl = document.getElementById("cards");
var countEl = document.getElementById("count");
var emptyEl = document.getElementById("empty");
var resetBtn = document.getElementById("reset");
var emptyResetBtn = document.getElementById("empty-reset");
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
function render() {
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

render();
