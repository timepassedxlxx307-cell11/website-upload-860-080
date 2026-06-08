(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var searchInput = document.querySelector("[data-site-search]");
        var searchCards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));

        function applySearch(value) {
            var keyword = String(value || "").trim().toLowerCase();

            searchCards.forEach(function (card) {
                var haystack = String(card.getAttribute("data-search-text") || "").toLowerCase();
                var matched = !keyword || haystack.indexOf(keyword) !== -1;
                card.classList.toggle("is-hidden", !matched);
            });
        }

        if (searchInput && searchCards.length) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q") || "";
            searchInput.value = query;
            applySearch(query);

            searchInput.addEventListener("input", function () {
                applySearch(searchInput.value);
            });
        }

        Array.prototype.slice.call(document.querySelectorAll("img")).forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("is-hidden");
            });
        });
    });
})();
