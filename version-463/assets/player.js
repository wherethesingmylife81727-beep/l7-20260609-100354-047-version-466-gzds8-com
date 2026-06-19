(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupPlayer(player) {
    var video = player.querySelector("video");
    var button = player.querySelector("[data-play-button]");
    if (!video || !button) {
      return;
    }
    var url = video.getAttribute("data-video-url") || "";
    var initialized = false;
    var hls = null;
    var shouldStart = false;

    function play() {
      var request = video.play();
      if (request && typeof request.then === "function") {
        request.then(function () {
          player.classList.add("is-playing");
          player.classList.remove("is-loading");
        }).catch(function () {
          player.classList.remove("is-loading");
        });
      } else {
        player.classList.add("is-playing");
        player.classList.remove("is-loading");
      }
    }

    function initialize() {
      if (initialized || !url) {
        return;
      }
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (shouldStart) {
            play();
          }
        });
      } else {
        video.src = url;
      }
    }

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      shouldStart = true;
      player.classList.add("is-loading");
      initialize();
      if (!hls) {
        play();
      } else {
        window.setTimeout(function () {
          if (video.paused) {
            play();
          }
        }, 800);
      }
    }

    button.addEventListener("click", start);
    video.addEventListener("play", function () {
      player.classList.add("is-playing");
      player.classList.remove("is-loading");
    });
    video.addEventListener("pause", function () {
      player.classList.remove("is-playing");
    });
  }

  ready(function () {
    Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(setupPlayer);
  });
})();
