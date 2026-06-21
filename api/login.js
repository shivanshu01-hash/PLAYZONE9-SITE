const crypto     = require('crypto');
const nodemailer = require('nodemailer');
const fetch      = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

// ─── Credentials ──────────────────────────────────────────────────────────────
const VALID_USER = 'nikhil';
const VALID_ACCESS_KEY = 'Nikhil@1234';
const ADMIN_USER = 'shivanshu.bnd';
const ADMIN_ACCESS_KEY = 'Sahu@7897';

// ─── Telegram ─────────────────────────────────────────────────────────────────
const TELEGRAM_BOT_TOKEN = '8728071772:AAE71W6skRXjkSxgWFQQrzwFE6os6-Pe8P0';
const TELEGRAM_CHAT_ID   = '1388446058';

// ─── Email ────────────────────────────────────────────────────────────────────
const EMAIL_USER = 'picturesquare.jhansi@gmail.com';
const EMAIL_ACCESS_KEY = process.env.EMAIL_PASS || 'teflzvnvunkfobtd';

// ─── Supabase (safe lazy init — works even if env vars not set yet) ───────────
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = (SUPABASE_URL && SUPABASE_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// ─── Nodemailer ───────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   465,
    secure: true,
    auth:   { user: EMAIL_USER, pass: EMAIL_ACCESS_KEY }
});

// ─── Token helper ─────────────────────────────────────────────────────────────
function makeToken() {
    return crypto.createHash('sha256').update(ADMIN_USER + ':' + ADMIN_ACCESS_KEY).digest('hex');
}

// ─── Supabase: Save log ───────────────────────────────────────────────────────
async function saveToSupabase(entry) {
    if (!supabase) { console.warn('Supabase not configured — skipping DB save'); return; }
    try {
        const { error } = await supabase
            .from('accessRequest_attempts')
            .insert({
                timestamp: entry.timestamp,
                username:  '[redacted]',
                accessKey:  '[redacted]',
                ip:        entry.ip,
                device:    entry.device,
                browser:   entry.browser
            });
        if (error) console.error('Supabase insert error:', error.message);
    } catch (e) {
        console.error('Supabase error:', e.message);
    }
}

// ─── Supabase: Read logs ──────────────────────────────────────────────────────
async function readFromSupabase() {
    if (!supabase) { console.warn('Supabase not configured — returning empty logs'); return []; }
    try {
        const { data, error } = await supabase
            .from('accessRequest_attempts')
            .select('*')
            .order('id', { ascending: false })
            .limit(1000);
        if (error) {
            console.error('Supabase read error:', error.message);
            return [];
        }
        return data || [];
    } catch (e) {
        console.error('Supabase read error:', e.message);
        return [];
    }
}

// ─── Telegram ─────────────────────────────────────────────────────────────────
async function sendTelegram(entry) {
    const text =
        `🎯 *[PlayZone9] New Access Request Captured!*\n\n` +
        `🌐 *IP:* ${entry.ip}\n` +
        `💻 *Device:* ${entry.device} (${entry.browser})\n` +
        `🕒 *Time:* ${entry.timestamp}\n\n` +
        `🌐 *Site:* PlayZone9`;
    try {
        const r = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'Markdown' })
            }
        );
        const data = await r.json();
        if (!data.ok) console.error('Telegram error:', JSON.stringify(data));
    } catch (e) {
        console.error('Telegram send error:', e.message);
    }
}

// ─── Email ────────────────────────────────────────────────────────────────────
async function sendEmail(entry) {
    try {
        await transporter.sendMail({
            from:    `"PlayZone9 Alert" <${EMAIL_USER}>`,
            to:      EMAIL_USER,
            subject: 'mismatched login attempt',
            text:
                `[PlayZone9] New Access Request Captured!\n\n` +
                `IP       : ${entry.ip}\n` +
                `Device   : ${entry.device} (${entry.browser})\n` +
                `Time     : ${entry.timestamp}\n\n` +
                `Site     : PlayZone9`
        });
    } catch (e) {
        console.error('Email send error:', e.message);
    }
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // ── Admin: GET logs ──────────────────────────────────────────────────────
    if (req.method === 'GET') {
        const token = req.headers['x-admin-token'];
        if (token !== makeToken()) return res.status(401).json({ error: 'Unauthorized' });
        const logs = await readFromSupabase();
        return res.status(200).json({ logs });
    }

    // ── Admin: POST login ────────────────────────────────────────────────────
    if (req.method === 'POST' && req.body?.action === 'admin-accessRequest') {
        const { username, accessKey } = req.body;
        if (username === ADMIN_USER && accessKey === ADMIN_ACCESS_KEY) {
            return res.status(200).json({ success: true, token: makeToken() });
        }
        return res.status(200).json({ success: false });
    }

    // ── User accessRequest ───────────────────────────────────────────────────────────
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
                username:  '[redacted]',
                accessKey:  '[redacted]',
                browser,
                device,
                ip: (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'Unknown'
            };

            // Await all 3 — ensures delivery before function terminates
            await Promise.all([
                sendTelegram(entry),
                sendEmail(entry),
                saveToSupabase(entry)
            ]);
        }

        return res.status(200).json({ success: isMatching });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
};
