// Helios Mini-Server (sw.js)
const PROXY_PREFIX = 'https://api.codetabs.com/v1/proxy?quest=';

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if (url.includes('helios-proxy=')) {
        const actualUrl = decodeURIComponent(url.split('helios-proxy=')[1]);
        
        event.respondWith(
            fetch(PROXY_PREFIX + encodeURIComponent(actualUrl))
                .then(response => {
                    const newHeaders = new Headers(response.headers);
                    
                    // Kill the blockers
                    newHeaders.delete('X-Frame-Options');
                    newHeaders.delete('content-security-policy');
                    // Add HTML content type just in case the proxy strips it
                    newHeaders.set('Content-Type', 'text/html');

                    return response.text().then(html => {
                        // Injection: This script ensures links inside the proxied page 
                        // also go through Helios instead of breaking out.
                        const injectedCode = `
                            <script>
                                document.querySelectorAll('a').forEach(link => {
                                    link.href = window.location.origin + '/helios-proxy=' + encodeURIComponent(link.href);
                                });
                            </script>
                        `;
                        
                        return new Response(html + injectedCode, {
                            status: 200,
                            headers: newHeaders
                        });
                    });
                })
                .catch(err => {
                    return new Response("<h1>Helios Tunnel Offline</h1><p>The bridge is refusing the connection. Try a different URL.</p>", {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
    }
});
