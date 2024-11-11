require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(express.json());  // מאפשר קריאת JSON מהבקשות

// אתחול Configuration ויצירת אובייקט API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Welcome to the ChatBot API Server');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userMessage }
            ],
        });

        const botMessage = response.data.choices[0].message.content;
        res.json({ reply: botMessage });
    } catch (error) {
        console.error("Error with OpenAI API:", error.response ? error.response.data : error.message);
        res.status(500).send("Error with OpenAI API");
    }
});

module.exports = app;
