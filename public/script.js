var c = document.querySelector(".myCanvas");

if (c) {
    var ctx = c.getContext("2d");
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 100);
    ctx.stroke();
} else {
    console.error("Canvas element with class 'myCanvas' not found!");
}
