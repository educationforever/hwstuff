/**
 * HELIOS ALL-IN-ONE - "CUH" EDITION (IPAD/CHROME OPTIMIZED)
 * Consolidates: Sitechecker, NautilusOS, Logger, AI, Themes, & Validation.
 */

(function() {
    "use strict";

    // --- 1. CONFIGURATION & CONSTANTS ---
    const OFFICIAL_URLS = [
        "https://helios-browser.vercel.app/",
        "https://helios-blue.vercel.app/",
        "https://helios-browser.rf.gd",
        "https://helios-browser.w3spaces.com/",
        "https://helios-browser.pages.dev/",
        "https://helios-browser.ct.ws"
    ];

    const HELIOS_API_KEY_PARTS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', 'g', 'h', 'i', 'j', 'l', 'm', 'n', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c', 'b', 'p', 'q', 't', 'u', 'w', 'x', 'y', 'z'];
    const USELESS_CHARS = ['s', 'k', '-', 'o', 'r', '-', 'v', '1', '-', '8', 'e', 'f', '6', '7', '3', 'c', 'a', '3', '4', '2', '2', '5', '2', '3', '3', '0', 'f', 'c', '2', 'd', '5', '4', '2', 'c', '1', '7', '0', '9', 'e', '9', '3', '3', '1', 'e', '2', 'c', '7', 'd', '6', '9', '0', '4', '4', '5', 'd', '1', '2', '3', '2', '1', '9', 'd', 'a', '3', '6', '0', '0', '5', 'd', '5', '5', '6', 'c'];
    
    let heliosMessageHistory = [];
    const heliosSystemMessage = { role: "system", content: "You are Helios AI, an advanced AI assistant designed to be helpful, knowledgeable, and adaptable. You were made by dinguschan." };

    // --- 2. UTILITY FUNCTIONS ---
    const getApiKey = () => HELIOS_API_KEY_PARTS.filter(p => p !== 'X' && USELESS_CHARS.includes(p)).join('');
    const normalizeUrl = (url) => url.split(/[?#]/)[0];

    // --- 3. THE LOGGER (Memory-Safe for Chrome on iPad) ---
    function logEvent(message, isHeader = false) {
        const container = document.getElementById("logContainer");
        if (!container) return;

        // Keep RAM usage low: only keep the 30 most recent logs
        if (container.children.length > 30) container.removeChild(container.firstChild);

        const entry = document.createElement("div");
        entry.style.cssText = "padding: 6px 0; border-bottom: 1px solid #444; text-align: left;";
        if (isHeader) entry.style.fontWeight = "bold";
        
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        container.appendChild(entry);
        container.scrollTop = container.scrollHeight;
    }

    // --- 4. SITECHECKER & POPUPS ---
    function createSitechecker() {
        if (document.querySelector(".sitechecker-container")) return;
        const pageUrl = normalizeUrl(window.location.href);
        const isOfficial = OFFICIAL_URLS.includes(pageUrl);
        
        const div = document.createElement("div");
        div.className = "sitechecker-container";
        div.innerHTML = `
            <p id="sitechecker-message">
                <i class="fa ${isOfficial ? 'fa-circle-check sitechecker-secure' : 'fa-triangle-exclamation sitechecker-warning'}"></i>
                <span>This link <b>(${pageUrl})</b> is ${isOfficial ? 'official' : 'unofficial'}.</span>
            </p>`;
        document.body.appendChild(div);

        setTimeout(() => {
            div.style.transition = "opacity 1s ease-out";
            div.style.opacity = "0";
            setTimeout(() => div.remove(), 1000);
        }, 12000);
    }

    function createNautilusPopup() {
        if (document.querySelector(".sitechecker-container-center")) return;

        const backdrop = document.createElement("div");
        backdrop.className = "sitechecker-backdrop";
        backdrop.style.display = "block";

        const popup = document.createElement("div");
        popup.className = "sitechecker-container-center";
        popup.style.display = "block";
        popup.innerHTML = `
            <div class="nautilus-icon"><i class="fa-solid fa-fish"></i></div>
            <h2>Announcing NautilusOS!!</h2>
            <p>Web OS with 3 proxy browsers and full customization. Dive in!</p>
            <div class="sitechecker-button-container">
                <button class="sitechecker-close">Maybe later</button>
                <button class="sitechecker-visit">Take me there!</button>
            </div>`;

        document.body.append(backdrop, popup);

        popup.addEventListener("click", (e) => {
            if (e.target.classList.contains("sitechecker-visit")) window.open("https://github.com/nautilus-os/NautilusOS", "_blank");
            if (e.target.classList.contains("sitechecker-close") || e.target.classList.contains("sitechecker-visit")) {
                popup.remove();
                backdrop.remove();
                createSitechecker();
            }
        });
    }

    // --- 5. THEME ENGINE ---
    window.activatePreview = function(element) {
        document.querySelectorAll('.theme-preview, .theme-preview-lightmode').forEach(el => el.classList.remove('active'));
        element.classList.add('active');

        const theme = element.classList.contains('theme-preview-lightmode') ? 'dark-ember.css' : 'styles.css';
        const activeClass = element.classList.contains('theme-preview-lightmode') ? 'theme-preview-lightmode' : 'theme-preview';
        
        applyTheme(theme);
        localStorage.setItem('selectedTheme', theme);
        localStorage.setItem('activeClass', activeClass);
    };

    function applyTheme(file) {
        let link = document.querySelector('link[rel="stylesheet"]');
        if (link) link.href = file;
    }

    // --- 6. AI CHATBOT (Fast WebKit Fetch) ---
    async function sendHeliosMessage() {
        const input = document.querySelector(".chat-input textarea");
        const msg = input.value.trim();
        if (!msg) return;

        appendChat(msg, true);
        input.value = '';
        const loading = appendChat("Thinking...", false);

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
            const text = data.choices[0].message.content;
            loading.remove();
            appendChat(text, false);
            heliosMessageHistory.push({ role: "user", content: msg }, { role: "assistant", content: text });
        } catch (e) {
            loading.textContent = "Error: API Overload.";
        }
    }

    function appendChat(content, isUser) {
        const chatbox = document.querySelector(".chatbox");
        if (!chatbox) return;
        const div = document.createElement("div");
        div.className = `chat ${isUser ? "outgoing" : "incoming"}`;
        div.innerHTML = `<p>${content}</p>`;
        chatbox.appendChild(div);
        div.scrollIntoView({ behavior: 'smooth' });
        return div;
    }

    // --- 7. SECURITY & PROTOCOL VALIDATION ---
    async function validateProtocols() {
        const expected = "𝙼𝚊𝚍𝚎 𝚋𝚢 𝚍𝚒𝚗𝚐𝚞𝚜𝚌𝚑𝚊𝚗!";
        const elements = document.querySelectorAll('.Xt7Lm9Kp3R8f, #h2Dv8e46q');
        let fail = false;

        elements.forEach(el => {
            if (el.textContent.trim() !== expected) fail = true;
        });

        if (fail) {
            const overlay = document.createElement('div');
            overlay.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:black; color:red; z-index:9999; padding:20px; font-family:monospace;";
            overlay.textContent = "Fatal Error: Helios Protocol Validation Failed.";
            document.body.appendChild(overlay);
        }
    }

    // --- 8. GLOBAL INITIALIZATION ---
    document.addEventListener("DOMContentLoaded", () => {
        // Fast touch for buttons
        const reloadBtn = document.querySelector('.reload-buttonaa');
        if (reloadBtn) {
            const hov = () => reloadBtn.classList.add('hover-triggered');
            const unhov = () => reloadBtn.classList.remove('hover-triggered');
            reloadBtn.addEventListener('touchstart', hov, { passive: true });
            reloadBtn.addEventListener('animationend', unhov);
        }

        // Popups
        createNautilusPopup();

        // Interaction Logging
        logEvent("Helios started successfully", true);
        document.body.addEventListener("click", (e) => {
            const btn = e.target.closest("button");
            if (btn) logEvent(`${btn.innerText.trim() || "Button"} clicked`);
        });

        // Load Theme
        applyTheme(localStorage.getItem('selectedTheme') || 'styles.css');

        // Event Bindings
        document.querySelector(".send-btn")?.addEventListener("click", sendHeliosMessage);
        document.querySelector(".wrench-buttonaa")?.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
        
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                document.querySelector('.search-baraa input')?.focus();
            }
        });

        validateProtocols();
    });

    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = '';
    });

})();
