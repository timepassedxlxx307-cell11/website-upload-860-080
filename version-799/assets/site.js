(function () {
    var menuButton = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.mobile-nav');
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var open = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;
        var show = function (index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        };
        var restart = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5000);
        };
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(active - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(active + 1);
                restart();
            });
        }
        restart();
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var filterInputs = Array.prototype.slice.call(document.querySelectorAll('.page-filter'));
    var filterCards = Array.prototype.slice.call(document.querySelectorAll('.filter-list .movie-card'));
    var applyFilter = function (value) {
        var words = String(value || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
        filterCards.forEach(function (card) {
            var text = (card.getAttribute('data-search') || '').toLowerCase();
            var matched = words.every(function (word) {
                return text.indexOf(word) !== -1;
            });
            card.classList.toggle('is-filtered-out', words.length > 0 && !matched);
        });
    };
    filterInputs.forEach(function (input) {
        if (query) {
            input.value = query;
        }
        input.addEventListener('input', function () {
            applyFilter(input.value);
        });
    });
    if (query && filterInputs.length) {
        applyFilter(query);
    }
}());

function initMoviePlayer(videoId, buttonId, url) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    if (!video || !button || !url) {
        return;
    }
    var ready = false;
    var player = null;
    var prepare = function () {
        if (ready) {
            return;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            ready = true;
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            player = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false,
                backBufferLength: 90
            });
            player.loadSource(url);
            player.attachMedia(video);
            ready = true;
            return;
        }
        video.src = url;
        ready = true;
    };
    var start = function () {
        prepare();
        button.classList.add('is-hidden');
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    };
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
        button.classList.remove('is-hidden');
    });
}
