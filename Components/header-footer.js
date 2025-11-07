class SiteHeader extends HTMLElement {
    connectedCallback() {
        fetch("/Components/header.html")
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;

                // Dynamically load CSS if not already loaded
                if (!document.getElementById('header-css')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/Components/header.css';
                    link.id = 'header-css';
                    document.head.appendChild(link);
                }
            })
            .catch(err => console.error("Header load error:", err));
    }
}

class SiteFooter extends HTMLElement {
    connectedCallback() {
        fetch("/Components/footer.html")
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;

                if (!document.getElementById('footer-css')) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = '/Components/footer.css';
                    link.id = 'footer-css';
                    document.head.appendChild(link);
                }
            })
            .catch(err => console.error("Footer load error:", err));
    }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);
