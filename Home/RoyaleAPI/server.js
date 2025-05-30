import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Clash Royale API-Key


app.use(cors());

app.get('/cards', async (req, res) => {
    try {
        const response = await fetch('https://api.clashroyale.com/v1/cards', {
            headers: {
                Authorization: API_KEY
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Clash Royale API error' });
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Clash Royale Proxy is running 🏰');
});

app.listen(PORT, () => {
    console.log(`✅ Proxy läuft unter http://localhost:${PORT}`);
});