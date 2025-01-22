import {
    Card,
    CARD_HOLDER,
    Deck,
    Destination,
    Game,
    Player,
    PlayerId,
    Validality,
  } from "../src/types/types";
  import {
    initializeGameUntilNotDead,
    shuffleUntilNotDead,
    validateMove,
  } from "./cardApi";
  
  export function initializeGameState(): Game {
    let game = initializeGameUntilNotDead();
  
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
  
      game = shuffleUntilNotDead(game);
      return game;
    }
  }
  