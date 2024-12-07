const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public")); // serving the frontend

// setting up a websocket to allow drawing data to be shared
io.on("connection", (socket) => {
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });
  socket.on("clearCanvas", () => {
    socket.broadcast.emit("clearCanvas");
  });
  socket.broadcast.emit("userCount", io.engine.clientsCount);
  socket.on("disconnect", () => {
    socket.broadcast.emit("userCount", io.engine.clientsCount);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
