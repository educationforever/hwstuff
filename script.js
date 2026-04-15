/**
 * HELIOS ALL-IN-ONE - FIXED SEARCH EDITION
 */

(function() {
    "use strict";

    // --- 1. CONFIG & CONSTANTS ---
    const OFFICIAL_URLS = [
        "https://helios-browser.vercel.app/",
        "https://helios-blue.vercel.app/",
        "https://helios-browser.rf.gd",
        "https://helios-browser.pages.dev/"
    ];

    const HELIOS_API_KEY_PARTS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', 'g', 'h', 'i', 'j', 'l', 'm', 'n', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c', 'b', 'p', 'q', 't', 'u', 'w', 'x', 'y', 'z'];
    const USELESS_CHARS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c'];
    
    let heliosMessageHistory = [];
    const heliosSystemMessage = { role: "system", content: "You are Helios AI, made by dinguschan." };

    const getApiKey = () => HELIOS_API_KEY_PARTS.filter(p => p !== 'X' && USELESS_CHARS.includes(p)).join('');

    // --- 2. THE LOGGER (iPad Safe) ---
    function logEvent(message, isHeader = false) {
        const container = document.getElementById("logContainer");
        if (!container) return;
        if (container.children.length > 30) container.removeChild(container.firstChild);
        const entry = document.createElement("div");
        entry.style.cssText = "padding: 4px 0; border-bottom: 1px solid #444; font-size: 13px;";
        if (isHeader) entry.style.fontWeight = "bold";
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
    }

    // --- 3. THEME & UI ---
    window.activatePreview = function(element) {
        const theme = element.classList.contains('theme-preview-lightmode') ? 'dark-ember.css' : 'styles.css';
        document.querySelector('link[rel="stylesheet"]').href = theme;
        localStorage.setItem('selectedTheme', theme);
    };

    // --- 4. SEARCH HANDLER ---
    function handleSearch(query) {
        if (!query) return;
        logEvent(`Navigating to: ${query}`);
        
        // Check if it's a URL or a search term
        let url = query;
        if (!url.includes('.') || url.includes(' ')) {
            url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        } else if (!url.startsWith('http')) {
            url = `https://${url}`;
        }

        // If you are using Ultraviolet or Pyrus, you might need to prefix this:
        // Example: window.location.href = "/service/" + btoa(url);
        window.location.href = url; 
    }

    // --- 5. INITIALIZATION ---
    document.addEventListener("DOMContentLoaded", () => {
        const searchInput = document.querySelector('.search-baraa input');
        
        // Listen for Enter Key in Search Bar
        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSearch(searchInput.value.trim());
            }
        });

        // Search shortcut (Ctrl + K)
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                searchInput?.focus();
            }
        });

        // Fast Touch for Buttons
        document.querySelectorAll('button, .tabaa').forEach(btn => {
            btn.addEventListener('touchstart', () => btn.classList.add('hover-triggered'), { passive: true });
            btn.addEventListener('touchend', () => btn.classList.remove('hover-triggered'));
        });

        // Theme Load
        const savedTheme = localStorage.getItem('selectedTheme') || 'styles.css';
        const link = document.querySelector('link[rel="stylesheet"]');
        if (link) link.href = savedTheme;

        logEvent("Helios System Ready", true);
    });

    // --- 6. CHATBOT ---
    async function sendHeliosMessage() {
        const input = document.querySelector(".chat-input textarea");
        const msg = input.value.trim();
        if (!msg) return;

        const chatbox = document.querySelector(".chatbox");
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
                    messages: [heliosSystemMessage, ...heliosMessageHistory, { role: "user", content: msg }]
                })
            });
            const data = await res.json();
            const reply = data.choices[0].message.content;
            
            const botDiv = document.createElement("div");
            botDiv.className = "chat incoming";
            botDiv.innerHTML = `<p>${reply}</p>`;
            chatbox.appendChild(botDiv);
            botDiv.scrollIntoView({ behavior: 'smooth' });
            heliosMessageHistory.push({ role: "user", content: msg }, { role: "assistant", content: reply });
        } catch (e) {
            logEvent("AI Error: Connection failed");
        }
    }

    document.querySelector(".send-btn")?.addEventListener("click", sendHeliosMessage);
    document.querySelector(".wrench-buttonaa")?.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

})();
