(function () {
  var sections = Array.prototype.slice.call(document.querySelectorAll('.chapter'));
  var ids = sections.map(function (s) { return s.id; });
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item'));
  var sidenav = document.getElementById('sidenav');
  var navToggle = document.getElementById('navToggle');
  var progress = document.getElementById('progress');
  var reader = document.getElementById('reader');
  var KEY = 'ace-progress';

  function showSection(id, opts) {
    opts = opts || {};
    sections.forEach(function (s) { s.classList.toggle('active', s.id === id); });
    navItems.forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-target') === id);
    });
    if (!opts.silent) localStorage.setItem(KEY, id);
    if (!opts.noScroll) reader.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    updateProgressBar(id);
    injectChapterNav(id);
    sidenav.classList.remove('open');
  }

  function updateProgressBar(id) {
    var idx = ids.indexOf(id);
    var pct = ids.length > 1 ? (idx / (ids.length - 1)) * 100 : 0;
    progress.style.width = pct + '%';
  }

  function injectChapterNav(id) {
    var idx = ids.indexOf(id);
    var section = document.getElementById(id);
    var old = section.querySelector('.chapternav');
    if (old) old.remove();
    var nav = document.createElement('div');
    nav.className = 'chapternav';
    if (idx > 0) {
      var prev = document.createElement('button');
      prev.textContent = '\u2190 Previous';
      prev.onclick = function () { showSection(ids[idx - 1]); };
      nav.appendChild(prev);
    }
    if (idx < ids.length - 1) {
      var next = document.createElement('button');
      next.textContent = 'Next \u2192';
      next.onclick = function () { showSection(ids[idx + 1]); };
      nav.appendChild(next);
    }
    if (nav.children.length) section.appendChild(nav);
  }

  navItems.forEach(function (b) {
    b.addEventListener('click', function () { showSection(b.getAttribute('data-target')); });
  });

  navToggle.addEventListener('click', function () {
    sidenav.classList.toggle('open');
  });

  document.getElementById('beginBtn').addEventListener('click', function () {
    var saved = localStorage.getItem(KEY);
    showSection(saved && ids.indexOf(saved) > -1 ? saved : 'ch1');
  });

  var startId = ids.indexOf('cover') > -1 ? 'cover' : ids[0];
  showSection(startId, { silent: true, noScroll: true });
})();
