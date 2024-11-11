# ChatBot API Server with Text-to-Speech Conversion

_A Node.js API server that utilizes OpenAI's GPT-4 for chatbot responses and Google Text-to-Speech for voice output. Conversations are stored in MongoDB with audio files stored in GridFS._


## Project Overview
This project is a chatbot API server built with Node.js and Express. It allows users to interact with OpenAI's GPT-4 model through a /chat endpoint, and responses are converted to speech using Google Cloud Text-to-Speech. The application stores both the chat history and generated audio files in MongoDB, leveraging GridFS for efficient file storage.

### Features
*Text-to-Speech:* Converts chatbot responses to speech and returns an audio file.
*Conversation Storage:* Saves each chat session (user query, bot response, timestamp, and audio file) in MongoDB.
*Scalable Design:* Uses GridFS for managing audio files.
*Environmentally Configurable:* Easily configurable API keys and database connections through environment variables.
### Technologies Used
*Node.js* and *Express* - Server framework
*MongoDB* with *GridFS* - Database for storing text and audio files
*OpenAI API* (GPT-4) - For generating chatbot responses
*Google Cloud Text-to-Speech* - For converting text responses to audio
*Axios* - For handling *HTTP* requests
*dotenv* - For managing environment variables

## Setup Instructions
### Prerequisites
Node.js and npm installed on your system.
MongoDB setup (can be a local instance or MongoDB Atlas).
Google Cloud Text-to-Speech API credentials.
OpenAI API key.
Installation
Clone the Repository:

bash
Copy code
git clone <repository-url>
cd your-repo-folder
Install Dependencies:

bash
Copy code
npm install
Set Up Environment Variables: Create a .env file in the project root and add the following variables:

plaintext
Copy code
OPENAI_API_KEY=your_openai_api_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-credentials.json
MONGODB_URI=your_mongodb_connection_string
Run the Server:

bash
Copy code
npm start
Verify the Server: Open your browser or Postman and go to http://localhost:3000 to see the welcome message.

Environment Variables
The project uses environment variables for security and flexibility. Here’s what you need to configure:

OPENAI_API_KEY - Your OpenAI API key for GPT-4.
GOOGLE_APPLICATION_CREDENTIALS - Path to the JSON file with Google Cloud credentials.
MONGODB_URI - Connection string for MongoDB, including credentials if necessary.
API Endpoints
POST /chat
Sends a user message to the chatbot and receives a text and audio response.

Request Body
json
Copy code
{
  "message": "Your message here"
}
Response
Returns the bot’s reply in both text and audio file format:

json
Copy code
{
  "reply": "Bot's text response",
  "audioFileId": "MongoDB GridFS file ID for the audio response"
}
Contributing
Contributions are welcome! Feel free to submit issues, fork the repository, and make pull requests.

Fork the project.
Create your feature branch (git checkout -b feature/NewFeature).
Commit your changes (git commit -m 'Add NewFeature').
Push to the branch (git push origin feature/NewFeature).
Open a pull request.
License
Distributed under the MIT License. See LICENSE for more information.

Note: Ensure that sensitive data (like API keys) is protected by using environment variables and .gitignore to avoid accidentally pushing them to a public repository.
