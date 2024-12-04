const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");
const socket = io(); // Connect to WebSocket server
let isDrawing = false;

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
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Emit drawing data
  const data = { x, y, eventType: "draw" };
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
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
});
