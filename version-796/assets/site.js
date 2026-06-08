const ready = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
};

ready(() => {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let currentSlide = 0;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
      dot.setAttribute('aria-current', dotIndex === currentSlide ? 'true' : 'false');
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  document.querySelectorAll('[data-hero-next]').forEach((button) => {
    button.addEventListener('click', () => showSlide(currentSlide + 1));
  });

  document.querySelectorAll('[data-hero-prev]').forEach((button) => {
    button.addEventListener('click', () => showSlide(currentSlide - 1));
  });

  if (slides.length > 1) {
    window.setInterval(() => showSlide(currentSlide + 1), 6200);
  }

  showSlide(0);

  document.querySelectorAll('[data-search-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = form.querySelector('input[name="q"]');
      const query = input ? input.value.trim() : '';
      const prefix = form.getAttribute('data-root-prefix') || './';
      const url = query ? `${prefix}search.html?q=${encodeURIComponent(query)}` : `${prefix}search.html`;
      window.location.href = url;
    });
  });

  const filterInput = document.querySelector('[data-filter-input]');
  const cards = Array.from(document.querySelectorAll('[data-search-card]'));
  const countNode = document.querySelector('[data-filter-count]');

  const applyFilter = (query) => {
    const normalized = query.trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const haystack = (card.getAttribute('data-search-card') || '').toLowerCase();
      const matched = !normalized || haystack.includes(normalized);
      card.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });
    if (countNode) {
      countNode.textContent = String(visible);
    }
  };

  if (filterInput) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    filterInput.value = query;
    filterInput.addEventListener('input', () => applyFilter(filterInput.value));
    applyFilter(query);
  }

  document.querySelectorAll('[data-player]').forEach((wrap) => {
    const video = wrap.querySelector('video');
    const button = wrap.querySelector('[data-play-button]');
    const status = wrap.querySelector('[data-player-status]');
    const source = wrap.getAttribute('data-source');
    let hlsInstance = null;

    const setStatus = (message) => {
      if (status) {
        status.textContent = message;
      }
    };

    const startPlayback = async () => {
      if (!video || !source) {
        return;
      }
      wrap.classList.add('is-playing');
      setStatus('正在加载播放源');

      try {
        if (source.includes('.m3u8') && video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (source.includes('.m3u8')) {
          const module = await import('./hls-vendor-dru42stk.js');
          const Hls = module.H;
          if (Hls && Hls.isSupported()) {
            if (hlsInstance) {
              hlsInstance.destroy();
            }
            hlsInstance = new Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
          } else {
            video.src = source;
          }
        } else {
          video.src = source;
        }

        video.controls = true;
        const playPromise = video.play();
        if (playPromise) {
          await playPromise;
        }
        setStatus('播放中');
      } catch (error) {
        wrap.classList.remove('is-playing');
        video.controls = true;
        setStatus('当前浏览器无法自动播放，请点击播放器控件重试');
      }
    };

    if (button) {
      button.addEventListener('click', startPlayback);
    }
  });
});
