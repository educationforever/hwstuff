const BRIDGE_URL = 'https://script.google.com/macros/s/AKfycbxG3y-WSAf8kQyln8y9FgvbHdLQocD1MVU6gZHubVVI1JE8Efryi2mkaI2yf5TsG4Xa/exec';

async function proxyFetch(targetUrl) {
    try {
        const tunnelUrl = BRIDGE_URL + '?url=' + encodeURIComponent(targetUrl);

        // We use mode: 'no-cors' as a last resort to get the data through the firewall
        const response = await fetch(tunnelUrl, {
            method: 'GET',
            mode: 'no-cors', // This tells Chrome to stop worrying about CORS headers
            redirect: 'follow'
        });

        // Since 'no-cors' responses are opaque, we refetch with a standard 
        // fallback if the first one fails to provide text.
        const res = await fetch(tunnelUrl);
        const html = await res.text();

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
        return new Response("<h1>Tunnel Failure</h1><p>Chrome blocked the handshake. Check console for CORS logs.</p>");
    }
}

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('helios-proxy=')) {
        const actualUrl = decodeURIComponent(event.request.url.split('helios-proxy=')[1]);
        event.respondWith(proxyFetch(actualUrl));
    }
});
