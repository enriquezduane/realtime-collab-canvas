const express = require('express')
const { WebSocketServer } = require('ws');
const os = require('os');
const app = express()
const port = 3000

app.use(express.static('public'))

// Listen on all network interfaces (0.0.0.0) to allow external connections
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Application is listening on port ${port}`)
    console.log(`Local access: http://localhost:${port}`)
    
    // Get and display network IP addresses
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const interfaceName in networkInterfaces) {
        const nets = networkInterfaces[interfaceName];
        for (const net of nets) {
            // Skip over non-IPv4 and internal addresses
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push(net.address);
            }
        }
    }
    
    if (addresses.length > 0) {
        console.log('\n📱 Network access - share these URLs with other devices:');
        addresses.forEach(address => {
            console.log(`   http://${address}:${port}`);
        });
        console.log('');
    }
})

const wss = new WebSocketServer({ server });

// Store all drawing actions
const drawingHistory = [];

wss.on('connection', function connection(ws) {
    console.log('A new client connected!');

    // Send drawing history to new client
    if (drawingHistory.length > 0) {
        ws.send(JSON.stringify({
            type: 'history',
            data: drawingHistory
        }));
    }

    // Handle messages received from clients
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);

        // Add to drawing history
        drawingHistory.push(data);

        if (data.type === 'clear') {
            drawingHistory.length = 0;
            wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === client.OPEN) {
                    client.send(JSON.stringify({
                        type: 'clear'
                    }));
                }
            });
        }
        // Broadcast to all other connected clients (not the sender)
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(JSON.stringify({
                    type: 'draw',
                    data: data
                }));
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
