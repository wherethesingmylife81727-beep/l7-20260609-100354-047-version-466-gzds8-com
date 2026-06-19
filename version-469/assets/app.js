(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function() {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var next = Number(dot.getAttribute('data-hero-dot')) || 0;
        setSlide(next);
      });
    });
    if (slides.length > 1) {
      setInterval(function() {
        setSlide(current + 1);
      }, 5200);
    }
  }

  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-card-grid]'));
  if (grids.length) {
    var searchInput = document.querySelector('[data-movie-search]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var emptyState = document.querySelector('[data-empty-state]');

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : '');
      var year = yearFilter ? yearFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      var visible = 0;
      grids.forEach(function(grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
        cards.forEach(function(card) {
          var text = normalize(card.getAttribute('data-search'));
          var matchQuery = !query || text.indexOf(query) !== -1;
          var matchYear = !year || card.getAttribute('data-year') === year;
          var matchType = !type || card.getAttribute('data-type') === type;
          var show = matchQuery && matchYear && matchType;
          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });
      });
      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [searchInput, yearFilter, typeFilter].forEach(function(item) {
      if (item) {
        item.addEventListener('input', applyFilters);
        item.addEventListener('change', applyFilters);
      }
    });
  }
})();
