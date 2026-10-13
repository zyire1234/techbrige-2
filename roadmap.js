/* TechBridge Task 4: Interactive Internship Roadmap
   Plain JavaScript only (no frameworks). */

// 1. VARIABLES: the currently selected track
var currentTrack = "data-analytics";

// 2 + 3. ARRAYS and OBJECTS: each track holds an array of task objects
var tracks = {
  "data-analytics": {
    name: "Data Analytics",
    tasks: [
      { number: 1, title: "Data Cleaning Basics", day: 1, difficulty: "Beginner",
        description: "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types." },
      { number: 2, title: "Formulas & Pivot Tables", day: 4, difficulty: "Beginner",
        description: "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset." },
      { number: 3, title: "Data Visualization", day: 8, difficulty: "Beginner → Intermediate",
        description: "Create charts and a simple dashboard that communicate useful insights from a dataset." },
      { number: 4, title: "Introduction to SQL", day: 11, difficulty: "Beginner → Intermediate",
        description: "Practice basic SQL queries and use them to answer real-world questions about data." },
      { number: 5, title: "SQL Joins & Aggregations", day: 15, difficulty: "Intermediate",
        description: "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables." },
      { number: 6, title: "Lookup Functions & Data Wrangling", day: 19, difficulty: "Intermediate",
        description: "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches." },
      { number: 7, title: "Mini Analysis Project", day: 22, difficulty: "Intermediate",
        description: "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations." },
      { number: 8, title: "Capstone Project", day: 26, difficulty: "Intermediate",
        description: "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables." }
    ]
  },
  "web-development": {
    name: "Web Development",
    tasks: [
      { number: 1, title: "Build the TechBridge Homepage", day: 1, difficulty: "Beginner",
        description: "Create the first version of the TechBridge website using HTML and CSS." },
      { number: 2, title: "Build the TechBridge Programs Experience", day: 4, difficulty: "Beginner",
        description: "Create a Programs experience presenting TechBridge's available learning programs." },
      { number: 3, title: "Build the Internship Tasks Experience", day: 8, difficulty: "Beginner → Intermediate",
        description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey." },
      { number: 4, title: "Build an Interactive Internship Roadmap", day: 11, difficulty: "Beginner → Intermediate",
        description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks." },
      { number: 5, title: "Build the Intern Registration Experience", day: 15, difficulty: "Intermediate",
        description: "Create a professional registration and onboarding interface for TechBridge interns." },
      { number: 6, title: "Build the Task Submission System", day: 19, difficulty: "Intermediate",
        description: "Create an interface through which interns can prepare and submit their task work." },
      { number: 7, title: "Build the Intern Dashboard", day: 22, difficulty: "Intermediate",
        description: "Create a dashboard where an intern can view their profile, progress, tasks and submissions." },
      { number: 8, title: "Build the Complete TechBridge Internship Platform", day: 26, difficulty: "Intermediate",
        description: "Combine the different components created during the internship into a complete TechBridge platform." }
    ]
  }
};

// DOM references
var trackButtons = document.querySelectorAll(".track-btn");
var currentLabel = document.getElementById("current-track");
var timelineEl = document.getElementById("timeline");
var roadmapEl = document.getElementById("roadmap-list");

// 6. CONDITIONAL LOGIC: turn the difficulty label into a level from 1 to 3
function getLevel(difficulty) {
  if (difficulty === "Beginner") {
    return 1;
  } else if (difficulty === "Beginner → Intermediate") {
    return 2;
  } else {
    return 3;
  }
}

// Build the 4-bar difficulty meter (same style as the Internship Tasks page)
function buildMeter(level) {
  var bars = "";
  for (var i = 1; i <= 4; i++) {
    bars += '<i class="' + (i <= level ? "on" : "") + '"></i>';
  }
  return '<span class="meter" aria-hidden="true">' + bars + "</span>";
}

// Day markers along the 30-day line
function renderTimeline(tasks) {
  var html = "";
  tasks.forEach(function (task) {
    var position = ((task.day - 1) / 29) * 100;
    html +=
      '<li class="available" style="--p: ' + position.toFixed(3) + '">' +
      '<a href="#task-' + task.number + '" aria-label="Task ' + task.number + ", Day " + task.day + ": " + task.title + '">' +
      task.number + '<span class="lbl" aria-hidden="true">Day ' + task.day + "</span></a></li>";
  });
  html +=
    '<li class="finish" style="--p: 100"><span class="flag" aria-hidden="true"><i class="pole"></i><i class="pennant"></i></span>' +
    '<span class="lbl">Day 30</span></li>';
  timelineEl.innerHTML = html;
}

// The 8 task cards
function renderTasks(tasks) {
  var html = "";
  tasks.forEach(function (task) {
    var level = getLevel(task.difficulty);
    html +=
      '<li class="stage available solid" id="task-' + task.number + '">' +
        '<p class="stage-day"><span class="d-label">Day</span><span class="d-num">' + task.day + "</span></p>" +
        '<span class="node" aria-hidden="true">' + task.number + "</span>" +
        '<article class="stage-card level-' + level + '">' +
          '<h3><span class="t-no">Task ' + task.number + "</span>" + task.title + "</h3>" +
          '<p class="task-desc">' + task.description + "</p>" +
          '<div class="task-meta">' +
            '<span class="status available">Day ' + task.day + " of 30</span>" +
            '<span class="level">' + buildMeter(level) + "Difficulty: " + task.difficulty +
            '<span class="sr-only"> (level ' + level + " of 3)</span></span>" +
          "</div>" +
        "</article>" +
      "</li>";
  });
  roadmapEl.innerHTML = html;
}

// 4. FUNCTION: display a selected track (7. DOM MANIPULATION)
function showTrack(trackKey) {
  var track = tracks[trackKey];
  if (!track) { return; }

  currentTrack = trackKey;
  currentLabel.textContent = track.name;

  trackButtons.forEach(function (button) {
    var isActive = button.dataset.track === trackKey;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderTimeline(track.tasks);
  renderTasks(track.tasks);
  document.getElementById("roadmap").setAttribute("data-track", trackKey);
}

// 5. EVENT LISTENERS: detect when the visitor selects a track
trackButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTrack(button.dataset.track);
  });
});

// Show the first track when the page loads
showTrack(currentTrack);
