// Helios Private Tunnel (sw.js)
const BRIDGE_URL = 'https://script.google.com/macros/s/AKfycbyJeqMMZpdVgjZ0kwPN0GSQHwGv9tOHXUMWa4KrsMH5tj-vEw6CpI-H3oMiiwnPPvM/exec';

async function proxyFetch(targetUrl) {
    try {
        const tunnelUrl = BRIDGE_URL + '?url=' + encodeURIComponent(targetUrl);

        // We tell the browser to follow Google's 302 redirect automatically
        const response = await fetch(tunnelUrl, {
            method: 'GET',
            redirect: 'follow', // THIS IS THE KEY
            mode: 'cors'
        });

        if (!response.ok) throw new Error('Google Bridge is down');

        const html = await response.text();

        // Standard Helios injection
        const injection = `<script>
            document.addEventListener('click', e => {
                const a = e.target.closest('a');
                if (a && a.href && a.href.startsWith('http')) {
                    e.preventDefault();
                    window.location.href = window.location.origin + '/helios-proxy=' + encodeURIComponent(a.href);
                }
            });
        </script>`;

        return new Response(html + injection, {
            headers: { 'Content-Type': 'text/html' }
        });

    } catch (err) {
        return new Response("<h1>Tunnel Failure</h1><p>" + err.message + "</p>");
    }
}

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('helios-proxy=')) {
        const actualUrl = decodeURIComponent(event.request.url.split('helios-proxy=')[1]);
        event.respondWith(proxyFetch(actualUrl));
    }
});
