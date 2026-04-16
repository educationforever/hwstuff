// Helios Master Proxy (sw.js)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYl1gLswvLofvow05jLej8dICLIXQ181vuVyEjHR8M7x7A7emYlZkiPGlcOzk1B419/exec';

async function tryFetch(actualUrl) {
    try {
        // Construct the request to your private Google bridge
        const target = GOOGLE_SCRIPT_URL + '?url=' + encodeURIComponent(actualUrl);

        // We use 'cors' mode and allow redirects for Google Apps Script
        const response = await fetch(target, {
            method: 'GET',
            redirect: 'follow' 
        });

        const html = await response.text();
        
        const newHeaders = new Headers();
        newHeaders.set('Content-Type', 'text/html');

        // Injection to keep the user inside the Helios tab
        const injection = `
            <script>
                document.addEventListener('click', e => {
                    const a = e.target.closest('a');
                    if (a && a.href && a.href.startsWith('http')) {
                        e.preventDefault();
                        window.location.href = window.location.origin + '/helios-proxy=' + encodeURIComponent(a.href);
                    }
                });
            </script>
        `;
        
        return new Response(html + injection, { 
            status: 200, 
            headers: newHeaders 
        });

    } catch (err) {
        return new Response("<h1>Helios Bridge Error</h1><p>" + err.toString() + "</p>", {
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
