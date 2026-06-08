(function() {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      const open = mobileNav.classList.toggle('is-open');
      menuButton.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
    });
  }

  const hero = document.querySelector('[data-hero-carousel]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex) {
        const active = slideIndex === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        showSlide(index + 1);
      }, 5200);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(index - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        showSlide(index + 1);
        schedule();
      });
    }

    showSlide(0);
    schedule();
  }

  const filterInput = document.querySelector('.filter-input');
  const filterGrid = document.querySelector('.filter-grid');
  const chips = Array.from(document.querySelectorAll('.filter-chip'));

  if (filterInput && filterGrid) {
    const cards = Array.from(filterGrid.querySelectorAll('.movie-card'));
    let activeFilter = 'all';

    function applyFilter() {
      const keyword = filterInput.value.trim().toLowerCase();

      cards.forEach(function(card) {
        const text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-tags')
        ].join(' ').toLowerCase();
        const matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchChip = activeFilter === 'all' || text.indexOf(activeFilter.toLowerCase()) !== -1;
        card.hidden = !(matchKeyword && matchChip);
      });
    }

    filterInput.addEventListener('input', applyFilter);

    chips.forEach(function(chip) {
      chip.addEventListener('click', function() {
        chips.forEach(function(item) {
          item.classList.remove('active');
        });
        chip.classList.add('active');
        activeFilter = chip.getAttribute('data-filter') || 'all';
        applyFilter();
      });
    });
  }
})();
