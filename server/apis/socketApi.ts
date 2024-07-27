import {
  Card,
  CARD_HOLDER,
  Deck,
  Destination,
  Game,
  Player,
  PlayerId,
  Validality,
} from "../../shared/types/types";
import { checkIsDead, createDeck, dealCards, validateMove } from "./cardApi";

export function initializeGameState(): Game {
  let player1: Player;
  let player2: Player;
  let game: Game;

  let deck: Deck = createDeck();
  player1 = new Player(dealCards(deck, 4), dealCards(deck, 16), 1);
  player2 = new Player(dealCards(deck, 4), dealCards(deck, 16), 2);
  game = new Game(
    player1,
    player2,
    dealCards(deck, 1),
    dealCards(deck, 1),
    dealCards(deck, 5),
    dealCards(deck, 5)
  );
  return game;
}

export function useCard(
  card: Card,
  player: Player,
  game: Game
): Game | undefined {
  if (game) {
    let index: number = player.hand.indexOf(card);
    let targetCard: Card = player.hand[index];
    let destination: Destination = Destination.CenterPile2;
    let result: Validality = validateMove(
      game.centerPile1[0],
      game.centerPile2[0],
      targetCard
    );
    if (result == Validality.CENTER1VALID) {
      destination = Destination.CenterPile1;
    } else if (result == Validality.INVALID) {
      return game;
    }
    let newCard: Card =
      player.drawPile.length > 0 ? player.drawPile[0] : CARD_HOLDER;
    let copy = [...player.hand];
    copy[index] = newCard;
    if (player.playerId == PlayerId.Player1) {
      game.player1.hand = copy;
      game.player1.drawPile =
        player.drawPile.length > 0 ? player.drawPile.slice(1) : player.drawPile;
    } else if (player.playerId == PlayerId.Player2) {
      game.player2.hand = copy;
      game.player2.drawPile =
        player.drawPile.length > 0 ? player.drawPile.slice(1) : player.drawPile;
    }

    if (destination == Destination.CenterPile1) {
      game.centerPile1 = [targetCard, ...game.centerPile1];
    } else {
      game.centerPile2 = [targetCard, ...game.centerPile2];
    }

    const canMove: boolean = checkIsDead(game, game.player1, game.player2);
    if (canMove) {
      return game;
    } else {
      console.log("Cant Move");
      let centerDrawPile1TopCard: Card = game.centerDrawPile1[0];
      let centerDrawPile2TopCard: Card = game.centerDrawPile2[0];
      // in case it's dead and there are no cards to refill from we will take from the center piles and redistribute the cards to the side
      if (
        game.centerDrawPile1.length == 0 ||
        game.centerDrawPile2.length == 0
      ) {
        game.centerDrawPile1 = [
          ...game.centerPile1.slice(0, 4),
          ...game.centerDrawPile1,
        ];
        game.centerDrawPile2 = [
          ...game.centerPile2.slice(0, 4),
          ...game.centerDrawPile2,
        ];
      }
      game.centerPile1 = [centerDrawPile1TopCard, ...game.centerPile1];
      game.centerPile2 = [centerDrawPile2TopCard, ...game.centerPile2];
      game.centerDrawPile1 = game.centerDrawPile1.slice(1);
      game.centerDrawPile2 = game.centerDrawPile2.slice(1);
    }
    return game;
  }
}
