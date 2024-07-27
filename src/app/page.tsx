"use client";

import dotenv from 'dotenv';
dotenv.config();
import { useEffect, useState } from "react";
import Hand from "./components/Hand/hand";
import Pile from "./components/Pile/pile";
import {
  Deck,
  Pile as TPile,
  Card,
  Player,
  PlayerId,
  Game,
} from "../../shared/types/types"
import { Box } from "@chakra-ui/react";
import socket from "./connection/socket";

export default function Home() {
  const [centerPile1, setcenterPile1] = useState<TPile>([]);
  const [centerPile2, setcenterPile2] = useState<TPile>([]);
  const [centerDrawPile1, setcenterDrawPile1] = useState<TPile>([]);
  const [centerDrawPile2, setcenterDrawPile2] = useState<TPile>([]);
  const [player1, setPlayer1] = useState<Player>({
    hand: [],
    drawPile: [],
    playerId: PlayerId.Default,
  });
  const [player2, setPlayer2] = useState<Player>({
    hand: [],
    drawPile: [],
    playerId: PlayerId.Default,
  });
  const [roomID, setRoomID] = useState<number>(0);

  useEffect(() =>{
    socket.emit("initializeGameState", {gameID: roomID});
    socket.emit("test")

    socket.on("sendGameState", (response) => {
      const game: Game = response;
      setPlayer1(game.player1);
      setPlayer2(game.player2);
      setcenterDrawPile1(game.centerDrawPile1);
      setcenterDrawPile2(game.centerDrawPile2);
      setcenterPile1(game.centerPile1);
      setcenterPile2(game.centerPile2);
    })

    return () => {
      socket.off('sendGameState');
    }
  },[roomID]);

  function useCard(card: Card, player: Player) {
    socket.emit("useCard", card, 0, player);
  }

  
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="column"
      backgroundColor="#35654D"
      position="fixed"
      height="100%"
      width="100%"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="30px"
      >
        <Hand cards={player1.hand} useCard={useCard} player={player1}></Hand>
        <Pile Cards={player1.drawPile} isFlipped={true} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="30px"
      >
        <Pile Cards={centerDrawPile1} isFlipped={true} />
        <Pile Cards={centerPile1} isFlipped={false} />
        <Pile Cards={centerPile2} isFlipped={false} />
        <Pile Cards={centerDrawPile2} isFlipped={true} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        margin="30px"
      >
        <Hand cards={player2.hand} useCard={useCard} player={player2}></Hand>
        <Pile Cards={player2.drawPile} isFlipped={true} />
      </Box>
    </Box>
  );
}
