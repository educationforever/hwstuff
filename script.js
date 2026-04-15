(function() {
    "use strict";

    // --- 1. GLOBAL CONFIG ---
    const proxyGateway = "https://uv.student-portal.top/main/"; 
    const HELIOS_API_KEY_PARTS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', 'g', 'h', 'i', 'j', 'l', 'm', 'n', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c', 'b', 'p', 'q', 't', 'u', 'w', 'x', 'y', 'z'];
    const USELESS_CHARS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c'];
    
    const getApiKey = () => HELIOS_API_KEY_PARTS.filter(p => p !== 'X' && USELESS_CHARS.includes(p)).join('');

    // --- 2. SEARCH HANDLER ---
    window.handleSearch = function(query) {
        if (!query) return;
        
        let url = query.trim();
        let targetUrl;

        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
        } else {
            targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
        }

        const encodedUrl = btoa(targetUrl).replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '');
        
        const iframe = document.getElementById('content-frame');
        const startPage = document.getElementById('start-page');
        const addressBar = document.getElementById('url-baraa');

        if (iframe && startPage) {
            startPage.style.display = "none";
            iframe.style.display = "block";
            iframe.src = proxyGateway + encodedUrl;
            if (addressBar) addressBar.value = targetUrl;
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
