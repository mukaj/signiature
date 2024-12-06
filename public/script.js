const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const socket = io(); // Connect to WebSocket server
let isDrawing = false;

let strokeColor = "black";

// Capture mouse/touch events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);

canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

function startDrawing(event) {
  isDrawing = true;
  const { x, y } = getCoordinates(event);
  ctx.beginPath();
  ctx.moveTo(x, y);
}

function draw(event) {
  if (!isDrawing) return;
  const { x, y } = getCoordinates(event);
  ctx.lineTo(x, y);
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Emit drawing data
  const data = { x, y, eventType: "draw", color: strokeColor };
  socket.emit("drawing", data);
}

function stopDrawing() {
  isDrawing = false;
  ctx.closePath();
}

function getCoordinates(event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX || event.touches[0].clientX) - rect.left;
  const y = (event.clientY || event.touches[0].clientY) - rect.top;
  return { x, y };
}

// Listen for incoming drawing data
socket.on("drawing", (data) => {
  ctx.lineTo(data.x, data.y);
  ctx.strokeStyle = data.color;
  ctx.lineWidth = 2;
  ctx.stroke();
});

// Clear canvas button
const clearButton = document.getElementById("clearCanvasButton");

clearButton.addEventListener("click", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  socket.emit("clearCanvas");
});

// Listen for clear canvas event
socket.on("clearCanvas", function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

const yellowButton = document.getElementById("yellowBtn");
const blueButton = document.getElementById("blueBtn");
const blackButton = document.getElementById("blackBtn");

yellowButton.addEventListener("click", () => {
  strokeColor = "yellow";
});
blueButton.addEventListener("click", () => {
  strokeColor = "blue";
});
blackButton.addEventListener("click", () => {
  strokeColor = "black";
});

// Prevent scrolling when touching the canvas, iOS specific bug
document.body.addEventListener(
  "touchstart",
  function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  { passive: false }
);
document.body.addEventListener(
  "touchend",
  function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  { passive: false }
);
document.body.addEventListener(
  "touchmove",
  function (e) {
    if (e.target == canvas) {
      e.preventDefault();
    }
  },
  { passive: false }
);
