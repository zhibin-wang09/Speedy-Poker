import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import { initializeGameState, useCard } from "./Utils/socketApi";
import { Card, Game, Player } from "@/types/types";

const dev = process.env.NODE_ENV !== "production";
console.log(process.env.NODE_ENV);
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const games = new Map<number, Game>();
const socketToGame = new Map<string, Game>();

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
      game = useCard(card, player, game);
      if (!game) return;
      if (player.hand.length == 0) {
        io.to(player.socketID).emit("result", "You Won the Game!");
        let theOtherPlayer: Player =
          game.player1 == player ? game.player2 : game.player1;
        io.to(theOtherPlayer.socketID).emit("result", "You Lose the Game!");
      }

      io.sockets.in(String(gameID)).emit("receiveGameState", game);
    });

    socket.on("joinGameRoom", (roomID: number) => {
      const newRoomID: number = Math.floor(Date.now() * Math.random());
      const roomIDString: string = roomID ? String(roomID) : String(newRoomID);

      // make sure players are restricted at 2
      if (io.sockets.adapter.rooms.get(roomIDString)?.size === 2) {
        return;
      }

      socket.join(roomIDString);
      socket.emit("receiveRoomID", roomIDString);
    });

    socket.on("onPlayerReady", (gameID: number) => {
      let game = games.get(gameID);

      // create game if it does not already exist
      if (!game) {
        game = initializeGameState(gameID);
      }

      socketToGame.set(socket.id, game);

      // set up the player name by id so we can identify player using socket id
      game.playerJoin(socket.id);     
      // wait for 2 players to start game
      const room = io.sockets.adapter.rooms.get(String(gameID));
      if (room?.size == 2) {
        console.log("start");
        games.set(gameID, game);
        io.sockets.in(String(gameID)).emit("startGameSession");
      }
    });

    socket.on("disconnect", () => {
      console.log(`user ${socket.id} left`);

      const game = socketToGame.get(socket.id);
      if(!game){
        return;
      }
      console.log(game.player1, game.player2)
      socketToGame.delete(game.player1.socketID!);
      socketToGame.delete(game.player2.socketID!);
      games.delete(game.gameID);
      io.in(String(game.gameID)).socketsLeave(String(game.gameID));
      io.to(game.player1.socketID!).emit("endGame", "An user have left");
      io.to(game.player2.socketID!).emit("endGame", "An user have left");
      console.log(game.player1.socketID, game.player2.socketID);
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
