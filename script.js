(function() {
    "use strict";

    // --- 1. SYSTEM LOGGING ---
    function logEvent(message, isError = false) {
        const container = document.getElementById('logContainer');
        if (container) {
            const entry = document.createElement('div');
            entry.style.color = isError ? '#ff4444' : '#00ff00';
            entry.textContent = `> ${message}`;
            container.prepend(entry);
            setTimeout(() => entry.remove(), 5000);
        }
        console.log(message);
    }

    // --- 2. MINI-SERVER (SERVICE WORKER) REGISTRATION ---
    // This installs the proxy logic into the browser tab
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => logEvent("Helios Mini-Server Active."))
                .catch(err => logEvent("Mini-Server Failed to start.", true));
        });
    }

    // --- 3. THE LUNAR-STYLE SEARCH HANDLER ---
    window.handleSearch = function(query) {
        if (!query) return;
        
        let url = query.trim();
        let targetUrl;

        // URL vs Search Logic
        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
        } else {
            // Use DuckDuckGo HTML for faster unblocking
            targetUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(url)}`;
        }

        const iframe = document.getElementById('content-frame');
        const startPage = document.getElementById('start-page');
        const addressBar = document.getElementById('url-baraa');

        if (iframe && startPage) {
            logEvent("Intercepting request...");

            /**
             * THE PROXY PATH
             * We tell the browser to stay on OUR domain but add a special prefix.
             * The Service Worker (sw.js) listens for this prefix and tunnels the data.
             */
            const proxiedPath = window.location.origin + '/helios-proxy=' + encodeURIComponent(targetUrl);
            
            // UI Transition: Hide landing, show frame
            startPage.style.display = "none";
            startPage.classList.remove('activeaa');
            
            iframe.style.display = "block";
            iframe.src = proxiedPath;

            if (addressBar) addressBar.value = url;
        }
    };

    // --- 4. INITIALIZATION & EVENT LISTENERS ---
    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        
        // Enter Key Listener
        if (mainSearch) {
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    window.handleSearch(mainSearch.value);
                }
            });
        }

        // Home Button Fix: Reset to landing page
        document.querySelector('.home-buttonaa')?.addEventListener('click', () => {
            const iframe = document.getElementById('content-frame');
            const startPage = document.getElementById('start-page');
            if (iframe && startPage) {
                iframe.style.display = "none";
                iframe.src = "about:blank";
                startPage.style.display = "flex";
                startPage.classList.add('activeaa');
                logEvent("Returned Home.");
            }
        });

        // AI Bot Toggle
        const aiToggle = document.getElementById('toggleSourceCode');
        if (aiToggle) {
            aiToggle.addEventListener('click', () => {
                document.body.classList.toggle('show-chatbot');
            });
        }

        logEvent("Helios Engine Initialized.");
    });

})();
