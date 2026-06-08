(function () {
  function rootPrefix() {
    var depth = document.body ? document.body.getAttribute('data-depth') : '0';
    return depth === '1' ? '../' : '';
  }

  function withPrefix(path) {
    if (!path) {
      return path;
    }
    if (/^(https?:)?\/\//.test(path) || path.indexOf('../') === 0 || path.indexOf('./') === 0) {
      return path;
    }
    return rootPrefix() + path;
  }

  function setupNavigation() {
    var button = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length || !dots.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function next() {
      show((current + 1) % slides.length);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot')) || 0;
        show(index);
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(next, 5200);
      });
    });

    timer = window.setInterval(next, 5200);
  }

  function renderSearchResults(panel, results) {
    if (!panel) {
      return;
    }
    if (!results.length) {
      panel.innerHTML = '<div class="empty-state">没有找到相关影片</div>';
      panel.classList.add('is-open');
      return;
    }
    panel.innerHTML = results.map(function (item) {
      var link = withPrefix(item.link);
      var image = withPrefix(item.image);
      return [
        '<a class="search-result" href="' + link + '">',
        '  <img src="' + image + '" alt="' + escapeHtml(item.title) + '">',
        '  <span>',
        '    <strong>' + escapeHtml(item.title) + '</strong>',
        '    <span>' + escapeHtml(item.year + ' · ' + item.region + ' · ' + item.genre) + '</span>',
        '  </span>',
        '</a>'
      ].join('');
    }).join('');
    panel.classList.add('is-open');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupGlobalSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var index = window.MOVIE_SEARCH_INDEX || [];
    if (!inputs.length || !index.length) {
      return;
    }
    inputs.forEach(function (input) {
      var container = input.parentElement;
      var panel = container ? container.querySelector('[data-search-panel]') : null;
      input.addEventListener('input', function () {
        var keyword = input.value.trim().toLowerCase();
        if (!keyword) {
          if (panel) {
            panel.classList.remove('is-open');
            panel.innerHTML = '';
          }
          return;
        }
        var results = index.filter(function (item) {
          return item.searchText.indexOf(keyword) !== -1;
        }).slice(0, 12);
        renderSearchResults(panel, results);
      });
    });
    document.addEventListener('click', function (event) {
      if (event.target.closest('.header-search') || event.target.closest('.big-search')) {
        return;
      }
      document.querySelectorAll('[data-search-panel]').forEach(function (panel) {
        panel.classList.remove('is-open');
      });
    });
  }

  function setupLocalFilters() {
    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
      var grid = scope.parentElement ? scope.parentElement.querySelector('[data-card-grid]') : null;
      if (!grid) {
        return;
      }
      var cards = Array.prototype.slice.call(grid.children);
      var input = scope.querySelector('[data-local-filter]');
      var yearButtons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-year]'));
      var regionButtons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-region]'));
      var activeYear = '';
      var activeRegion = '';
      var empty = document.createElement('div');
      empty.className = 'empty-state is-hidden';
      empty.textContent = '没有找到符合条件的影片';
      grid.after(empty);

      function applyFilters() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var visibleCount = 0;
        cards.forEach(function (card) {
          var title = (card.getAttribute('data-title') || '').toLowerCase();
          var year = card.getAttribute('data-year') || '';
          var region = card.getAttribute('data-region') || '';
          var ok = true;
          if (keyword && title.indexOf(keyword) === -1) {
            ok = false;
          }
          if (activeYear && year !== activeYear) {
            ok = false;
          }
          if (activeRegion && region !== activeRegion) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
          if (ok) {
            visibleCount += 1;
          }
        });
        empty.classList.toggle('is-hidden', visibleCount !== 0);
      }

      if (input) {
        input.addEventListener('input', applyFilters);
      }

      yearButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeYear = button.getAttribute('data-filter-year') || '';
          yearButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          applyFilters();
        });
      });

      regionButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeRegion = button.getAttribute('data-filter-region') || '';
          regionButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          applyFilters();
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHero();
    setupGlobalSearch();
    setupLocalFilters();
  });
})();
