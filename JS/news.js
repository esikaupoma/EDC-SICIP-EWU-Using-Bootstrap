/**
 * News Details Page - Dynamic Content Loader
 * Loads and displays individual news articles from JSON data
 */

(function () {
    'use strict';

    // Configuration
    const CONFIG = {
        newsDataPath: '/Resources/files/news-data.json',
        dateFormat: {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    };

    // DOM Elements
    const elements = {
        loadingState: document.getElementById('loading-state'),
        errorState: document.getElementById('error-state'),
        newsContent: document.getElementById('news-content'),
        newsTitle: document.getElementById('news-title'),
        newsDate: document.getElementById('news-date'),
        newsBody: document.getElementById('news-body'),
        carouselInner: document.getElementById('carousel-inner'),
        carouselIndicators: document.getElementById('carousel-indicators'),
        breadcrumbTitle: document.getElementById('breadcrumb-title')
    };

    /**
     * Get URL parameter value
     * @param {string} param - Parameter name
     * @returns {string|null} Parameter value
     */
    function getURLParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Format date string to readable format
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', CONFIG.dateFormat);
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }

    /**
     * Create carousel indicators
     * @param {number} count - Number of images
     * @returns {string} HTML for indicators
     */
    function createCarouselIndicators(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const activeClass = i === 0 ? 'active' : '';
            const ariaCurrent = i === 0 ? 'aria-current="true"' : '';
            html += `
                <button type="button" 
                        data-bs-target="#newsCarousel" 
                        data-bs-slide-to="${i}" 
                        class="${activeClass}" 
                        ${ariaCurrent}
                        aria-label="Slide ${i + 1}">
                </button>
            `;
        }
        return html;
    }

    /**
     * Create carousel items
     * @param {Array} images - Array of image URLs
     * @param {string} title - News title for alt text
     * @returns {string} HTML for carousel items
     */
    function createCarouselItems(images, title) {
        return images.map((image, index) => {
            const activeClass = index === 0 ? 'active' : '';
            return `
                <div class="carousel-item ${activeClass}">
                    <img src="${image}" 
                         class="d-block w-100" 
                         alt="${title} - Image ${index + 1}"
                         loading="${index === 0 ? 'eager' : 'lazy'}">
                </div>
            `;
        }).join('');
    }

    /**
     * Sanitize HTML content (basic sanitization)
     * @param {string} html - HTML string
     * @returns {string} Sanitized HTML
     */
    function sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    /**
     * Process and display news content
     * @param {Object} newsItem - News article object
     */
    function displayNews(newsItem) {
        // Set title
        elements.newsTitle.textContent = newsItem.title;
        document.title = `${newsItem.title} - EDC-SICIP-EWU`;
        elements.breadcrumbTitle.textContent = newsItem.title.substring(0, 50) +
            (newsItem.title.length > 50 ? '...' : '');

        // Set date
        elements.newsDate.textContent = formatDate(newsItem.date);
        elements.newsDate.setAttribute('datetime', newsItem.date);

        // Set up carousel
        const images = newsItem.gallery && newsItem.gallery.length > 0
            ? newsItem.gallery
            : [newsItem.hero_image];

        if (images.length > 1) {
            elements.carouselIndicators.innerHTML = createCarouselIndicators(images.length);
        } else {
            elements.carouselIndicators.style.display = 'none';
        }

        elements.carouselInner.innerHTML = createCarouselItems(images, newsItem.title);

        // Set content - directly insert HTML (ensure your JSON is from a trusted source)
        elements.newsBody.innerHTML = newsItem.content;

        // Hide loading, show content
        elements.loadingState.classList.add('d-none');
        elements.newsContent.classList.remove('d-none');

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Show error state
     * @param {string} message - Error message
     */
    function showError(message = 'Unable to load news article') {
        console.error(message);
        elements.loadingState.classList.add('d-none');
        elements.errorState.classList.remove('d-none');
        elements.errorState.querySelector('p').textContent = message;
    }

    /**
     * Load news data and display article
     */
    async function loadNewsDetails() {
        try {
            // Get news ID from URL
            const newsId = getURLParameter('id');

            if (!newsId) {
                showError('No news article specified. Please select an article from the news page.');
                return;
            }

            // Fetch news data
            const response = await fetch(CONFIG.newsDataPath);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newsData = await response.json();

            // Find the specific news item
            const newsItem = newsData.find(item => item.id === parseInt(newsId));

            if (!newsItem) {
                showError(`News article with ID ${newsId} not found.`);
                return;
            }

            // Display the news
            displayNews(newsItem);

        } catch (error) {
            console.error('Error loading news details:', error);
            showError('An error occurred while loading the news article. Please try again later.');
        }
    }

    /**
     * Handle image load errors
     */
    function handleImageErrors() {
        document.addEventListener('error', function (e) {
            if (e.target.tagName === 'IMG') {
                console.error('Image failed to load:', e.target.src);
                e.target.src = '/Resources/images/placeholder.jpg'; // Fallback image
                e.target.alt = 'Image not available';
            }
        }, true);
    }

    /**
     * Initialize the page
     */
    function init() {
        // Check if all required elements exist
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error('Missing required elements:', missingElements);
            showError('Page initialization error. Please refresh the page.');
            return;
        }

        // Set up error handling for images
        handleImageErrors();

        // Load news details
        loadNewsDetails();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
