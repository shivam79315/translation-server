import express from 'express';
import cors from 'cors';
import Reverso from 'reverso-api';

const app = express();
const reverso = new Reverso();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true  
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/translate', async (req, res) => {
    const { text, from, to } = req.body;

    console.log("Request:", text);

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const response = await fetch("https://api.reverso.net/translate/v1/translation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: text,
                from: from,
                to: to,
                format: "text"
            }),
        });

        const result = await response.json();

        console.log("API Response:", result);

        if (result.translation) {
            res.json({ translation: result.translation });
        } else {
            res.status(500).json({ error: "No translation available." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to fetch translation." });
    }
});

const PORT = 8912;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));