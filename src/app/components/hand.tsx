"use client";

import Card from "./card";
import { Pile } from "../library/lib";
import { Card as TCard, Destination, Player } from "../library/lib";
import { Box } from "@chakra-ui/react";

interface HandProp {
  cards: Pile;
  useCard: (c: TCard, p: Player) => void;
  player: Player;
}

export default function Hand({ cards, useCard, player }: HandProp) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      margin="30px"
    >
      {cards.map((c) => {
        if (c != -1) return (
          <Card
            key={c}
            card={c}
            isFlipped={false}
            useCard={useCard}
            player={player}
          />
        );
      })}
    </Box>
  );
}
