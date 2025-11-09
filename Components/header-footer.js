function loadGlobalCSS() {
    if (!document.getElementById('global-css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/global.css';
        link.id = 'global-css';
        document.head.appendChild(link);
    }
}

class SiteHeader extends HTMLElement {
    connectedCallback() {
        loadGlobalCSS();

        fetch("/Components/header.html")
            .then(res => res.text())
            .then(html => {
                this.innerHTML = html;

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
        loadGlobalCSS();

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
