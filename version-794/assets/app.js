(function() {
  const panel = document.querySelector('.mobile-panel');
  const toggle = document.querySelector('.menu-toggle');

  if (toggle && panel) {
    toggle.addEventListener('click', function() {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('.site-search').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      const input = form.querySelector('input[name="q"]');
      const target = form.getAttribute('data-search-target') || form.getAttribute('action') || './search.html';
      const keyword = input ? input.value.trim() : '';
      if (!keyword) {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      window.location.href = target + '?q=' + encodeURIComponent(keyword);
    });
  });

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    const dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    const prev = hero.querySelector('.hero-prev');
    const next = hero.querySelector('.hero-next');
    let index = 0;
    let timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function() {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function() {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function(dot, dotIndex) {
      dot.addEventListener('click', function() {
        show(dotIndex);
        start();
      });
    });
    show(0);
    start();
  }

  const panelFilter = document.querySelector('[data-filter-panel]');
  const cardList = document.querySelector('[data-card-list]');

  if (panelFilter && cardList) {
    const keywordInput = panelFilter.querySelector('.filter-input');
    const yearSelect = panelFilter.querySelector('.filter-year');
    const typeSelect = panelFilter.querySelector('.filter-type');
    const cards = Array.prototype.slice.call(cardList.querySelectorAll('.movie-card'));
    const empty = document.querySelector('.empty-state');
    const query = new URLSearchParams(window.location.search).get('q') || '';

    if (keywordInput && query) {
      keywordInput.value = query;
    }

    function normalize(value) {
      return String(value || '').toLowerCase();
    }

    function filter() {
      const keyword = normalize(keywordInput ? keywordInput.value : '');
      const year = yearSelect ? yearSelect.value : '';
      const type = typeSelect ? typeSelect.value : '';
      let matched = 0;

      cards.forEach(function(card) {
        const searchText = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        const cardYear = card.getAttribute('data-year') || '';
        const cardType = card.getAttribute('data-type') || '';
        const okKeyword = !keyword || searchText.indexOf(keyword) !== -1;
        const okYear = !year || cardYear === year;
        const okType = !type || cardType.indexOf(type) !== -1;
        const visible = okKeyword && okYear && okType;
        card.hidden = !visible;
        if (visible) {
          matched += 1;
        }
      });

      if (empty) {
        empty.hidden = matched !== 0;
      }
    }

    [keywordInput, yearSelect, typeSelect].forEach(function(control) {
      if (control) {
        control.addEventListener('input', filter);
        control.addEventListener('change', filter);
      }
    });

    filter();
  }
})();
