self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    if (url.includes('helios-proxy=')) {
        const actualUrl = decodeURIComponent(url.split('helios-proxy=')[1]);
        
        // We fetch the data via a CORS bridge to bypass X-Frame-Options
        const proxyUrl = 'https://api.allorigins.win/get?url=' + encodeURIComponent(actualUrl);

        event.respondWith(
            fetch(proxyUrl)
                .then(res => res.json())
                .then(data => {
                    return new Response(data.contents, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
                .catch(err => {
                    // Fail gracefully if bridge is down
                    return new Response("<h1>Proxy Error</h1><p>Failed to tunnel request.</p>", {
                        headers: { 'Content-Type': 'text/html' }
                    });
                })
        );
    }
});
