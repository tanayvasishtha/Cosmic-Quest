export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const API_KEY = process.env.PPLX_API_KEY;

    // Check if API key exists
    if (!API_KEY) {
        console.error('PPLX_API_KEY environment variable is not set');
        return res.status(500).json({
            error: 'API key not configured',
            details: 'PPLX_API_KEY environment variable is missing'
        });
    }

    console.log('API Key exists:', API_KEY ? 'Yes' : 'No');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    const ENDPOINT = 'https://api.perplexity.ai/chat/completions';

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'accept': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        console.log('Perplexity API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Perplexity API error:', response.status, errorText);
            return res.status(response.status).json({
                error: 'Perplexity API error',
                status: response.status,
                details: errorText
            });
        }

        const data = await response.json();
        console.log('Perplexity API success:', data);
        res.status(200).json(data);

    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({
            error: 'Proxy error',
            details: error.message,
            stack: error.stack
        });
    }
} 