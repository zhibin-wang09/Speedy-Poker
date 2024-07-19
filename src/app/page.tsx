"use client";

import { useEffect, useState } from "react";
import Hand from "./components/Hand/hand";
import Pile from "./components/Pile/pile";
import {
  Deck,
  createDeck,
  dealCards,
  Pile as TPile,
  Card,
  Destination,
  Player,
  CARD_HOLDER,
  validateMove,
  Validality,
  PlayerId,
} from "./library/lib";
import { Box } from "@chakra-ui/react";
import dotenv from 'dotenv';
dotenv.config();
import openSocket from "./connection/socket";

export default function Home() {
  const [deck, setDeck] = useState<Deck>([]);
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
  const [isDead, setIsDead] = useState<boolean>(false); // this state tracks if there are any valid moves possible by two players

  // connection to the socket
  useEffect(() =>{
    openSocket(process.env.HOST_NAME, process.env.PORT);
  },[]);
  
  /**
   * When the player placed a card we need to remove the card from their hand and place into the corresponding center pile
   * @param card the card that was used
   * @param player the player that used the card
   */
  function useCard(card: Card, player: Player) {
    let index: number = player.hand.indexOf(card);
    let targetCard: Card = player.hand[index];
    let destination: Destination = Destination.CenterPile2;
    let result: Validality = validateMove(
      centerPile1[0],
      centerPile2[0],
      targetCard
    );
    if (result == Validality.CENTER1VALID) {
      destination = Destination.CenterPile1;
    } else if (result == Validality.INVALID) {
      return;
    }
    let newCard: Card =
      player.drawPile.length > 0 ? player.drawPile[0] : CARD_HOLDER;
    let copy = [...player.hand];
    copy[index] = newCard;
    if (player.playerId == PlayerId.Player1) {
      setPlayer1(
        new Player(
          copy,
          player.drawPile.length > 0
            ? player.drawPile.slice(1)
            : player.drawPile,
          player.playerId
        )
      );
    } else if (player.playerId == PlayerId.Player2) {
      setPlayer2(
        new Player(
          copy,
          player.drawPile.length > 0
            ? player.drawPile.slice(1)
            : player.drawPile,
          player.playerId
        )
      );
    }

    if (destination == Destination.CenterPile1) {
      setcenterPile1([targetCard, ...centerDrawPile1]);
    } else {
      setcenterPile2([targetCard, ...centerDrawPile2]);
    }
  }

  useEffect(() => {
    let canMove: boolean = false;
    player1.hand.forEach((c) => {
      if(validateMove(centerPile1[0],centerPile2[0],c) != Validality.INVALID) canMove = true;
    })
    player2.hand.forEach((c) => {
      if(validateMove(centerPile1[0],centerPile2[0],c) != Validality.INVALID) canMove = true;
    })
    if(!canMove) setIsDead(true);
    else setIsDead(false);    
  },[centerPile1,centerPile2])

  useEffect(() => {
    if(isDead){
      let centerDrawPile1TopCard : Card = centerDrawPile1[0];
      let centerDrawPile2TopCard : Card = centerDrawPile2[0];
      // in case it's dead and there are no cards to refill from we will take from the center piles and redistribute the cards to the side
      if(centerDrawPile1.length == 0 || centerDrawPile2.length == 0){
        setcenterDrawPile1([...centerPile1.slice(0,4),...centerDrawPile1])
        setcenterDrawPile2([...centerPile2.slice(0,4),...centerDrawPile2])
      }
      setcenterPile1([centerDrawPile1TopCard,...centerPile1]);
      setcenterPile2([centerDrawPile2TopCard,...centerPile2]);
      setcenterDrawPile1(centerDrawPile1.slice(1));
      setcenterDrawPile2(centerDrawPile2.slice(1));
    }
  },[isDead])

  useEffect(() => {
    let temp_deck: Deck = createDeck();
    setPlayer1(
      new Player(
        dealCards(temp_deck, 4),
        dealCards(temp_deck, 16),
        PlayerId.Player1
      )
    );
    setPlayer2(
      new Player(
        dealCards(temp_deck, 4),
        dealCards(temp_deck, 16),
        PlayerId.Player2
      )
    );
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
