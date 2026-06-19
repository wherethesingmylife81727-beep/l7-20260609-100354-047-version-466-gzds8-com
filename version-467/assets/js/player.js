(function () {
  window.initMoviePlayer = function (source) {
    var player = document.querySelector('[data-player]');
    var video = player ? player.querySelector('video') : null;
    var button = player ? player.querySelector('.player-cover') : null;
    var attached = false;
    var hls = null;

    if (!player || !video || !button || !source) {
      return;
    }

    function attachMedia() {
      if (attached) {
        return;
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return;
      }

      video.src = source;
    }

    function start() {
      attachMedia();
      player.classList.add('is-started');
      video.controls = true;

      var playTask = video.play();

      if (playTask && typeof playTask.catch === 'function') {
        playTask.catch(function () {});
      }
    }

    button.addEventListener('click', start);

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();
