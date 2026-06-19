const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let activeIndex = 0;
    let timer = null;

    const showSlide = (index) => {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('active', slideIndex === activeIndex);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === activeIndex);
        });
    };

    const startTimer = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => {
            showSlide(activeIndex + 1);
        }, 5200);
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            showSlide(Number(dot.dataset.heroDot || 0));
            startTimer();
        });
    });

    if (slides.length > 1) {
        startTimer();
    }
}

const searchInput = document.querySelector('[data-search-input]');
const categoryFilter = document.querySelector('[data-category-filter]');
const movieCards = Array.from(document.querySelectorAll('[data-movie-grid] .movie-card'));

const filterMovies = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const category = categoryFilter ? categoryFilter.value : 'all';

    movieCards.forEach((card) => {
        const text = [
            card.dataset.title || '',
            card.dataset.category || '',
            card.dataset.year || '',
            card.dataset.region || '',
            card.textContent || ''
        ].join(' ').toLowerCase();
        const categoryMatched = category === 'all' || card.dataset.category === category;
        const queryMatched = !query || text.includes(query);
        card.classList.toggle('hidden-by-search', !(categoryMatched && queryMatched));
    });
};

if (searchInput) {
    searchInput.addEventListener('input', filterMovies);
}

if (categoryFilter) {
    categoryFilter.addEventListener('change', filterMovies);
}
