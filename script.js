(function() {
    "use strict";

    // --- 1. HELPER: THE LOGGING FUNCTION ---
    // This fixes the "logEvent is not defined" error
    function logEvent(message, isError = false) {
        const container = document.getElementById('logContainer');
        if (container) {
            const entry = document.createElement('div');
            entry.style.color = isError ? '#ff4444' : '#00ff00';
            entry.textContent = `> ${message}`;
            container.prepend(entry);
            
            // Auto-remove logs after 5 seconds to keep it clean
            setTimeout(() => entry.remove(), 5000);
        }
        console.log(message);
    }

    // --- 2. THE SEARCH HANDLER ---
    window.handleSearch = function(query) {
        if (!query) return;
        
        let url = query.trim();
        let targetUrl;

        // Routing logic
        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
            // Tunneling via DuckDuckGo Lite to bypass filters
            targetUrl = `https://duckduckgo.com/lite/?q=${encodeURIComponent(targetUrl)}`;
        } else {
            targetUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(url)}`;
        }

        logEvent(`Routing request...`);

        // Launch in stealth tab
        const win = window.open('about:blank', '_blank');
        
        if (win) {
            win.location.replace(targetUrl);
            const addressBar = document.getElementById('url-baraa');
            if (addressBar) addressBar.value = url;
        } else {
            // Fallback for iPad
            logEvent("Popup blocked. Redirecting current tab...", true);
            window.location.href = targetUrl;
        }
    };

    // --- 3. INITIALIZATION ---
    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        
        if (mainSearch) {
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    window.handleSearch(mainSearch.value);
                }
            });
        }

        // Toggle AI Chatbot
        const aiToggle = document.getElementById('toggleSourceCode');
        if (aiToggle) {
            aiToggle.addEventListener('click', () => {
                document.body.classList.toggle('show-chatbot');
            });
        }
        
        logEvent("Helios System Ready.");
    });

})();
