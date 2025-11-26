document.addEventListener("DOMContentLoaded", async () => {

    const newsContainer = document.getElementById("news-container");
    const pageNumbersContainer = document.getElementById("page-numbers");
    const prevPageItem = document.getElementById("prev-page");
    const nextPageItem = document.getElementById("next-page");

    const newsPerPage = 9;
    let currentPage = 1;
    let newsData = [];

    // Load JSON
    try {
        const res = await fetch("/Resources/files/news-data.json");
        const data = await res.json();

        // remove duplicates by ID
        const map = new Map();
        data.forEach(item => map.set(item.id, item));
        newsData = [...map.values()];

        // sort latest → oldest
        newsData.sort((a, b) => new Date(b.date) - new Date(a.date));

        renderNews();
    } catch (error) {
        console.error("Error loading news:", error);
    }

    function renderNews() {
        newsContainer.innerHTML = "";
        const start = (currentPage - 1) * newsPerPage;
        const pageItems = newsData.slice(start, start + newsPerPage);

        pageItems.forEach(item => {
            
            // Convert date → DAY + MONTH + YEAR
            const dateObj = new Date(item.date);
            const day = dateObj.getDate();
            const month = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
            const year = dateObj.getFullYear();

            const col = document.createElement("div");
            col.className = "col-lg-4 col-md-6";

            col.innerHTML = `
                <div class="news-card" onclick="location.href='/HTML/news-details.html?id=${item.id}'">

                    <div class="news-image-wrapper">
                        <img src="${item.hero_image}" class="news-image news-img" alt="News Image">

                        <!-- BLUE DATE BADGE -->
                        <div class="news-date-badge">
                            <span class="date-day">${day}</span>
                            <span class="date-month">${month}</span>
                            <span class="date-year">${year}</span>
                        </div>
                    </div>

                    <div class="news-card-body">
                        <div class="news-title">${item.title}</div>
                    </div>
                </div>
            `;

            newsContainer.appendChild(col);
        });

        renderPagination();
    }

    function renderPagination() {
        pageNumbersContainer.innerHTML = "";
        const totalPages = Math.ceil(newsData.length / newsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.className = "page-item" + (i === currentPage ? " active" : "");

            const a = document.createElement("a");
            a.href = "#";
            a.className = "page-link";
            a.textContent = i;

            a.onclick = (e) => {
                e.preventDefault();
                currentPage = i;
                renderNews();
            };

            li.appendChild(a);
            pageNumbersContainer.appendChild(li);
        }

        prevPageItem.classList.toggle("disabled", currentPage === 1);
        nextPageItem.classList.toggle("disabled", currentPage === totalPages);
    }

    prevPageItem.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderNews();
        }
    });

    nextPageItem.addEventListener("click", (e) => {
        e.preventDefault();
        const totalPages = Math.ceil(newsData.length / newsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderNews();
        }
    });

});
