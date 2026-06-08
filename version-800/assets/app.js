(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function getQuery(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || "";
  }

  function initMobileMenu() {
    var button = document.querySelector(".mobile-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector(".js-hero");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        play();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }

    show(0);
    play();
  }

  function initFilterInputs() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    inputs.forEach(function (input) {
      var target = document.getElementById(input.getAttribute("data-filter-input"));
      if (!target) {
        return;
      }
      var cards = Array.prototype.slice.call(target.querySelectorAll("[data-filter-text]"));
      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.getAttribute("data-filter-text").toLowerCase();
          card.style.display = !keyword || text.indexOf(keyword) >= 0 ? "" : "none";
        });
      });
    });
  }

  function createSearchCard(movie) {
    var card = document.createElement("a");
    card.className = "movie-card";
    card.href = movie.url;

    var poster = document.createElement("div");
    poster.className = "movie-poster";

    var img = document.createElement("img");
    img.src = movie.cover;
    img.alt = movie.title;
    img.loading = "lazy";
    poster.appendChild(img);

    var badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = movie.category;
    poster.appendChild(badge);

    var year = document.createElement("span");
    year.className = "year-badge";
    year.textContent = movie.year || movie.region;
    poster.appendChild(year);

    var body = document.createElement("div");
    body.className = "movie-card-body";

    var title = document.createElement("h3");
    title.className = "movie-title";
    title.textContent = movie.title;
    body.appendChild(title);

    var desc = document.createElement("p");
    desc.className = "movie-desc";
    desc.textContent = movie.oneLine;
    body.appendChild(desc);

    var meta = document.createElement("div");
    meta.className = "movie-meta";
    [movie.region, movie.genre, movie.type].forEach(function (text) {
      if (text) {
        var span = document.createElement("span");
        span.textContent = text;
        meta.appendChild(span);
      }
    });
    body.appendChild(meta);

    card.appendChild(poster);
    card.appendChild(body);
    return card;
  }

  function initSearchPage() {
    var form = document.querySelector(".js-search-page");
    var input = document.querySelector(".js-search-input");
    var grid = document.querySelector(".js-search-results");
    if (!form || !input || !grid || !window.__MOVIE_SEARCH__) {
      return;
    }

    function render(keyword) {
      var key = keyword.trim().toLowerCase();
      var list = window.__MOVIE_SEARCH__.filter(function (movie) {
        var text = [movie.title, movie.region, movie.genre, movie.year, movie.type, movie.category, movie.oneLine].join(" ").toLowerCase();
        return !key || text.indexOf(key) >= 0;
      }).slice(0, 120);

      grid.innerHTML = "";
      if (!list.length) {
        var empty = document.createElement("div");
        empty.className = "no-result";
        empty.textContent = "没有找到匹配影片";
        grid.appendChild(empty);
        return;
      }
      list.forEach(function (movie) {
        grid.appendChild(createSearchCard(movie));
      });
    }

    var initial = getQuery("q");
    input.value = initial;
    render(initial);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var value = input.value.trim();
      var url = value ? "search.html?q=" + encodeURIComponent(value) : "search.html";
      window.history.replaceState(null, "", url);
      render(value);
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".js-player"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector(".player-overlay");
      var button = player.querySelector(".play-icon");
      var videoUrl = player.getAttribute("data-video");
      var loaded = false;

      if (!video || !videoUrl) {
        return;
      }

      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = videoUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(videoUrl);
          hls.attachMedia(video);
          video.hlsInstance = hls;
        } else {
          video.src = videoUrl;
        }
      }

      function start() {
        load();
        if (overlay) {
          overlay.classList.add("is-hidden");
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener("click", start);
      }
      if (button) {
        button.addEventListener("click", start);
      }
      video.addEventListener("click", function () {
        if (video.paused) {
          start();
        }
      });
    });
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initFilterInputs();
    initSearchPage();
    initPlayers();
  });
})();
