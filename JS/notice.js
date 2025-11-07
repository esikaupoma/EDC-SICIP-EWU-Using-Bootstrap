document.addEventListener('DOMContentLoaded', () => {
    const notices = [
        { date: "28-08-2025", title: "Admission Test Results (Batch 7 and 8)", pdf: "/Resources/files/Admission_Result/Admission_Result_Batch-7-8.pdf" },
        { date: "30-04-2025", title: "Admission Test Results (Batch 5 and 6)", pdf: "/Resources/files/Admission_Result/Admission_Result_Batch-5-6.pdf" },
        { date: "30-12-2024", title: "Admission Test Results (Batch 3 and 4)", pdf: "/Resources/files/Admission_Result/Admission_Result_Batch-3-4.pdf" },
        { date: "29-09-2024", title: "Admission Test Results (Batch 1 and 2)", pdf: "/Resources/files/Admission_Result/Admission_Result_Batch-1-2.pdf" },
    ];

    const sorted = [...notices].sort((a, b) => {
        const da = a.date.split('-').reverse().join('-');
        const db = b.date.split('-').reverse().join('-');
        return new Date(db) - new Date(da);
    });

    const noticesPerPage = 6;
    let currentPage = 1;

    const noticeList = document.getElementById('notice-list');
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevPageItem = document.getElementById('prev-page');
    const nextPageItem = document.getElementById('next-page');

    function renderNotices() {
        noticeList.innerHTML = '';
        const start = (currentPage - 1) * noticesPerPage;
        const pageItems = sorted.slice(start, start + noticesPerPage);

        pageItems.forEach((item, idx) => {
            const [d, m, y] = item.date.split('-');
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = monthNames[parseInt(m) - 1];

            const card = document.createElement('div');
            card.className = 'notice-card';

            card.innerHTML = `
        <div class="notice-left">
          <div class="notice-date-box">${d}<span>${monthName} ${y}</span></div>
          <div><a class="notice-title" href="${item.pdf}" target="_blank">${item.title}</a></div>
        </div>
        <button class="open-pdf-btn" aria-label="Open PDF" title="Open PDF" onclick="window.open('${item.pdf}', '_blank')">
          <i class="fa-solid fa-up-right-from-square"></i>
        </button>
      `;

            noticeList.appendChild(card);
            setTimeout(() => card.classList.add('show'), 100 + idx * 100);
        });

        renderPagination();
    }

    function renderPagination() {
        pageNumbersContainer.innerHTML = '';
        const totalPages = Math.ceil(sorted.length / noticesPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = 'page-item' + (i === currentPage ? ' active' : '');
            const a = document.createElement('a');
            a.className = 'page-link';
            a.href = '#';
            a.textContent = i;
            a.onclick = (e) => {
                e.preventDefault();
                if (currentPage !== i) {
                    currentPage = i;
                    renderNotices();
                }
            };
            li.appendChild(a);
            pageNumbersContainer.appendChild(li);
        }

        prevPageItem.classList.toggle('disabled', currentPage === 1);
        nextPageItem.classList.toggle('disabled', currentPage === totalPages);
    }

    prevPageItem.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderNotices();
        }
    });

    nextPageItem.addEventListener('click', (e) => {
        e.preventDefault();
        const totalPages = Math.ceil(sorted.length / noticesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderNotices();
        }
    });

    renderNotices();
});
