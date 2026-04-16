// Helios Master Proxy (sw.js)
const bridges = [
    'https://api.codetabs.com/v1/proxy?quest=',
    'https://api.allorigins.win/raw?url=',
    'https://thingproxy.freeboard.io/fetch/'
];

async function tryFetch(actualUrl) {
    for (let bridge of bridges) {
        try {
            const response = await fetch(bridge + encodeURIComponent(actualUrl), {
                mode: 'cors',
                credentials: 'omit'
            });

            if (response.ok) {
                const newHeaders = new Headers(response.headers);
                newHeaders.delete('X-Frame-Options');
                newHeaders.delete('content-security-policy');
                newHeaders.set('Content-Type', 'text/html');

                const html = await response.text();
                
                // Keep links inside the proxy
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
            }
        } catch (err) {
            console.log("Bridge failed, trying next...");
        }
    }
    return new Response("<h1>All Helios Tunnels Blocked</h1><p>Your network is blocking all available proxy bridges.</p>", {
        headers: { 'Content-Type': 'text/html' }
    });
}

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('helios-proxy=')) {
        const actualUrl = decodeURIComponent(event.request.url.split('helios-proxy=')[1]);
        event.respondWith(tryFetch(actualUrl));
    }
});
