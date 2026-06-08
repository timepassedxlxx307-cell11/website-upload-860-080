(function () {
    "use strict";

    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initializePlayer(shell) {
        var video = shell.querySelector("video");
        var cover = shell.querySelector("[data-player-cover]");
        var source = shell.getAttribute("data-source");
        var hlsInstance = null;
        var prepared = false;

        if (!video || !source) {
            return;
        }

        function prepare() {
            if (prepared) {
                return Promise.resolve();
            }

            prepared = true;

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);

                return new Promise(function (resolve) {
                    hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        resolve();
                    });
                });
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return Promise.resolve();
            }

            video.src = source;
            return Promise.resolve();
        }

        function hideCover() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        }

        function showCover() {
            if (cover) {
                cover.classList.remove("is-hidden");
            }
        }

        function playVideo() {
            prepare().then(function () {
                var playPromise = video.play();

                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {
                        video.controls = true;
                    });
                }
            });
        }

        if (cover) {
            cover.addEventListener("click", function () {
                hideCover();
                playVideo();
            });
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener("play", hideCover);
        video.addEventListener("pause", function () {
            if (video.currentTime === 0) {
                showCover();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    ready(function () {
        document.querySelectorAll(".js-player").forEach(initializePlayer);
    });
})();
