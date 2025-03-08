import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { Card, Game, Player, PlayerId } from "@/types/types";

const dev = process.env.NODE_ENV !== "production";
console.log(process.env.NODE_ENV);
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const games = new Map<number, Game>();
const socketToGame = new Map<string, Game>();
const currentRoomIDs = new Set<string>();

interface joinGameInput {
  roomID: number;
  playerName: string;
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(`user ${socket.id} joined`);

    //  initialize the games in socket data
    //  this assumes that the game has been created when the room is created
    //  since the game has been created and players has been assigned
    //  we will only send game state visible to that player
    socket.on("getGameState", (gameID: number) => {
      // if the game was already created, join that game instead
      let existingGame = games.get(gameID);
      socket.emit("receiveGameState", existingGame);
    });

    socket.on("playCard", (card: Card, gameID: number, player: Player) => {
      let game = games.get(gameID);
      if (!game) {
        console.log("ERROR!!!");
        return;
      }

      game.useCard(card, player);
      if (!game) {
        io.sockets.in(String(gameID)).emit("receiveGameState", game);
        return;
      }

      if (game.player1.hand.length == 0) {
        if (game.player2.point > game.player1.point) {
          io.to(game.player2.socketID).emit("result", "You Won the Game!");
          socketToGame.delete(game.player1.socketID!);
          socketToGame.delete(game.player2.socketID!);
          games.delete(game.gameID);
        } else if (game.player1.point > game.player2.point) {
          io.to(game.player1.socketID).emit("result", "You Lose the Game!");
          socketToGame.delete(game.player1.socketID!);
          socketToGame.delete(game.player2.socketID!);
          games.delete(game.gameID);
        } else {
          io.to(game.player1.socketID).emit("result", "Tie game");
          io.to(game.player2.socketID).emit("result", "Tie game");
          socketToGame.delete(game.player1.socketID!);
          socketToGame.delete(game.player2.socketID!);
          games.delete(game.gameID);
        }
      } else if (game.player2.hand.length == 0) {
        if (game.player2.point > game.player1.point) {
          io.to(game.player1.socketID).emit("result", "You Won the Game!");
          socketToGame.delete(game.player1.socketID!);
          socketToGame.delete(game.player2.socketID!);
          games.delete(game.gameID);
        } else if (game.player1.point > game.player2.point) {
          io.to(game.player2.socketID).emit("result", "You Lose the Game!");
          socketToGame.delete(game.player1.socketID!);
          socketToGame.delete(game.player2.socketID!);
          games.delete(game.gameID);
        } else {
          io.to(game.player1.socketID).emit("result", "Tie game");
          io.to(game.player2.socketID).emit("result", "Tie game");
          socketToGame.delete(game.player1.socketID!);
          socketToGame.delete(game.player2.socketID!);
          games.delete(game.gameID);
        }
      }
      io.sockets.in(String(gameID)).emit("receiveGameState", game);
    });

    socket.on("joinGameRoom", (data: joinGameInput) => {
      const newRoomID: number = Math.floor(Date.now() * Math.random());
      const roomIDString: string = data.roomID
        ? String(data.roomID)
        : String(newRoomID);

      // make sure players are restricted at 2
      if (io.sockets.adapter.rooms.get(roomIDString)?.size === 2) {
        return;
      }
      let gameID = Number(roomIDString);
      // Retrieve the game state or initialize it if it doesn't exist
      let game = games.get(gameID);

      if (!game) {
        game = new Game(gameID);
        games.set(gameID, game); // Save the game immediately after initialization
      }

      // Ensure the game object is correctly associated with the socket
      socketToGame.set(socket.id, game);

      // Set up the player socketID properly
      game.playerJoin(data.playerName, socket.id);

      console.log(`Player1 ID: ${game.player1.socketID}`);
      console.log(`Player2 ID: ${game.player2.socketID}`);

      socket.join(roomIDString);
      socket.emit("receiveRoomID", roomIDString);
    });

    socket.on("onPlayerReady", (gameID: number) => {
      // Wait for 2 players to start the game
      const room = io.sockets.adapter.rooms.get(String(gameID));
      if (room?.size === 2) {
        console.log("Start");
        io.sockets.in(String(gameID)).emit("startGameSession");
      }
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} left`);

      const game = socketToGame.get(socket.id);
      if (!game) {
        console.log("Did not find existing game when user exited");
        return;
      }
      socketToGame.delete(game.player1.socketID!);
      socketToGame.delete(game.player2.socketID!);
      games.delete(game.gameID);
      io.in(String(game.gameID)).socketsLeave(String(game.gameID));
      io.to(game.player1.socketID!).emit("endGame", "An user have left");
      io.to(game.player2.socketID!).emit("endGame", "An user have left");
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
