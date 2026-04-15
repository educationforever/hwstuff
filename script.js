(function() {
    "use strict";

    // Missing logEvent fix
    function logEvent(message, isError = false) {
        const container = document.getElementById('logContainer');
        if (container) {
            const entry = document.createElement('div');
            entry.style.color = isError ? '#ff4444' : '#00ff00';
            entry.textContent = `> ${message}`;
            container.prepend(entry);
            setTimeout(() => entry.remove(), 5000);
        }
    }

    window.handleSearch = function(query) {
        if (!query) return;
        
        let url = query.trim();
        let targetUrl;

        // 1. Formatting
        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
        } else {
            targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
        }

        const iframe = document.getElementById('content-frame');
        const startPage = document.getElementById('start-page');

        if (iframe && startPage) {
            logEvent("Fetching site data...");
            
            // 2. THE MIRROR BYPASS
            // We use 'AllOrigins' to grab the site code without triggering a "Refused" error
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

            fetch(proxyUrl)
                .then(res => res.json())
                .then(data => {
                    startPage.style.display = "none";
                    iframe.style.display = "block";

                    // We create a "Blob" (a fake file) containing the site code
                    // This is how we stay in the same tab without a backend
                    const blob = new Blob([data.contents], { type: 'text/html' });
                    const blobUrl = URL.createObjectURL(blob);
                    
                    iframe.src = blobUrl;
                    logEvent("Site Mirrored Successfully.");
                })
                .catch(err => {
                    logEvent("Network Blocked Bridge. Trying Fallback...", true);
                    // Last resort: If the bridge is blocked, we use the Translate Tunnel
                    iframe.src = `https://translate.google.com/translate?sl=en&tl=en&u=${encodeURIComponent(targetUrl)}`;
                });
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        if (mainSearch) {
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === "Enter") window.handleSearch(mainSearch.value);
            });
        }
        logEvent("Helios Script Engine Ready.");
    });
})();
