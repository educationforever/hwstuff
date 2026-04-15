(function() {
    "use strict";
    
window.handleSearch = function(query) {
    if (!query) return;
    
    let url = query.trim();
    let targetUrl;

    // 1. DUCKDUCKGO ROUTING
    // If it's a URL (like google.com), we use DDG as a proxy to fetch it.
    // If it's a search term, we use DDG HTML search.
    if (url.includes('.') && !url.includes(' ')) {
        // This is a "Redirect" trick via DuckDuckGo
        targetUrl = url.startsWith('http') ? url : `https://${url}`;
        targetUrl = `https://duckduckgo.com/lite/?q=${encodeURIComponent(targetUrl)}`;
    } else {
        // Lightweight, unblockable search results
        targetUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(url)}`;
    }

    logEvent(`Routing via DuckDuckGo Tunnel...`);

    // 2. THE STEALTH TAB
    // We open a new window to bypass "Refused to Connect" frame errors
    const win = window.open('about:blank', '_blank');
    
    if (win) {
        // We load the target through the DDG Lite interface
        win.location.replace(targetUrl);
        
        // Update the address bar in your Helios UI
        const addressBar = document.getElementById('url-baraa');
        if (addressBar) addressBar.value = url;
    } else {
        // Fallback for iPad if popups are disabled
        window.location.href = targetUrl;
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
