var c = document.querySelector(".myCanvas");

if (c) {
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

    // Mouse move - draw line
    c.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;

        const rect = c.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

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
} else {
    console.error("Canvas element with class 'myCanvas' not found");
}
