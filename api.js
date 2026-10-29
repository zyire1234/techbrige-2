/* TechBridge: shared API helper (Task 8)
   Every page that talks to the backend loads this file first.
   It decides where the API lives and gives pages one function: tbRequest(). */
(function () {
  // Hosting the website and the API on different servers (for example Netlify + Render)?
  // Put the API address here, e.g. "https://techbridge-api.onrender.com". Leave "" otherwise.
  var PRODUCTION_API = "";

  var host = window.location.hostname;
  var isLocal = host === "localhost" || host === "127.0.0.1" || host === ""; // "" = opened as a file

  // 1. A page can set window.TB_API_BASE itself. 2. Otherwise use PRODUCTION_API.
  // 3. Locally, outside the Express server (Live Server, file://), call the API on port 3000.
  // 4. Otherwise the website and the API share one address, so no prefix is needed.
  if (typeof window.TB_API_BASE !== "string") {
    if (PRODUCTION_API) {
      window.TB_API_BASE = PRODUCTION_API;
    } else if (isLocal && window.location.port !== "3000") {
      window.TB_API_BASE = "http://localhost:3000";
    } else {
      window.TB_API_BASE = "";
    }
  }

  // tbRequest("/api/tasks") -> Promise of the parsed JSON.
  // Rejects with an Error when the server cannot be reached (no err.status)
  // or answers with an error code (err.status is set).
  window.tbRequest = function (path, options) {
    options = options || {};
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 8000) : null;
    var init = { method: options.method || "GET", headers: {}, signal: controller ? controller.signal : undefined };
    if (options.body !== undefined) {
      init.headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(options.body);
    }
    return fetch(window.TB_API_BASE + path, init).then(function (res) {
      clearTimeout(timer);
      return res.json().catch(function () { return null; }).then(function (data) {
        if (!res.ok) {
          var err = new Error((data && data.error) || "The server returned an error (" + res.status + ").");
          err.status = res.status;
          throw err;
        }
        return data;
      });
    }, function (networkError) {
      clearTimeout(timer);
      throw networkError;
    });
  };
})();
