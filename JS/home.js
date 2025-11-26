document.addEventListener('DOMContentLoaded', function () {

    // =====================================================
    //  HERO BACKGROUND CAROUSEL (Bootstrap-based)
    // =====================================================
    const heroCarousel = document.querySelector('#heroCarousel');
    if (heroCarousel && window.bootstrap && typeof bootstrap.Carousel === 'function') {
        new bootstrap.Carousel(heroCarousel, {
            interval: 5000,
            ride: 'carousel'
        });
    }

    // =====================================================
    //  GALLERY CAROUSEL (If exists on page)
    // =====================================================
    const galleryEl = document.querySelector('#galleryCarousel');
    if (galleryEl && window.bootstrap && typeof bootstrap.Carousel === 'function') {
        const bsCarousel = new bootstrap.Carousel(galleryEl, { interval: 3000 });

        // Optional: pause on hover
        galleryEl.addEventListener('mouseenter', () => bsCarousel.pause());
        galleryEl.addEventListener('mouseleave', () => bsCarousel.cycle());
    }

    // =====================================================
    //  FADE-IN ANIMATION ON SCROLL
    // =====================================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // =====================================================
    //  NEWS CAROUSEL (4 per page + auto sort by date)
    // =====================================================
    function setupNewsBoard() {
        const newsCarousel = document.querySelector('.news-carousel');
        const newsItems = Array.from(document.querySelectorAll('.news-carousel .news-item'));
        const slickDots = document.querySelector('.slick-dots');
        if (!newsCarousel || !newsItems.length || !slickDots) return;

        // --- 1) SORT BY DATE (Latest first) ---
        newsItems.sort((a, b) => {
            const getDate = (item) => {
                const dateEl = item.querySelector('.news-date');
                if (!dateEl) return new Date(0);

                const [day, month, year] = dateEl.innerHTML.trim().split('<br>');
                return new Date(`${month} ${day}, ${year}`);
            };
            return getDate(b) - getDate(a);
        });

        // Re-append sorted items
        newsItems.forEach(item => newsCarousel.appendChild(item));

        // --- 2) FIXED: ALWAYS SHOW 4 PER PAGE ---
        let visibleCount = 4;
        let newsIndex = 0;

        function showNews(index) {
            const total = newsItems.length;
            const totalPages = Math.ceil(total / visibleCount);

            const page = Math.min(Math.floor(index / visibleCount), totalPages - 1);
            const start = page * visibleCount;
            const end = start + visibleCount;

            newsItems.forEach((item, i) => {
                item.style.display = (i >= start && i < end) ? 'block' : 'none';
                item.classList.toggle('news-fade-in', i >= start && i < end);
            });

            Array.from(slickDots.children).forEach((li, i) =>
                li.classList.toggle('slick-active', i === page)
            );

            newsIndex = start;
        }

        function createDots() {
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

        createDots();
        showNews(0);
    }
    // Initialize News Board
    if (document.querySelector('.news-carousel') && document.querySelector('.slick-dots')) {
        setupNewsBoard();
    } else {
        const observer = new MutationObserver(() => {
            if (document.querySelector('.news-carousel') && document.querySelector('.slick-dots')) {
                observer.disconnect();
                setupNewsBoard();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // =====================================================
    //  EVENT CALENDAR JS (BOOTSTRAP VERSION, NO SHADOW DOM)
    // =====================================================

    const calendarWrapper = document.querySelector(".calendar-wrapper");
    if (calendarWrapper) {

        const eventData = {
            "2024-10-02": [{ title: "Orientation Program for Batch 1 & 2", color: "red", location: "S. M. Nousher Ali Lecture Gallery, Room # 126, East West University" }],
            "2024-12-08": [{ title: "Celebration Ceremony of GDLFM Program", color: "yellow", location: "Manzur Elahi Auditorium, East West University" }],
            "2025-01-15": [{ title: "Orientation Program for Batch 3 & 4", color: "blue", location: "S. M. Nousher Ali Lecture Gallery, Room # 126, East West University" }],
            "2025-05-13": [{ title: "Orientation Program for Batch 5 & 6", color: "red", location: "S. M. Nousher Ali Lecture Gallery, Room # 126, East West University" }]
        };

        let currentYear = new Date().getFullYear();
        let currentMonth = new Date().getMonth();

        const yearEl = document.getElementById("year");
        const monthNameEl = document.getElementById("month-name");
        const datesEl = document.getElementById("dates");
        const eventListEl = document.getElementById("event-list");
        const monthItems = document.querySelectorAll(".months li");

        yearEl.textContent = currentYear;
        loadCalendar(currentYear, currentMonth);

        monthItems.forEach((item, index) => {
            if (index === currentMonth) item.classList.add("active");

            item.addEventListener("click", () => {
                monthItems.forEach(m => m.classList.remove("active"));
                item.classList.add("active");
                setMonth(index);
            });
        });

        document.querySelector(".prev-year").addEventListener("click", () => {
            currentYear--;
            loadCalendar(currentYear, currentMonth);
        });

        document.querySelector(".next-year").addEventListener("click", () => {
            currentYear++;
            loadCalendar(currentYear, currentMonth);
        });

        // ============================
        // CALENDAR BUILDING
        // ============================
        function loadCalendar(year, month) {
            datesEl.innerHTML = "";
            yearEl.textContent = year;
            monthNameEl.textContent = new Date(year, month).toLocaleString("default", { month: "long" });

            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const prevMonthDays = new Date(year, month, 0).getDate();

            for (let i = firstDay - 1; i >= 0; i--) {
                const dayNum = prevMonthDays - i;
                const prevMon = month === 0 ? 11 : month - 1;
                const prevYr = month === 0 ? year - 1 : year;
                createDateCell(dayNum, "prev-month", formatDate(prevYr, prevMon + 1, dayNum));
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = formatDate(year, month + 1, d);
                const today = new Date().toISOString().slice(0, 10);
                const className = dateStr === today ? "date current-date" : "date";
                createDateCell(d, className, dateStr, true);
            }

            const totalFilled = firstDay + daysInMonth;
            const nextFill = 42 - totalFilled;

            for (let i = 1; i <= nextFill; i++) {
                const nextMon = month === 11 ? 0 : month + 1;
                const nextYr = month === 11 ? year + 1 : year;
                createDateCell(i, "next-month", formatDate(nextYr, nextMon + 1, i));
            }

            loadEventsForMonth(year, month);
        }

        function createDateCell(day, className, dateStr, allowSelect = false) {
            const cell = document.createElement("span");
            cell.className = className;
            cell.innerHTML = day;

            if (eventData[dateStr]) {
                const colors = eventData[dateStr].map(e => e.color).slice(0, 3);
                const dots = colors.map(c => `<div class="event-dot ${c}"></div>`).join("");
                cell.innerHTML += `<div class="event-dots">${dots}</div>`;
            }

            cell.addEventListener("click", () => {
                if (allowSelect) {
                    const prev = document.querySelector(".selected-date");
                    if (prev) prev.classList.remove("selected-date");
                    cell.classList.add("selected-date");
                }
                showEventsForDate(dateStr);
            });

            datesEl.appendChild(cell);
        }

        // ============================
        // SHOW EVENTS FOR DATE
        // ============================
        function showEventsForDate(dateStr) {
            eventListEl.innerHTML = "";

            if (!eventData[dateStr]) {
                eventListEl.innerHTML = `<div class="no-events">No events scheduled for this date.</div>`;
                return;
            }

            eventData[dateStr].forEach(({ title, color, location }) => {
                const [y, m, d] = dateStr.split("-").map(Number);
                const dateObj = new Date(y, m - 1, d);

                const formattedDate =
                    `<span class="day">${d}</span> <span class="month-year">${dateObj.toLocaleString("default", { month: "short" })}, ${y}</span>`;

                const div = document.createElement("div");
                div.className = `event-item ${color}`;

                div.innerHTML = `
                    <div class="event-date ${color}">${formattedDate}</div>
                    <div class="event-details">
                        <h3>${title}</h3>
                        <p><i class="fa-solid fa-location-dot"></i> ${location}</p>
                    </div>
                `;

                eventListEl.appendChild(div);
            });
        }

        // ============================
        // LOAD EVENTS FOR MONTH
        // ============================
        function loadEventsForMonth(year, month) {
            eventListEl.innerHTML = "";
            let hasEvents = false;

            for (const dateStr in eventData) {
                const [y, m, d] = dateStr.split("-").map(Number);
                if (y === year && m - 1 === month) {
                    hasEvents = true;

                    eventData[dateStr].forEach(({ title, color, location }) => {
                        const dateObj = new Date(y, m - 1, d);

                        const formatted =
                            `<span class="day">${d}</span> <span class="month-year">${dateObj.toLocaleString("default", { month: "short" })}, ${y}</span>`;

                        const div = document.createElement("div");
                        div.className = `event-item ${color}`;

                        div.innerHTML = `
                            <div class="event-date ${color}">${formatted}</div>
                            <div class="event-details">
                                <h3>${title}</h3>
                                <p><i class="fa-solid fa-location-dot"></i> ${location}</p>
                            </div>
                        `;

                        eventListEl.appendChild(div);
                    });
                }
            }

            if (!hasEvents) {
                eventListEl.innerHTML = `<div class="no-events">No events scheduled for this month.</div>`;
            }
        }

        function formatDate(y, m, d) {
            return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        }

        function setMonth(m) {
            currentMonth = m;
            loadCalendar(currentYear, currentMonth);
        }
    }

});
