/* TechBridge theme switch: optional enhancement. Without JavaScript the site follows the device's light or dark setting. */
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  var media = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.getAttribute('data-theme') || (media.matches ? 'dark' : 'light');
  }
  function update() {
    var dark = current() === 'dark';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('tb-theme', next); } catch (e) {}
    update();
  });
  if (media.addEventListener) media.addEventListener('change', update);
  update();
})();
