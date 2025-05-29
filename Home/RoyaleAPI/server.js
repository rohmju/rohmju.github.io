import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Clash Royale API-Key
const API_KEY = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjNkZTUwYzlhLWVjZGQtNDdmZi05NzY4LTU5MDYzMDI1MjBkMSIsImlhdCI6MTc0ODU0NzE1MCwic3ViIjoiZGV2ZWxvcGVyLzY0OWIwMTUzLTAxOTAtNjYwYy1hMTI5LWZiZjUxNWQ3NTZmNSIsInNjb3BlcyI6WyJyb3lhbGUiXSwibGltaXRzIjpbeyJ0aWVyIjoiZGV2ZWxvcGVyL3NpbHZlciIsInR5cGUiOiJ0aHJvdHRsaW5nIn0seyJjaWRycyI6WyIxOC4xNTYuMTU4LjUzIiwiMTguMTU2LjQyLjIwMCIsIjUyLjU5LjEwMy41NCJdLCJ0eXBlIjoiY2xpZW50In1dfQ.yfQ4LfiGwUW1V31p3HALd50-XqqTXW9_LG3NG269_w0fFv8gEoWOLOYAZ04kci8MEPJos4Mk6cohSFeG3vW-5g';

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