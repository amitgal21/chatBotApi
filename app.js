require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const { MongoClient, GridFSBucket } = require('mongodb'); // ייבוא GridFS
const textToSpeech = require('@google-cloud/text-to-speech');
const Conversation = require('./db/conversation');
const connectDB = require('./db/connection'); // חיבור למסד הנתונים

const app = express();
app.use(express.json());
app.use(morgan('dev'));

const apiKey = process.env.OPENAI_API_KEY;

// פונקציה להמרת טקסט לקול
async function textToSpeechConversion(text) {
    const client = new textToSpeech.TextToSpeechClient();

    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');

    return 'output.mp3'; // נתיב קובץ הקול שנוצר
}

// פונקציה להעלאת קובץ ל-GridFS
async function uploadAudioToGridFS(filePath) {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(); // מתחבר למסד הנתונים
    const bucket = new GridFSBucket(db, { bucketName: 'audioFiles' });

    return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(filePath);
        fs.createReadStream(filePath)
            .pipe(uploadStream)
            .on('error', (error) => {
                console.error("Error uploading file to MongoDB:", error);
                reject(error);
            })
            .on('finish', () => {
                console.log("File uploaded successfully to MongoDB.");
                resolve(uploadStream.id); // מחזיר את מזהה הקובץ שנשמר
            });
    });
}

app.get('/', (req, res) => {
    res.send('Welcome to the ChatBot API Server');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: userMessage }
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const botMessage = response.data.choices[0].message.content;

        // המרת טקסט לקול
        const audioFilePath = await textToSpeechConversion(botMessage);

        // העלאת קובץ ה-MP3 ל-GridFS
        const audioFileId = await uploadAudioToGridFS(audioFilePath);

        // שמירת השיחה במסד הנתונים כולל מזהה הקובץ
        const conversation = new Conversation({
            userMessage: userMessage,
            botMessage: botMessage,
            audioFileId: audioFileId // שמירת מזהה הקובץ
        });
        await conversation.save();

        res.json({ reply: botMessage, audioFileId: audioFileId });
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        res.status(500).send("Error processing request");
    }
});

module.exports = app;
