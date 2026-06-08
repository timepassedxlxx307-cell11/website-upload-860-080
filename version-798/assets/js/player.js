(function() {
  function useStream(video, stream) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      return;
    }

    video.src = stream;
  }

  function initPlayer(shell) {
    const video = shell.querySelector('video');
    const overlay = shell.querySelector('.player-overlay');
    const button = shell.querySelector('.watch-button');
    const message = shell.querySelector('.player-message');

    if (!video || !button) {
      return;
    }

    const stream = video.getAttribute('data-stream');
    let ready = false;

    function start() {
      if (!stream) {
        if (message) {
          message.textContent = '播放暂时不可用';
        }
        return;
      }

      if (!ready) {
        useStream(video, stream);
        ready = true;
      }

      shell.classList.add('is-playing');
      video.controls = true;

      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function() {
          shell.classList.remove('is-playing');

          if (overlay) {
            overlay.classList.remove('is-hidden');
          }

          if (message) {
            message.textContent = '点击播放按钮继续观看';
          }
        });
      }
    }

    button.addEventListener('click', start);

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function() {
      if (video.paused) {
        start();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cinema-player').forEach(initPlayer);
  });
})();
