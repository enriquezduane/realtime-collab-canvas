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
        const data = JSON.parse(message);
        console.log('Received data:', data);

        // Broadcast to all other connected clients (not the sender)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    });
    // Handle client disconnections
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is ready and attached to the HTTP server.');
