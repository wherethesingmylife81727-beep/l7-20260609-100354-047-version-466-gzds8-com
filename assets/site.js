(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-main-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupTabs() {
        var roots = Array.prototype.slice.call(document.querySelectorAll('[data-tabs]'));
        roots.forEach(function (root) {
            var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-tab-target]'));
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    var targetId = button.getAttribute('data-tab-target');
                    var panel = document.getElementById(targetId);
                    buttons.forEach(function (item) {
                        item.classList.toggle('is-active', item === button);
                    });
                    Array.prototype.slice.call(document.querySelectorAll('[data-tab-panel]')).forEach(function (item) {
                        item.classList.toggle('is-active', item === panel);
                    });
                });
            });
        });
    }

    function setupPageFilters() {
        var scope = document.querySelector('[data-filter-scope]');
        if (!scope) {
            return;
        }
        var input = document.querySelector('[data-filter-input]');
        var type = document.querySelector('[data-filter-type]');
        var region = document.querySelector('[data-filter-region]');
        var empty = document.querySelector('[data-empty-filter]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));

        function apply() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var typeValue = type ? type.value : '';
            var regionValue = region ? region.value : '';
            var visibleCount = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year')
                ].join(' ').toLowerCase();
                var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchType = !typeValue || card.getAttribute('data-type') === typeValue;
                var matchRegion = !regionValue || card.getAttribute('data-region') === regionValue;
                var visible = matchKeyword && matchType && matchRegion;
                card.hidden = !visible;
                if (visible) {
                    visibleCount += 1;
                }
            });

            if (empty) {
                empty.hidden = visibleCount !== 0;
            }
        }

        [input, type, region].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
        apply();
    }

    function createResultCard(movie) {
        var article = document.createElement('article');
        article.className = 'movie-card';
        article.innerHTML = [
            '<a class="poster-shell" href="' + movie.url + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
            '    <span class="poster-fallback">' + escapeHtml(movie.title) + '</span>',
            '    <img class="poster-image" src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '    <span class="poster-badge">' + escapeHtml(movie.year_text) + '</span>',
            '    <span class="poster-play">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '    <h3 class="movie-card-title"><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
            '    <p class="movie-card-meta">' + escapeHtml(movie.region_bucket) + ' · ' + escapeHtml(movie.type_bucket) + '</p>',
            '    <p class="movie-card-desc">' + escapeHtml(movie.one_line || '') + '</p>',
            '</div>'
        ].join('');
        var image = article.querySelector('img');
        image.addEventListener('error', function () {
            image.style.display = 'none';
            image.parentElement.classList.add('poster-missing');
        });
        return article;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function setupSearchApp() {
        var app = document.querySelector('[data-search-app]');
        if (!app) {
            return;
        }
        var input = app.querySelector('[data-search-input]');
        var type = app.querySelector('[data-search-type]');
        var region = app.querySelector('[data-search-region]');
        var results = app.querySelector('[data-search-results]');
        var count = app.querySelector('[data-search-count]');
        var movies = [];
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input && query) {
            input.value = query;
        }

        function render() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var typeValue = type ? type.value : '';
            var regionValue = region ? region.value : '';
            var filtered = movies.filter(function (movie) {
                var haystack = [
                    movie.title,
                    movie.region,
                    movie.region_bucket,
                    movie.type,
                    movie.type_bucket,
                    movie.year_text,
                    movie.genre_raw,
                    (movie.tags || []).join(' '),
                    movie.one_line
                ].join(' ').toLowerCase();
                return (!keyword || haystack.indexOf(keyword) !== -1)
                    && (!typeValue || movie.type_bucket === typeValue)
                    && (!regionValue || movie.region_bucket === regionValue);
            }).slice(0, 96);

            results.innerHTML = '';
            filtered.forEach(function (movie) {
                results.appendChild(createResultCard(movie));
            });
            count.textContent = filtered.length ? '找到 ' + filtered.length + ' 条结果，最多显示前 96 条。' : '没有找到匹配影片。';
        }

        fetch('assets/movies.json')
            .then(function (response) { return response.json(); })
            .then(function (data) {
                movies = data;
                render();
            })
            .catch(function () {
                count.textContent = '片库载入失败，请检查 assets/movies.json 是否存在。';
            });

        [input, type, region].forEach(function (control) {
            if (control) {
                control.addEventListener('input', render);
                control.addEventListener('change', render);
            }
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupTabs();
        setupPageFilters();
        setupSearchApp();
    });
})();
