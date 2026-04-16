// Helios Master Proxy (sw.js)
// PASTE YOUR NEW GOOGLE URL BELOW
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_NEW_URL_HERE';

async function tryFetch(actualUrl) {
    try {
        const target = GOOGLE_SCRIPT_URL + '?url=' + encodeURIComponent(actualUrl);

        // We use 'no-referrer' to keep Securly from seeing the target site
        const response = await fetch(target, {
            method: 'GET',
            mode: 'cors', 
            credentials: 'omit'
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const html = await response.text();
        
        const newHeaders = new Headers();
        newHeaders.set('Content-Type', 'text/html');

        // This keeps you in the tab
        const injection = `
            <script>
                document.addEventListener('click', e => {
                    const a = e.target.closest('a');
                    if (a && a.href && a.href.startsWith('http')) {
                        e.preventDefault();
                        const proxied = window.location.origin + '/helios-proxy=' + encodeURIComponent(a.href);
                        window.location.href = proxied;
                    }
                });
            </script>
        `;
        
        return new Response(html + injection, { 
            status: 200, 
            headers: newHeaders 
        });

    } catch (err) {
        // Fallback for when the Google Script is struggling
        return new Response("<h1>Helios Bridge Error</h1><p>The bridge failed to load. Ensure you updated the URL in sw.js and set access to 'Anyone'.</p><p>Error: " + err.message + "</p>", {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('helios-proxy=')) {
        const urlPart = event.request.url.split('helios-proxy=')[1];
        const actualUrl = decodeURIComponent(urlPart);
        event.respondWith(tryFetch(actualUrl));
    }
});
