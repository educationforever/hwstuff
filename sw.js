// Helios Master Proxy (sw.js)
const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_NEW_URL_HERE'; 

async function tryFetch(actualUrl) {
    try {
        const target = GOOGLE_SCRIPT_URL + '?url=' + encodeURIComponent(actualUrl);

        // 'no-cors' allows the fetch to happen even if Securly/iPad is blocking headers
        const response = await fetch(target, {
            method: 'GET',
            mode: 'no-cors', 
            redirect: 'follow'
        });

        /** * With no-cors, we get back an 'opaque' response. 
         * If the opaque fetch fails, we try the standard fetch as a backup.
         */
        let html;
        if (response.type === 'opaque') {
            // Since we can't read 'opaque' text directly, we have to refetch 
            // via a proxy-in-a-proxy or assume the bridge is up.
            const backupResponse = await fetch(target);
            html = await backupResponse.text();
        } else {
            html = await response.text();
        }
        
        const newHeaders = new Headers();
        newHeaders.set('Content-Type', 'text/html');

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
        return new Response('<div style="color:red; background:black; padding:20px;"><h1>Tunnel Error</h1><p>' + err.message + '</p></div>', {
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
