import { H as Hls } from "./video-player-dru42stk.js";

function ready(callback) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
}

function requestPlay(video) {
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
    }
}

function setupPlayer(shell) {
    var video = shell.querySelector("video");
    var overlay = shell.querySelector("[data-play-overlay]");
    var source = shell.getAttribute("data-video-url");
    var hlsInstance = null;
    var loaded = false;

    if (!video || !source) {
        return;
    }

    function loadSource() {
        if (loaded) {
            return;
        }

        loaded = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        }
    }

    function startPlayback() {
        loadSource();

        if (overlay) {
            overlay.classList.add("is-hidden");
        }

        requestPlay(video);
    }

    if (overlay) {
        overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
        if (!loaded) {
            startPlayback();
        }
    });

    video.addEventListener("play", function () {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    });

    window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

ready(function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-video-url]")).forEach(setupPlayer);
});
