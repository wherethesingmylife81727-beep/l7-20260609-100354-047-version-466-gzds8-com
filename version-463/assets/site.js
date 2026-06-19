(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-menu]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var wrappers = Array.prototype.slice.call(document.querySelectorAll("[data-filter-page]"));
    wrappers.forEach(function (wrapper) {
      var input = wrapper.querySelector("[data-filter-keyword]");
      var region = wrapper.querySelector("[data-filter-region]");
      var type = wrapper.querySelector("[data-filter-type]");
      var year = wrapper.querySelector("[data-filter-year]");
      var empty = wrapper.querySelector("[data-filter-empty]");
      var cards = Array.prototype.slice.call(wrapper.querySelectorAll(".movie-card"));
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q") || "";

      if (input && initial) {
        input.value = initial;
      }

      function valueOf(node) {
        return node ? node.value.trim() : "";
      }

      function apply() {
        var keyword = valueOf(input).toLowerCase();
        var regionValue = valueOf(region);
        var typeValue = valueOf(type);
        var yearValue = valueOf(year);
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title") || "",
            card.getAttribute("data-region") || "",
            card.getAttribute("data-type") || "",
            card.getAttribute("data-year") || "",
            card.getAttribute("data-genre") || "",
            card.getAttribute("data-tags") || ""
          ].join(" ").toLowerCase();
          var matched = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            matched = false;
          }
          if (regionValue && card.getAttribute("data-region") !== regionValue) {
            matched = false;
          }
          if (typeValue && card.getAttribute("data-type") !== typeValue) {
            matched = false;
          }
          if (yearValue && card.getAttribute("data-year") !== yearValue) {
            matched = false;
          }
          card.classList.toggle("hidden-card", !matched);
          if (matched) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [input, region, type, year].forEach(function (node) {
        if (node) {
          node.addEventListener("input", apply);
          node.addEventListener("change", apply);
        }
      });
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
