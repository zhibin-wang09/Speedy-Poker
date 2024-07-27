import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Card, Game, Player } from "../shared/types/types";
import { initializeGameState, useCard } from "./apis/socketApi";
import { ClientToServer, SocketData, ServerToClient } from "../shared/types/events";

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServer, ServerToClient, SocketData>(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

// listens for the connection event
io.on("connection", (socket) => {
  // initialize the games in socket data
  socket.data.games = new Map<number, Game>();
  socket.on("initializeGameState", (gameID: number) => {
    const game: Game = initializeGameState();
    socket.data.games.set(0, game);
    socket.emit("sendGameState", game);
  });

  socket.on("useCard", (card: Card, gameID: number, player: Player) => {
    if (!socket.data.games.has(gameID)) {
      console.log("ERROR!!!");
      return;
    }
    let game = socket.data.games.get(gameID);
    game = useCard(card, player, game);
    if (!game) return;
    socket.emit("sendGameState", game);
  });

  socket.on("joinGameRoom", (gameID: number) => {});

  socket.on("disconnect", () => {});
});

httpServer.listen(8080);
