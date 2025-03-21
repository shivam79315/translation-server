import express from 'express';
import cors from 'cors';
import Reverso from 'reverso-api';

const app = express();
const reverso = new Reverso();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true  // Allow cookies/auth headers if needed
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/translate', async (req, res) => {
    const { text, from, to } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const result = await reverso.getTranslation(text, 'english', 'hebrew');

        // Ensure translation exists and is an array
        if (result) {
            res.json({ translation: result });
            console.log("Translation:", result);
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