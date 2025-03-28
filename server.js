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

app.get('/', async (req, res) => {
    try {
        if (!reverso || typeof reverso.getTranslation !== 'function') {
            console.error("Reverso API is not available or getTranslation method does not exist.");
            return res.status(500).json({ error: "Reverso API is unavailable" });
        }

        // Fetch translation
        const result = await reverso.getTranslation("Hello");

        console.log("Translation:", result);

        // Send response
        res.json({ message: "Hello, World!"});

    } catch (error) {
        console.error("Reverso API Error:", error);
        res.status(500).json({ error: "Failed to fetch translation" });
    }
});

app.post('/translate', async (req, res) => {
    const { text, from, to } = req.body;
    console.log("Request:", text);
    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const result = await reverso.getTranslation(text, from, to);
        
        if (result) {
            console.log("Translation:", result);
            res.json({ translation: "translated" });
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
