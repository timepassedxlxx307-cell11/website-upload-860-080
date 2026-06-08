(function() {
  const input = document.getElementById('search-page-input');
  const results = document.getElementById('search-results');
  const title = document.getElementById('search-title');

  if (!input || !results || !window.SEARCH_MOVIES) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initial = params.get('q') || '';
  input.value = initial;

  function card(movie) {
    const tags = (movie.tags || []).slice(0, 3).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<article class="movie-card">' +
      '<a class="movie-poster" href="' + movie.link + '" aria-label="观看 ' + escapeHtml(movie.title) + '">' +
        '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
        '<span class="poster-play">▶</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
        '<div class="card-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span></div>' +
        '<h3><a href="' + movie.link + '">' + escapeHtml(movie.title) + '</a></h3>' +
        '<p>' + escapeHtml(movie.oneLine) + '</p>' +
        '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
    '</article>';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function render(query) {
    const keyword = query.trim().toLowerCase();
    const movies = window.SEARCH_MOVIES;
    let matched = movies;

    if (keyword) {
      matched = movies.filter(function(movie) {
        const text = [
          movie.title,
          movie.year,
          movie.region,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.oneLine
        ].join(' ').toLowerCase();
        return text.indexOf(keyword) !== -1;
      });
    }

    const shown = matched.slice(0, 96);
    results.innerHTML = shown.map(card).join('');
    title.textContent = keyword ? '筛选结果' : '精选推荐';
  }

  input.form.addEventListener('submit', function(event) {
    event.preventDefault();
    const query = input.value.trim();
    const url = new URL(window.location.href);

    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }

    window.history.replaceState(null, '', url.toString());
    render(query);
  });

  input.addEventListener('input', function() {
    render(input.value);
  });

  render(initial);
})();
