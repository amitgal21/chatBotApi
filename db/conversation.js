// db/conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    userMessage: String,
    botMessage: String,
    audioFileId: mongoose.Schema.Types.ObjectId, // מזהה הקובץ ב-GridFS
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
