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

        // 1. DUCKDUCKGO ROUTING
        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
        } else {
            // Use DuckDuckGo HTML (the lightweight version)
            targetUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(url)}`;
        }

        const iframe = document.getElementById('content-frame');
        const startPage = document.getElementById('start-page');
        const addressBar = document.getElementById('url-baraa');

        if (iframe && startPage) {
            logEvent("Switching to internal view...");

            // 2. THE GOOGLE MIRROR TUNNEL
            // This is the most stable way to stay in the same tab.
            // sl=en (source language) and tl=en (target language)
            const proxyBridge = `https://translate.google.com/translate?sl=en&tl=en&u=${encodeURIComponent(targetUrl)}`;
            
            // UI Transition
            startPage.style.display = "none";
            iframe.style.display = "block";
            
            // Set the source
            iframe.src = proxyBridge;

            if (addressBar) addressBar.value = url;
        }
    };

    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        if (mainSearch) {
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === "Enter") {
                    window.handleSearch(mainSearch.value);
                }
            });
        }

        // Fix Home Button
        document.querySelector('.home-buttonaa')?.addEventListener('click', () => {
            const iframe = document.getElementById('content-frame');
            const startPage = document.getElementById('start-page');
            if (iframe && startPage) {
                iframe.style.display = "none";
                iframe.src = "about:blank";
                startPage.style.display = "flex";
            }
        });

        logEvent("Helios System Active.");
    });
})();
