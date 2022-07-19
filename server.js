const { createServer } = require('http');
const app = require('./src/app');
require('dotenv').config();

//set up the port
const PORT = process.env.PORT || 5000;

//Spin server
const server = createServer(app);
server.listen(PORT, () => {
    console.log(`Server listening to Port ${PORT}`);
});