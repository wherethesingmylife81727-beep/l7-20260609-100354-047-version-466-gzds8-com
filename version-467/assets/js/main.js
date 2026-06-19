(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(next) {
      if (!slides.length) {
        return;
      }

      current = (next + slides.length) % slides.length;

      slides.forEach(function (slide, index) {
        slide.classList.toggle('is-active', index === current);
      });

      dots.forEach(function (dot, index) {
        dot.classList.toggle('active', index === current);
      });
    }

    function startTimer() {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        if (timer) {
          window.clearInterval(timer);
          startTimer();
        }
      });
    });

    startTimer();
  }

  var list = document.querySelector('[data-filter-list]');

  if (list) {
    var keywordInput = document.querySelector('[data-filter-keyword]');
    var categorySelect = document.querySelector('[data-filter-category]');
    var typeSelect = document.querySelector('[data-filter-type]');
    var sortSelect = document.querySelector('[data-filter-sort]');
    var resultCount = document.querySelector('[data-result-count]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (keywordInput && query) {
      keywordInput.value = query;
    }

    function cardValue(card, key) {
      return card.getAttribute(key) || '';
    }

    function applyFilter() {
      var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var category = categorySelect ? categorySelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var sort = sortSelect ? sortSelect.value : 'year-desc';

      cards.sort(function (a, b) {
        if (sort === 'year-asc') {
          return Number(cardValue(a, 'data-year')) - Number(cardValue(b, 'data-year'));
        }

        if (sort === 'heat-desc') {
          return Number(cardValue(b, 'data-heat')) - Number(cardValue(a, 'data-heat'));
        }

        if (sort === 'title-asc') {
          return cardValue(a, 'data-title').localeCompare(cardValue(b, 'data-title'), 'zh-Hans-CN');
        }

        return Number(cardValue(b, 'data-year')) - Number(cardValue(a, 'data-year'));
      });

      var visible = 0;

      cards.forEach(function (card) {
        var haystack = cardValue(card, 'data-text').toLowerCase();
        var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchedCategory = !category || cardValue(card, 'data-category') === category;
        var matchedType = !type || cardValue(card, 'data-type') === type;
        var matched = matchedKeyword && matchedCategory && matchedType;

        card.style.display = matched ? '' : 'none';
        list.appendChild(card);

        if (matched) {
          visible += 1;
        }
      });

      if (resultCount) {
        resultCount.textContent = '筛选结果：' + visible + ' 部';
      }
    }

    [keywordInput, categorySelect, typeSelect, sortSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  var jump = document.querySelector('[data-play-jump]');

  if (jump) {
    jump.addEventListener('click', function (event) {
      event.preventDefault();
      var player = document.querySelector('[data-player]');
      var button = document.querySelector('.player-cover');

      if (player) {
        player.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      if (button) {
        window.setTimeout(function () {
          button.click();
        }, 360);
      }
    });
  }
})();
