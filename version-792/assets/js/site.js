(function () {
    "use strict";

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var body = document.body;
        var mobileToggle = document.querySelector("[data-mobile-toggle]");

        if (mobileToggle) {
            mobileToggle.addEventListener("click", function () {
                body.classList.toggle("nav-open");
            });
        }

        document.querySelectorAll(".site-nav a").forEach(function (link) {
            link.addEventListener("click", function () {
                body.classList.remove("nav-open");
            });
        });

        document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
            var previous = slider.querySelector("[data-hero-prev]");
            var next = slider.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, position) {
                    slide.classList.toggle("is-active", position === current);
                });

                dots.forEach(function (dot, position) {
                    dot.classList.toggle("is-active", position === current);
                });
            }

            function start() {
                stop();
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            function stop() {
                if (timer) {
                    window.clearInterval(timer);
                    timer = null;
                }
            }

            dots.forEach(function (dot) {
                dot.addEventListener("click", function () {
                    show(Number(dot.getAttribute("data-hero-dot")) || 0);
                    start();
                });
            });

            if (previous) {
                previous.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            slider.addEventListener("mouseenter", stop);
            slider.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        document.querySelectorAll("[data-filter-input]").forEach(function (input) {
            var scope = input.closest("main") || document;
            var items = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-item]"));
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");

            function applyFilter() {
                var query = input.value.trim().toLowerCase();

                items.forEach(function (item) {
                    var text = item.textContent.toLowerCase();
                    item.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
                });
            }

            if (initialQuery && !input.value) {
                input.value = initialQuery;
            }

            input.addEventListener("input", applyFilter);
            applyFilter();
        });
    });
})();
