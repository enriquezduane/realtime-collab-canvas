const c = document.querySelector(".myCanvas");
const ws = new WebSocket('ws://localhost:3000');
const ctx = c.getContext("2d");
ctx.strokeStyle = "#000000"; // Black color
ctx.lineWidth = 2;
ctx.lineCap = "round";

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Function to draw a line
function drawLine(fromX, fromY, toX, toY) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
}

// getBoundingClientRect makes sure drawing coords are relative to the canvas, not the entire page
c.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = c.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});

ws.addEventListener('message', (e) => {
    const message = JSON.parse(e.data);

    if (message.type === 'history') {
        message.data.forEach(drawData => {
            drawLine(drawData.lastX, drawData.lastY, drawData.currentX, drawData.currentY);
        });
    } else if (message.type === 'draw') {
        const data = message.data;
        drawLine(data.lastX, data.lastY, data.currentX, data.currentY);
    }
});

// drawing logic
c.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = c.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    drawLine(lastX, lastY, currentX, currentY);

    const data = { lastX, lastY, currentX, currentY }

    ws.send(JSON.stringify(data));

    lastX = currentX;
    lastY = currentY;
});

c.addEventListener('mouseup', () => {
    isDrawing = false;
});

// if mouse leaves the canvas, stop drawing
c.addEventListener('mouseleave', () => {
    isDrawing = false;
});

// Add error handling
ws.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
});

ws.addEventListener('close', () => {
    console.log('Connection closed');
});
