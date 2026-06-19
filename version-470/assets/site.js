(function () {
  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
      return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
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
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    start();
  }

  function setupFiltering() {
    var lists = Array.prototype.slice.call(document.querySelectorAll('[data-movie-list]'));

    if (!lists.length) {
      return;
    }

    var searchInput = document.querySelector('.js-movie-search');
    var typeSelect = document.querySelector('.js-movie-type');
    var yearSelect = document.querySelector('.js-movie-year');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function applyFilter() {
      var query = normalize(searchInput && searchInput.value);
      var type = normalize(typeSelect && typeSelect.value);
      var year = normalize(yearSelect && yearSelect.value);

      lists.forEach(function (list) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .ranking-row'));

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-category')
          ].join(' '));
          var cardType = normalize(card.getAttribute('data-type'));
          var cardYear = normalize(card.getAttribute('data-year'));
          var matched = true;

          if (query && haystack.indexOf(query) === -1) {
            matched = false;
          }

          if (type && cardType.indexOf(type) === -1) {
            matched = false;
          }

          if (year && cardYear.indexOf(year) === -1) {
            matched = false;
          }

          card.classList.toggle('is-filtered-out', !matched);
        });
      });
    }

    [searchInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  function setupPlayers() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-player-start]'));

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var shell = button.closest('[data-player-shell]');
        var video = shell ? shell.querySelector('video') : null;
        var source = button.getAttribute('data-src') || (video && video.getAttribute('data-hls-src'));

        if (!video || !source) {
          return;
        }

        button.classList.add('is-hidden');

        if (window.Hls && window.Hls.isSupported()) {
          if (video._hlsInstance) {
            video._hlsInstance.destroy();
          }

          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          video._hlsInstance = hls;
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = source;
          video.play().catch(function () {});
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFiltering();
    setupPlayers();
  });
})();
