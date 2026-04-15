(function() {
    "use strict";

    /**
     * HELIOS "ULTIMATE BYPASS" EDITION
     * Uses Google Translate as a secondary tunnel to prevent "IP Not Found" errors.
     */

    // --- 1. CONFIG ---
    const HELIOS_API_KEY_PARTS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', 'g', 'h', 'i', 'j', 'l', 'm', 'n', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c', 'b', 'p', 'q', 't', 'u', 'w', 'x', 'y', 'z'];
    const USELESS_CHARS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c'];
    
    const getApiKey = () => HELIOS_API_KEY_PARTS.filter(p => p !== 'X' && USELESS_CHARS.includes(p)).join('');

    // --- 2. THE BYPASS HANDLER ---
    window.handleSearch = function(query) {
        if (!query) return;
        
        let url = query.trim();
        let targetUrl;

        // Determine if it's a URL or search
        if (url.includes('.') && !url.includes(' ')) {
            targetUrl = url.startsWith('http') ? url : `https://${url}`;
        } else {
            targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
        }

        const iframe = document.getElementById('content-frame');
        const startPage = document.getElementById('start-page');
        const addressBar = document.getElementById('url-baraa');

        if (iframe && startPage) {
            startPage.style.display = "none";
            iframe.style.display = "block";
            
            /**
             * THE TUNNEL LOGIC:
             * We wrap the URL in Google Translate. 
             * This bypasses DNS filters because the browser connects to GOOGLE, not a proxy.
             */
            const tunnel = `https://translate.google.com/translate?sl=en&tl=es&u=${encodeURIComponent(targetUrl)}`;
            
            iframe.src = tunnel;
            if (addressBar) addressBar.value = targetUrl;
            
            console.log("Helios: Routing through Google Tunnel...");
        }
    };

    // --- 3. INITIALIZATION ---
    document.addEventListener("DOMContentLoaded", () => {
        const mainSearch = document.getElementById('main-search');
        
        // Search listener
        mainSearch?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') window.handleSearch(mainSearch.value);
        });

        // Toggle AI Chatbot
        document.getElementById('toggleSourceCode')?.addEventListener('click', () => {
            document.body.classList.toggle('show-chatbot');
        });

        // Handle Chatbox "Send"
        document.querySelector(".send-btn")?.addEventListener("click", sendHeliosMessage);
    });

    // --- 4. AI LOGIC (Brief) ---
    async function sendHeliosMessage() {
        const input = document.querySelector(".chat-input textarea");
        const chatbox = document.querySelector(".chatbox");
        const msg = input.value.trim();
        if (!msg) return;

        const userDiv = document.createElement("div");
        userDiv.className = "chat outgoing";
        userDiv.innerHTML = `<p>${msg}</p>`;
        chatbox.appendChild(userDiv);
        input.value = '';

        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: { "Authorization": `Bearer ${getApiKey()}`, "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-exp:free",
                    messages: [{ role: "user", content: msg }]
                })
            });
            const data = await res.json();
            const reply = data.choices[0].message.content;
            
            const botDiv = document.createElement("div");
            botDiv.className = "chat incoming";
            botDiv.innerHTML = `<p>${reply}</p>`;
            chatbox.appendChild(botDiv);
            botDiv.scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
            console.error("AI Error");
        }
    }

})();
