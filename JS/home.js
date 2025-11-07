class HomePage extends HTMLElement {
    async connectedCallback() {
        // Load HTML and CSS
        const [html, css] = await Promise.all([
            fetch('/Components/pages/home/HomePage.html').then(res => res.text()),
            fetch('/Components/pages/home/HomePage.css').then(res => res.text())
        ]);

        // Apply CSS globally (once)
        if (!document.querySelector('style[data-homepage]')) {
            const styleTag = document.createElement('style');
            styleTag.textContent = css;
            styleTag.setAttribute('data-homepage', '');
            document.head.appendChild(styleTag);
        }

        // Inject HTML content
        this.innerHTML = html;

        // ----------------- Button Navigation ----------------- //
        const buttons = this.querySelectorAll('button[data-page]');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const page = button.getAttribute('data-page');
                window.dispatchEvent(new CustomEvent('navigate', { detail: { page } }));
            });
        });

        // ----------------- Bootstrap Gallery Carousel ----------------- //
        const galleryEl = this.querySelector('#galleryCarousel');
        if (galleryEl && window.bootstrap && typeof bootstrap.Carousel === 'function') {
            const bsCarousel = new bootstrap.Carousel(galleryEl, { interval: 3000 });

            // Control buttons
            const indicators = this.querySelectorAll('.carousel-indicators button[data-bs-slide-to]');
            indicators.forEach((btn, idx) => btn.addEventListener('click', () => bsCarousel.to(idx)));

            const prevBtn = this.querySelector('.carousel-control-prev');
            const nextBtn = this.querySelector('.carousel-control-next');
            if (prevBtn) prevBtn.addEventListener('click', () => bsCarousel.prev());
            if (nextBtn) nextBtn.addEventListener('click', () => bsCarousel.next());

            galleryEl.addEventListener('mouseenter', () => bsCarousel.pause());
            galleryEl.addEventListener('mouseleave', () => bsCarousel.cycle());
        }

        // ----------------- Hero Background Carousel ----------------- //
        const heroSlides = this.querySelectorAll('.hero-slide');
        let heroIndex = 0;
        if (heroSlides.length) {
            function showHeroSlide(index) {
                heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === index));
            }
            function nextHeroSlide() {
                heroIndex = (heroIndex + 1) % heroSlides.length;
                showHeroSlide(heroIndex);
            }
            showHeroSlide(heroIndex);
            setInterval(nextHeroSlide, 3000);
        }

        // ----------------- Fade-in Info Cards on Scroll ----------------- //
        const cards = this.querySelectorAll('.info-card');
        function fadeInOnScroll() {
            const triggerBottom = window.innerHeight * 0.85;
            cards.forEach(card => {
                const cardTop = card.getBoundingClientRect().top;
                if (cardTop < triggerBottom) card.classList.add('animate');
            });
        }
        window.addEventListener('scroll', fadeInOnScroll);
        window.addEventListener('load', fadeInOnScroll);

        // ----------------- News Carousel (simple slick-dot logic) ----------------- //
        function setupNewsBoard() {
            const newsCarousel = document.querySelector('.news-carousel');
            const newsItems = document.querySelectorAll('.news-carousel .news-item');
            const slickDots = document.querySelector('.slick-dots');
            if (!newsCarousel || !newsItems.length || !slickDots) return;

            let visibleCount = 1;
            let newsIndex = 0;

            function updateVisibleCount() {
                const width = newsCarousel.offsetWidth;
                const itemWidth = newsItems[0]?.offsetWidth || 270;
                visibleCount = Math.floor(width / itemWidth) || 1;
            }

            function showNews(index, forceUpdate = false) {
                if (forceUpdate) updateVisibleCount();
                const total = newsItems.length;
                const totalPages = Math.ceil(total / visibleCount);
                const start = Math.min(Math.floor(index / visibleCount) * visibleCount, (totalPages - 1) * visibleCount);
                const end = start + visibleCount;

                newsItems.forEach((item, i) => {
                    item.style.display = (i >= start && i < end) ? 'block' : 'none';
                    item.classList.toggle('news-fade-in', i >= start && i < end);
                });

                Array.from(slickDots.children).forEach((li, i) => li.classList.toggle('slick-active', i === Math.floor(start / visibleCount)));
                newsIndex = start;
            }

            function createDots() {
                updateVisibleCount();
                slickDots.innerHTML = '';
                const dotCount = Math.ceil(newsItems.length / visibleCount);
                for (let i = 0; i < dotCount; i++) {
                    const li = document.createElement('li');
                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.innerHTML = '<span></span>';
                    btn.addEventListener('click', () => showNews(i * visibleCount));
                    li.appendChild(btn);
                    slickDots.appendChild(li);
                }
            }

            window.addEventListener('resize', () => {
                const oldCount = visibleCount;
                updateVisibleCount();
                if (oldCount !== visibleCount) {
                    createDots();
                    showNews(0, true);
                }
            });

            createDots();
            showNews(0, true);
        }

        // Initialize when DOM loaded
        if (document.querySelector('.news-carousel') && document.querySelector('.slick-dots')) {
            setupNewsBoard();
        } else {
            const observer = new MutationObserver(() => {
                if (document.querySelector('.news-carousel') && document.querySelector('.slick-dots')) {
                    observer.disconnect();
                    setupNewsBoard();
                }
            });
            observer.observe(this, { childList: true, subtree: true });
        }
    }
}

customElements.define('home-page', HomePage);


// =====================================================================
// Professional Scroll Animation with Intersection Observer API
// =====================================================================

/**
 * Industry-standard scroll animation implementation
 * Uses Intersection Observer for optimal performance
 * Triggers fade-up animations when elements enter viewport
 */
document.addEventListener('DOMContentLoaded', function () {
    // Configuration for the observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -100px 0px', // trigger slightly before element is fully visible
        threshold: 0.15 // trigger when 15% of element is visible
    };

    // Callback function for intersection observer
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            // When element enters viewport
            if (entry.isIntersecting) {
                // Add 'animated' class to trigger the animation
                entry.target.classList.add('animated');

                // Optional: Stop observing after animation (one-time animation)
                // Comment out the line below if you want animations to repeat
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the intersection observer
    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Select all elements with animation class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Start observing each element
    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Handle elements that are already in viewport on page load
    // This ensures immediate animation for above-the-fold content
    setTimeout(() => {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInViewport = (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

            if (isInViewport) {
                element.classList.add('animated');
            }
        });
    }, 100);
});
