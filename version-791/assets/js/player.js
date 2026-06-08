(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }

        callback();
    }

    window.setupMoviePlayer = function (options) {
        ready(function () {
            var video = document.getElementById(options.videoId);
            var cover = document.getElementById(options.coverId);
            var button = document.getElementById(options.buttonId);
            var prepared = false;
            var hls = null;

            if (!video || !options.url) {
                return;
            }

            function prepare() {
                if (prepared) {
                    return;
                }

                prepared = true;

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = options.url;
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(options.url);
                    hls.attachMedia(video);
                    return;
                }

                video.src = options.url;
            }

            function play() {
                prepare();

                if (cover) {
                    cover.classList.add("is-hidden");
                }

                var promise = video.play();

                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }

            prepare();

            if (cover) {
                cover.addEventListener("click", play);
            }

            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    play();
                });
            }

            video.addEventListener("click", function () {
                if (video.paused) {
                    play();
                }
            });

            window.addEventListener("pagehide", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    };
})();
