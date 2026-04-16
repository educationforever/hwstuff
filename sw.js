// Helios Private Tunnel (sw.js)
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbycVJNOkez6L7h3B_jDwbVzZIh11qfFGAzFMwAEysdlulEKhj1jQxUGpG1Tu_xrlqjQ/exec'; // Ends in /exec

async function tryFetch(actualUrl) {
    try {
        const target = GOOGLE_SCRIPT_URL + '?url=' + encodeURIComponent(actualUrl);

        // We use 'follow' to handle the Google Apps Script redirect
        // and 'cors' mode to ensure the browser allows the data through
        const response = await fetch(target, {
            method: 'GET',
            redirect: 'follow',
            mode: 'cors'
        });

        // Check if the response actually made it
        if (!response.ok) {
            throw new Error(`Bridge responded with status ${response.status}`);
        }

        const html = await response.text();
        
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
        // This is what you see if the iPad blocks the fetch
        return new Response(\`
            <div style="color:white; background:#111; padding:20px; font-family:sans-serif;">
                <h1>Helios Tunnel Error</h1>
                <p>Status: \${err.message}</p>
                <hr>
                <p><b>Checklist:</b></p>
                <ul>
                    <li>Does your URL end in /exec?</li>
                    <li>Did you click "Deploy" > "New Deployment" after every code change?</li>
                    <li>Is access set to "Anyone" (NOT "Anyone with Google Account")?</li>
                </ul>
            </div>
        \`, { headers: { 'Content-Type': 'text/html' } });
    }
}

self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('helios-proxy=')) {
        const urlPart = event.request.url.split('helios-proxy=')[1];
        const actualUrl = decodeURIComponent(urlPart);
        event.respondWith(tryFetch(actualUrl));
    }
});
