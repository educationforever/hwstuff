(function() {
    "use strict";

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

        // 1. ROUTING LOGIC
        if (url.includes('.') && !url.includes(' ')) {
            const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
            // Use DDG Lite as a proxy-like viewer
            targetUrl = `https://duckduckgo.com/lite/?q=${encodeURIComponent(cleanUrl)}`;
        } else {
            // Internal search results
            targetUrl = `https://duckduckgo.com/lite/?q=${encodeURIComponent(url)}`;
        }

        const iframe = document.getElementById('content-frame');
        const startPage = document.getElementById('start-page');
        const addressBar = document.getElementById('url-baraa');

        if (iframe && startPage) {
            logEvent("Loading internal session...");
            
            // 2. SAME-TAB SWITCHING (Lunar v2 Style)
            startPage.style.display = "none";
            startPage.classList.remove('activeaa');
            
            iframe.style.display = "block";
            iframe.src = targetUrl;

            if (addressBar) addressBar.value = url;
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        if (mainSearch) {
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') window.handleSearch(mainSearch.value);
            });
        }

        // Return Home Logic
        document.querySelector('.home-buttonaa')?.addEventListener('click', () => {
            const iframe = document.getElementById('content-frame');
            const startPage = document.getElementById('start-page');
            if (iframe && startPage) {
                iframe.style.display = "none";
                iframe.src = "about:blank";
                startPage.style.display = "flex";
                startPage.classList.add('activeaa');
            }
        });

        logEvent("Helios System Ready.");
    });
})();
