const express = require('express')
const { WebSocketServer } = require('ws');
const app = express()
const port = 3000

app.use(express.static('public'))

const server = app.listen(port, () => {
    console.log(`Application is listening on port ${port}`)
})

const wss = new WebSocketServer({ server });

// Store all drawing actions
const drawingHistory = [];

ws.on('message', function incoming(message) {
    const data = JSON.parse(message);

    if (data.type === 'clear') {
        drawingHistory.length = 0; // Clear history first
        // Broadcast clear to all clients including sender
        wss.clients.forEach(function each(client) {
            if (client.readyState === client.OPEN) {
                client.send(JSON.stringify({ type: 'clear' }));
            }
        });
    } else if (data.type === 'draw') {
        // Store the draw data consistently
        drawingHistory.push({
            lastX: data.lastX,
            lastY: data.lastY,
            currentX: data.currentX,
            currentY: data.currentY,
            color: data.color
        });

        // Broadcast to other clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
});  // Handle client disconnections

ws.on('close', () => {
    console.log('Client disconnected');
});

// Handle errors
ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});
});

console.log('WebSocket server is ready and attached to the HTTP server.');

