"use client";
import { useEffect, useState } from "react";
import Hand from "@/components/game/hand";
import Pile from "@/components/game/pile";
import { Pile as TPile, Card, Player, PlayerId, Game } from "@/types/types";
import { Box, Text } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { socket } from "@/socket";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const [centerPile1, setcenterPile1] = useState<TPile>([]);
  const [centerPile2, setcenterPile2] = useState<TPile>([]);
  const [centerDrawPile1, setcenterDrawPile1] = useState<TPile>([]);
  const [centerDrawPile2, setcenterDrawPile2] = useState<TPile>([]);
  const [player1, setPlayer1] = useState<Player>(
    new Player([], [], PlayerId.Default)
  );
  const [player2, setPlayer2] = useState<Player>(
    new Player([], [], PlayerId.Default)
  );
  const [roomID, setRoomID] = useState<string | undefined>();
  const param = useParams<{ roomID: string }>();
  const router = useRouter();

  useEffect(() => {
    socket.emit("getGameState", parseInt(roomID!));

    socket.on("receiveGameState", (response) => {
      const game: Game = response;
      if (game) {
        if (game.player1.socketID === socket.id) {
          setPlayer1(game.player1);
          setPlayer2(game.player2);
        } else {
          setPlayer1(game.player2);
          setPlayer2(game.player1);
        }
        setcenterDrawPile1(game.centerDrawPile1);
        setcenterDrawPile2(game.centerDrawPile2);
        setcenterPile1(game.centerPile1);
        setcenterPile2(game.centerPile2);
      }
    });

    socket.on("result", (response) => {
      toaster.create({
        description: response,
        duration: 6000,
      });
      setTimeout(() => {
        router.push("/");
      }, 5000);
    });

    socket.on("endGame", (response: string) => {
      toaster.create({
        description: response,
        duration: 5000,
      });
      setTimeout(() => {
        router.push("/");
      }, 5000);
    });

    return () => {
      socket.off("receiveGameState");
      socket.off("result");
      socket.off("endGame");
    };
  }, [roomID]);

  useEffect(() => {
    setRoomID(param.roomID);
  }, [param]);

  function playCard(card: Card, player: Player) {
    socket.emit("playCard", card, parseInt(roomID!), player);
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexDirection="column"
      backgroundColor="black"
      height="100svh"
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Hand
          cards={player1.hand}
          playCard={playCard}
          player={player1}
          isFlipped={true}
          disposition={"0%"}
        ></Hand>
        <Pile
          Cards={player1.drawPile}
          isFlipped={true}
          showNumberOfCardsInPile={true}
          disposition={"-70%"}
        />
      </Box>
      <Box>
        <Text>Score: {player1.point}</Text>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Pile
          Cards={centerDrawPile1}
          isFlipped={true}
          showNumberOfCardsInPile={false}
          disposition={"0%"}
        />
        <Pile
          Cards={centerPile1}
          isFlipped={false}
          showNumberOfCardsInPile={false}
          disposition={"0%"}
        />
        <Pile
          Cards={centerPile2}
          isFlipped={false}
          showNumberOfCardsInPile={false}
          disposition={"0%"}
        />
        <Pile
          Cards={centerDrawPile2}
          isFlipped={true}
          showNumberOfCardsInPile={false}
          disposition={"0%"}
        />
      </Box>
      <Box>
        <Text>Score: {player2.point}</Text>
      </Box>
      <Box display="flex" alignItems="center">
        <Hand
          cards={player2.hand}
          playCard={playCard}
          player={player2}
          isFlipped={false}
          disposition={"0%"}
        ></Hand>
        <Pile
          Cards={player2.drawPile}
          isFlipped={true}
          showNumberOfCardsInPile={true}
          disposition={"-70%"}
        />
      </Box>
      <Toaster />
    </Box>
  );
}
