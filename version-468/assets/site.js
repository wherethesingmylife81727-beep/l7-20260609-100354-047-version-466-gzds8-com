(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    function setupMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var menu = document.querySelector(".mobile-nav");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        if (!slides.length || !dots.length) {
            return;
        }
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("active", itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("active", itemIndex === current);
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
                timer = null;
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        var carousel = document.querySelector(".hero-carousel");
        if (carousel) {
            carousel.addEventListener("mouseenter", stop);
            carousel.addEventListener("mouseleave", start);
        }
        start();
    }

    function valueOf(element) {
        return element ? element.value.trim().toLowerCase() : "";
    }

    function setupFilters() {
        var wrapper = document.querySelector(".filter-page");
        if (!wrapper) {
            return;
        }
        var input = document.getElementById("pageSearchInput");
        var yearFilter = document.getElementById("yearFilter");
        var regionFilter = document.getElementById("regionFilter");
        var typeFilter = document.getElementById("typeFilter");
        var cards = Array.prototype.slice.call(wrapper.querySelectorAll(".movie-card"));
        var empty = document.getElementById("emptyState");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        if (input && query) {
            input.value = query;
        }
        function cardText(card) {
            return [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-year") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-type") || "",
                card.getAttribute("data-genre") || "",
                card.getAttribute("data-tags") || "",
                card.textContent || ""
            ].join(" ").toLowerCase();
        }
        function apply() {
            var q = valueOf(input);
            var year = valueOf(yearFilter);
            var region = valueOf(regionFilter);
            var type = valueOf(typeFilter);
            var visible = 0;
            cards.forEach(function (card) {
                var text = cardText(card);
                var match = true;
                if (q && text.indexOf(q) === -1) {
                    match = false;
                }
                if (year && (card.getAttribute("data-year") || "").toLowerCase() !== year) {
                    match = false;
                }
                if (region && (card.getAttribute("data-region") || "").toLowerCase() !== region) {
                    match = false;
                }
                if (type && (card.getAttribute("data-type") || "").toLowerCase() !== type) {
                    match = false;
                }
                card.style.display = match ? "" : "none";
                if (match) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("show", visible === 0);
            }
        }
        [input, yearFilter, regionFilter, typeFilter].forEach(function (control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        apply();
    }

    function playVideo(video) {
        var result = video.play();
        if (result && typeof result.catch === "function") {
            result.catch(function () {
                video.controls = true;
            });
        }
    }

    window.initMoviePlayer = function (videoId, overlayId, source) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        if (!video || !overlay || !source) {
            return;
        }
        var attached = false;
        function attachAndPlay() {
            if (attached) {
                playVideo(video);
                return;
            }
            attached = true;
            overlay.classList.add("is-hidden");
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                playVideo(video);
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                var player = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                video._hlsPlayer = player;
                player.loadSource(source);
                player.attachMedia(video);
                player.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo(video);
                });
                player.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (!data || !data.fatal) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        player.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        player.recoverMediaError();
                    } else {
                        player.destroy();
                    }
                });
                return;
            }
            video.src = source;
            playVideo(video);
        }
        overlay.addEventListener("click", attachAndPlay);
        video.addEventListener("click", function () {
            if (!attached) {
                attachAndPlay();
            }
        });
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
