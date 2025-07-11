const c = document.querySelector(".myCanvas");

const ws = new WebSocket('ws://localhost:3000');

const ctx = c.getContext("2d");

ctx.strokeStyle = "#000000"; // Black color
ctx.lineWidth = 2;
ctx.lineCap = "round";

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// getBoundingClientRect makes sure drawing coords are relative to the canvas, not the entire page

c.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = c.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
});


ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data);
    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.currentX, data.currentY);
    ctx.stroke();
});

// drawing logic
c.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = c.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

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
