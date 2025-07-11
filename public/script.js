const c = document.querySelector(".myCanvas");
const ws = new WebSocket('ws://localhost:3000');
const ctx = c.getContext("2d");
ctx.strokeStyle = "#000000"; // Black color
ctx.lineWidth = 2;
ctx.lineCap = "round";

let isDrawing = false;
let lastX = 0;
let lastY = 0;

let currentColor = "#000000";


const colorSwatches = document.querySelectorAll('.color-swatch');
const clearBtn = document.querySelector('.clear-btn');

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        // Remove active class from all swatches
        colorSwatches.forEach(s => s.classList.remove('active'));
        // Add active class to clicked swatch
        swatch.classList.add('active');
        // Update current color
        currentColor = swatch.dataset.color;
        ctx.strokeStyle = currentColor;
    });
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, c.width, c.height);
    ws.send(JSON.stringify({ type: 'clear' }));
});

// Function to draw a line
function drawLine(fromX, fromY, toX, toY, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    ctx.restore();
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

    console.log(message)
    if (message.type === 'history') {
        message.data.forEach(drawData => {
            drawLine(drawData.lastX, drawData.lastY, drawData.currentX, drawData.currentY, drawData.color);
        });
    } else if (message.type === 'draw') {
        const data = message.data;
        drawLine(data.lastX, data.lastY, data.currentX, data.currentY, data.color);
    } else if (message.type === 'clear') {
        ctx.clearRect(0, 0, c.width, c.height);
    }
});

// drawing logic
c.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = c.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    drawLine(lastX, lastY, currentX, currentY, currentColor);

    const data = {
        type: 'draw',
        lastX,
        lastY,
        currentX,
        currentY,
        color: currentColor
    }

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
