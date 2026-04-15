// Helios Mini-Server (sw.js)
const PROXY_PREFIX = 'https://corsproxy.io/?';

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if (url.includes('helios-proxy=')) {
        const actualUrl = decodeURIComponent(url.split('helios-proxy=')[1]);
        
        event.respondWith(
            fetch(PROXY_PREFIX + encodeURIComponent(actualUrl))
                .then(response => {
                    // We clone the response to modify the headers
                    const newHeaders = new Headers(response.headers);
                    
                    // CRITICAL: Strip the security headers that block iframes
                    newHeaders.delete('X-Frame-Options');
                    newHeaders.delete('content-security-policy');

                    return response.text().then(html => {
                        return new Response(html, {
                            status: response.status,
                            statusText: response.statusText,
                            headers: newHeaders
                        });
                    });
                })
                .catch(err => {
                    return new Response("<h1>Helios Proxy Error</h1><p>The bridge is currently congested. Try again in a moment.</p>", {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
    }
});
