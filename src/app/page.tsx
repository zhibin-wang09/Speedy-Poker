"use client";

import { useEffect, useState } from "react";
import Hand from "./components/hand";
import Pile from "./components/pile";
import {
  Deck,
  createDeck,
  dealCards,
  Pile as TPile,
  Card,
  Destination,
  Player,
  dealCardToPlayer,
  pileAndHand,
  CARD_HOLDER,
} from "./library/lib";
import { Box } from "@chakra-ui/react";

export default function Home() {
  const [deck, setDeck] = useState<Deck>([]);
  const [P1hand, setP1hand] = useState<TPile>([]);
  const [P2hand, setP2hand] = useState<TPile>([]);
  const [P1DrawPile, setP1DrawPile] = useState<TPile>([]);
  const [P2DrawPile, setP2DrawPile] = useState<TPile>([]);
  const [centerPile1, setcenterPile1] = useState<TPile>([]);
  const [centerPile2, setcenterPile2] = useState<TPile>([]);
  const [centerDrawPile1, setcenterDrawPile1] = useState<TPile>([]);
  const [centerDrawPile2, setcenterDrawPile2] = useState<TPile>([]);

  /**
   * When the player placed a card we need to remove the card from their hand and place into the corresponding center pile
   * @param card the card that was used
   * @param player the player that used the card
   */
  function useCard(card: Card, player: Player) {
    if (player == Player.Player1) {
      let index: number = P1hand.indexOf(card);
      let targetCard: Card = P1hand[index];
      let newCard: Card = P1DrawPile.length > 0 ? P1DrawPile[0] : CARD_HOLDER;
      let copy = [...P1hand];
      copy[index] = newCard;
      setP1hand(copy);
      setcenterPile1([targetCard, ...centerDrawPile1]);
      if (P1DrawPile.length > 0) setP1DrawPile(P1DrawPile.slice(1));
    } else {
      let index: number = P2hand.indexOf(card);
      let targetCard: Card = P2hand[index];
      let newCard: Card = P2DrawPile.length > 0 ? P2DrawPile[0] : CARD_HOLDER;
      let copy = [...P2hand];
      copy[index] = newCard;
      setP2hand(copy);
      setcenterPile1([targetCard, ...centerDrawPile1]);
      if (P2DrawPile.length > 0) setP2DrawPile(P2DrawPile.slice(1));
    }
  }

  useEffect(() => {
    let temp_deck: Deck = createDeck();
    setP1hand(dealCards(temp_deck, 4));
    setP2hand(dealCards(temp_deck, 4));
    setP1DrawPile(dealCards(temp_deck, 16));
    setP2DrawPile(dealCards(temp_deck, 16));
    setcenterPile1(dealCards(temp_deck, 1));
    setcenterPile2(dealCards(temp_deck, 1));
    setcenterDrawPile1(dealCards(temp_deck, 5));
    setcenterDrawPile2(dealCards(temp_deck, 5));
    setDeck(temp_deck);
  }, []);

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
        <Hand cards={P1hand} useCard={useCard} player={Player.Player1}></Hand>
        <Pile Cards={P1DrawPile} isFlipped={true} />
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
        <Hand cards={P2hand} useCard={useCard} player={Player.Player2}></Hand>
        <Pile Cards={P2DrawPile} isFlipped={true} />
      </Box>
    </Box>
  );
}
