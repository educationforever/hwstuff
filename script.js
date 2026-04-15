(function() {
    "use strict";

 // --- 1. TRY A FRESH GATEWAY ---
// This one is newer and less likely to be on the blocklist
const proxyGateway = "https://interstellar.edu.kg/main/"; 

window.handleSearch = function(query) {
    if (!query) return;
    
    let url = query.trim();
    let targetUrl;

    if (url.includes('.') && !url.includes(' ')) {
        targetUrl = url.startsWith('http') ? url : `https://${url}`;
    } else {
        targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
    }

    // This encoding is specific to Ultraviolet proxies
    const encodedUrl = btoa(targetUrl).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
    
    const iframe = document.getElementById('content-frame');
    const startPage = document.getElementById('start-page');

    if (iframe && startPage) {
        startPage.style.display = "none";
        iframe.style.display = "block";
        
        // Use a timeout to detect if the IP fails to load
        const loadTimeout = setTimeout(() => {
            logEvent("Gateway timed out. Network may be blocking this IP.", true);
        }, 5000);

        iframe.onload = () => clearTimeout(loadTimeout);
        iframe.src = proxyGateway + encodedUrl;
    }
};

    // --- 3. INITIALIZATION ---
    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        
        mainSearch?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.handleSearch(mainSearch.value);
        });

        // Toggle AI Bot
        document.getElementById('toggleSourceCode')?.addEventListener('click', () => {
            document.body.classList.toggle('show-chatbot');
        });
    });

})();
