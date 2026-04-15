(function() {
    "use strict";

    // --- 1. THE FAST SEARCH HANDLER ---
    window.handleSearch = function(query) {
        if (!query) return;
        
        let url = query.trim();
        let targetUrl;

        // DuckDuckGo routing logic
        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
        } else {
            // Force lightweight DuckDuckGo HTML search
            targetUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(url)}`;
        }

        // The Google Tunnel (High-speed bypass for school filters)
        // This uses Google's servers to fetch the site for you
        const tunnel = `https://translate.google.com/translate?sl=en&tl=en&u=${encodeURIComponent(targetUrl)}`;

        // Launch in a new stealth tab to avoid "Refused to Connect" errors
        const win = window.open('about:blank', '_blank');
        
        if (win) {
            win.location.replace(tunnel);
            
            // Sync the top address bar if it exists
            const addressBar = document.getElementById('url-baraa');
            if (addressBar) addressBar.value = targetUrl;
        } else {
            // Fallback: If iPad blocks popups, redirect the current tab
            window.location.href = tunnel;
        }
    };

    // --- 2. INITIALIZATION (The "Nothing Happens" Fix) ---
    document.addEventListener("DOMContentLoaded", () => {
        // Find your search input by its ID
        const mainSearch = document.getElementById('main-search');
        
        if (mainSearch) {
            // Listen for the Enter key
            mainSearch.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    window.handleSearch(mainSearch.value);
                }
            });
            
            // Optional: Support Ctrl + K to focus search
            window.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'k') {
                    e.preventDefault();
                    mainSearch.focus();
                }
            });
        }

        // Toggle Helios AI Bot
        const aiToggle = document.getElementById('toggleSourceCode');
        if (aiToggle) {
            aiToggle.addEventListener('click', () => {
                document.body.classList.toggle('show-chatbot');
            });
        }
    });

})();
