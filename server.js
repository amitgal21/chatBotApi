const http = require('http');
const app = require('./app'); 
const port = 3000;
const connectDB = require('./db/connection');
connectDB(); 
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
