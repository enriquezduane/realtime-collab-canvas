const express = require('express')
const { WebSocketServer } = require('ws');
const app = express()

const port = 3000

app.use(express.static('public'))

const server = app.listen(port, () => {
    console.log(`Application is listening on port ${port}`)
})

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    console.log('A new client connected!');

    // Handle messages received from clients
    ws.on('message', function incoming(message) {
        console.log('received from client: %s', message);

        // Example: Echo the message back to the client
        // ws.send(`Server received: ${message}`);
    });

    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });

    // Send a welcome message to the newly connected client
    ws.send('Welcome to the WebSocket server!');
});

console.log('WebSocket server is ready and attached to the HTTP server.');
