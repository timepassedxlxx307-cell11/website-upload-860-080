(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }

        callback();
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-button");
        var mobileNav = document.querySelector(".mobile-nav");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var prev = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var index = 0;
            var timer = null;

            function show(nextIndex) {
                if (!slides.length) {
                    return;
                }

                index = (nextIndex + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === index);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === index);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(index + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            if (prev) {
                prev.addEventListener("click", function () {
                    show(index - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(index + 1);
                    start();
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                    start();
                });
            });

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        }

        var filterPanels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
        filterPanels.forEach(function (panel) {
            var scope = panel.closest("main") || document;
            var input = panel.querySelector(".filter-input");
            var selects = Array.prototype.slice.call(panel.querySelectorAll(".filter-select"));
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".filter-item"));
            var empty = scope.querySelector(".empty-state");

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function refresh() {
                var query = normalize(input ? input.value : "");
                var activeFilters = selects.map(function (select) {
                    return {
                        field: select.getAttribute("data-filter-field"),
                        value: normalize(select.value)
                    };
                }).filter(function (item) {
                    return item.value !== "";
                });
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-category"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-year")
                    ].join(" "));
                    var matchesQuery = !query || text.indexOf(query) !== -1;
                    var matchesFilters = activeFilters.every(function (item) {
                        return normalize(card.getAttribute("data-" + item.field)).indexOf(item.value) !== -1;
                    });
                    var showCard = matchesQuery && matchesFilters;

                    card.classList.toggle("hidden-by-filter", !showCard);

                    if (showCard) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", refresh);
            }

            selects.forEach(function (select) {
                select.addEventListener("change", refresh);
            });

            refresh();
        });
    });
})();
