(function () {
    var mobileButton = document.querySelector(".menu-toggle");
    var mobilePanel = document.querySelector(".mobile-panel");

    if (mobileButton && mobilePanel) {
        mobileButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector(".hero");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
        var prev = hero.querySelector(".hero-prev");
        var next = hero.querySelector(".hero-next");
        var active = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(active - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(active + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    var filterPage = document.querySelector(".filter-page");

    if (filterPage) {
        var query = filterPage.querySelector("[data-filter-query]");
        var type = filterPage.querySelector("[data-filter-type]");
        var region = filterPage.querySelector("[data-filter-region]");
        var year = filterPage.querySelector("[data-filter-year]");
        var status = filterPage.querySelector(".filter-status");
        var empty = filterPage.querySelector(".empty-state");
        var cards = Array.prototype.slice.call(filterPage.querySelectorAll(".movie-card"));
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get("q");

        if (query && initialQuery) {
            query.value = initialQuery;
        }

        function applyFilters() {
            var q = normalize(query ? query.value : "");
            var selectedType = normalize(type ? type.value : "");
            var selectedRegion = normalize(region ? region.value : "");
            var selectedYear = normalize(year ? year.value : "");
            var shown = 0;

            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-search"));
                var cardType = normalize(card.getAttribute("data-type"));
                var cardRegion = normalize(card.getAttribute("data-region"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var visible = true;

                if (q && text.indexOf(q) === -1) {
                    visible = false;
                }

                if (selectedType && cardType.indexOf(selectedType) === -1) {
                    visible = false;
                }

                if (selectedRegion && cardRegion.indexOf(selectedRegion) === -1) {
                    visible = false;
                }

                if (selectedYear && cardYear !== selectedYear) {
                    visible = false;
                }

                card.style.display = visible ? "" : "none";

                if (visible) {
                    shown += 1;
                }
            });

            if (status) {
                status.textContent = shown ? "已显示 " + shown + " 部影片" : "没有找到匹配影片";
            }

            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }

        [query, type, region, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }

    function setupPlayer(player) {
        var video = player.querySelector("video");
        var source = video ? video.querySelector("source") : null;
        var button = player.querySelector(".player-start");
        var poster = player.querySelector(".player-poster");
        var hls = null;

        function initVideo() {
            if (!video || !source) {
                return;
            }

            var url = source.getAttribute("src");

            if (!url) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                if (!video.getAttribute("src")) {
                    video.setAttribute("src", url);
                }
            } else if (window.Hls && window.Hls.isSupported()) {
                if (!hls) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                }
            } else if (!video.getAttribute("src")) {
                video.setAttribute("src", url);
            }
        }

        function startPlay(event) {
            if (event) {
                event.preventDefault();
            }

            initVideo();
            player.classList.add("is-playing");

            var playResult = video.play();

            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    player.classList.remove("is-playing");
                });
            }
        }

        initVideo();

        if (button) {
            button.addEventListener("click", startPlay);
        }

        if (poster) {
            poster.addEventListener("click", startPlay);
        }

        if (video) {
            video.addEventListener("play", function () {
                player.classList.add("is-playing");
            });

            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlay();
                } else {
                    video.pause();
                }
            });
        }
    }

    Array.prototype.slice.call(document.querySelectorAll(".player-box")).forEach(setupPlayer);
})();
