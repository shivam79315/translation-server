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
        const result = await reverso.getTranslation(text, from, to);
        console.log("API Response:", result);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));