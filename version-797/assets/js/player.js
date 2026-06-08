(function () {
  function preparePlayer(shell) {
    var video = shell.querySelector('video[data-video-source]');
    var button = shell.querySelector('[data-play-button]');
    var status = shell.parentElement ? shell.parentElement.querySelector('[data-player-status]') : null;
    var source = video ? video.getAttribute('data-video-source') : '';
    var hls = null;
    var initialized = false;

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function initializeSource() {
      if (!video || !source || initialized) {
        return;
      }
      initialized = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus('播放源加载完成，可以开始观看。');
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放源暂时无法加载，请稍后重试。');
            if (hls) {
              hls.destroy();
              hls = null;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        setStatus('播放源加载完成，可以开始观看。');
      } else {
        video.src = source;
        setStatus('播放器已绑定播放源，当前浏览器可能需要 HLS 支持。');
      }
    }

    function playVideo() {
      initializeSource();
      if (!video) {
        return;
      }
      shell.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          shell.classList.remove('is-playing');
          setStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
        });
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        playVideo();
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video || event.target.closest('[data-play-button]')) {
        return;
      }
      playVideo();
    });

    if (video) {
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0 || video.ended) {
          shell.classList.remove('is-playing');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-player]').forEach(preparePlayer);
  });
})();
