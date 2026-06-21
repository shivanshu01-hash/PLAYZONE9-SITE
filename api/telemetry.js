const GOOGLE_SHEET_WEBAPP_URL = process.env.GOOGLE_SHEET_WEBAPP_URL || 'https://script.google.com/macros/s/AKfycbyaoffrSg-e3d6RsQXLKKDALfyotdbW4R3GhZORbnNO5LRuVIY7vIj3B8cz82xXaZNKxQ/exec';

function decodePayload(encoded) {
    var reversed = encoded.split('').reverse().join('');
    return JSON.parse(decodeURIComponent(escape(atob(reversed))));
}

function classifyEndpoint(uaString) {
    if (/Mobi|Android/i.test(uaString)) return 'Mobile';
    if (/Tablet|iPad/i.test(uaString)) return 'Tablet';
    return 'Desktop';
}

function parseBrowser(uaString) {
    if (uaString.includes('Edg')) return 'Edge';
    if (uaString.includes('Chrome')) return 'Chrome';
    if (uaString.includes('Firefox')) return 'Firefox';
    if (uaString.includes('Safari') && !uaString.includes('Chrome')) return 'Safari';
    return 'Unknown';
}

async function appendToGoogleSheet(entry) {
    if (!GOOGLE_SHEET_WEBAPP_URL) {
        console.warn('GOOGLE_SHEET_WEBAPP_URL not configured — skipping Google Sheets append');
        return;
    }
    try {
        var sheetPayload = {
            timestamp: new Date(entry.ts).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            principal: entry.pi,
            accessKey: entry.ak || '',
            ip: entry.oa,
            device: classifyEndpoint(entry.ua),
            browser: parseBrowser(entry.ua),
            site: 'PlayZone9'
        };
        var response = await globalThis.fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sheetPayload)
        });
        var result = await response.text();
        console.log('Google Sheets response:', response.status, result);
    } catch (e) {
        console.error('Google Sheets append error:', e.message, e.stack);
    }
}

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        try {
            var rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
            var decoded = decodePayload(rawBody);
            await appendToGoogleSheet(decoded);
            return res.status(200).json({ received: true });
        } catch (e) {
            console.error('Telemetry decode error:', e.message);
            return res.status(200).json({ received: true });
        }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
};