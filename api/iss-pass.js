// If using Node.js 18+, fetch is available globally. If not, uncomment the next line:
// import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({ error: 'Missing lat or lon parameter' });
    }
    const url = `https://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Upstream ISS API error');
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // Fallback demo data for hackathon/demo
        res.status(200).json({
            response: [
                { risetime: Math.floor(Date.now() / 1000) + 3600, duration: 600 },
                { risetime: Math.floor(Date.now() / 1000) + 7200, duration: 480 },
                { risetime: Math.floor(Date.now() / 1000) + 10800, duration: 540 }
            ],
            fallback: true,
            error: error.message
        });
    }
} 