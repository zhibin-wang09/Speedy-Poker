import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000"},
});

// listens for the connection event
io.on("connection", (socket) => {
  socket.on("initializeGame", (data) => {});

  socket.on("joinGameRoom", (data) => {});

  socket.on("test", () => {
    console.log("received");

  });
});

httpServer.listen(8080);
