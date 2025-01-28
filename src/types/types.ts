import { createDeck, dealCards, getFaceValue } from "../../Utils/cardApi";

export enum Suit {
  Diamonds,
  Clubs,
  Hearts,
  Spades,
}

export enum FaceValue {
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Ace,
}

export enum Destination {
  P1hand,
  P2hand,
  P1DrawPile,
  P2DrawPile,
  CenterPile1,
  CenterPile2,
  centerDrawPile1,
  centerDrawPile2,
}

export enum PlayerId {
  Default,
  Player1,
  Player2,
}

export const CARD_HOLDER = -1;
export type Card = number;
export const SUIT_BIN_WIDTH = 2; // two bits used to store information about the suite of a card because there are only 4 suites so 00, 01, 10, 11
export type Cards = Card[];
export type Deck = Cards;
export type Pile = Cards;

export class Player {
  hand: Cards = [];
  drawPile: Pile = [];
  playerID: PlayerId = PlayerId.Default;
  socketID: string;
  name: string;

  constructor(hand: Cards, drawPile: Pile, playerID: PlayerId) {
    this.hand = hand;
    this.drawPile = drawPile;
    this.playerID = playerID;
    this.name = "";
    this.socketID = "";
  }

  setName(name: string) {
    this.name = name;
  }
}

export class Game {
  gameID: number;
  player1: Player = new Player([], [], 1);
  player2: Player = new Player([], [], 2);
  centerPile1: Pile = [];
  centerPile2: Pile = [];
  centerDrawPile1: Pile = [];
  centerDrawPile2: Pile = [];

  constructor(gameID: number) {
    while (this.checkIsDead()) {
      let player1: Player;
      let player2: Player;

      let deck: Deck = createDeck();
      player1 = new Player(dealCards(deck, 4), dealCards(deck, 16), 1);
      player2 = new Player(dealCards(deck, 4), dealCards(deck, 16), 2);
      this.player1 = player1;
      this.player2 = player2;
      this.centerPile1 = dealCards(deck, 1);
      this.centerPile2 = dealCards(deck, 1);
      this.centerDrawPile1 = dealCards(deck, 5);
      this.centerDrawPile2 = dealCards(deck, 5);
    }

    this.gameID = gameID;
  }

  useCard(card: Card, player: Player): Game | undefined {
      let index: number = player.hand.indexOf(card);
      let targetCard: Card = player.hand[index];
      let destination: Destination = Destination.CenterPile2;
      let result: Validality = this.validateMove(
        this.centerPile1[0],
        this.centerPile2[0],
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
      if (player.playerID == PlayerId.Player1) {
        this.player1.hand = copy;
        this.player1.drawPile =
          player.drawPile.length > 0
            ? player.drawPile.slice(1)
            : player.drawPile;
      } else if (player.playerID == PlayerId.Player2) {
        this.player2.hand = copy;
        this.player2.drawPile =
          player.drawPile.length > 0
            ? player.drawPile.slice(1)
            : player.drawPile;
      }

      if (destination == Destination.CenterPile1) {
        this.centerPile1 = [targetCard, ...this.centerPile1];
      } else {
        this.centerPile2 = [targetCard, ...this.centerPile2];
      }

      this.shuffleUntilNotDead();
  }

  shuffleUntilNotDead() {
    let isDead: boolean = this.checkIsDead();
    while (isDead) {
      isDead = this.checkIsDead();
      console.log("Cant Move");
      let centerDrawPile1TopCard: Card = this.centerDrawPile1[0];
      let centerDrawPile2TopCard: Card = this.centerDrawPile2[0];
      // in case it's dead and there are no cards to refill from we will take from the center piles and redistribute the cards to the side
      if (
        this.centerDrawPile1.length == 0 ||
        this.centerDrawPile2.length == 0
      ) {
        this.centerDrawPile1 = [
          ...this.centerPile1.slice(0, 4),
          ...this.centerDrawPile1,
        ];
        this.centerDrawPile2 = [
          ...this.centerPile2.slice(0, 4),
          ...this.centerDrawPile2,
        ];
      }
      this.centerPile1 = [centerDrawPile1TopCard, ...this.centerPile1];
      this.centerPile2 = [centerDrawPile2TopCard, ...this.centerPile2];
      this.centerDrawPile1 = this.centerDrawPile1.slice(1);
      this.centerDrawPile2 = this.centerDrawPile2.slice(1);
    }
  }

  playerJoin(playerName: string, socketID: string) {
    if (!this.player1.socketID) {
      this.player1.socketID = socketID;
      this.player1.name = playerName;
    } else if (!this.player2.socketID && this.player1.socketID !== socketID) {
      this.player2.socketID = socketID;
      this.player2.name = playerName;
    }
  }

  checkIsDead() {
    let canMove: boolean = false;
    this.player1.hand.forEach((c: Card) => {
      if (
        this.validateMove(this.centerPile1[0], this.centerPile2[0], c) !=
        Validality.INVALID
      )
        canMove = true;
    });
    this.player2.hand.forEach((c: Card) => {
      if (
        this.validateMove(this.centerPile1[0], this.centerPile2[0], c) !=
        Validality.INVALID
      )
        canMove = true;
    });
    return !canMove;
  }

  validateMove(
    centerPile1TopCard: Card,
    centerPile2TopCard: Card,
    card: Card
  ): Validality {
    const twoAndAceDiff = Object.keys(FaceValue).length / 2 - 1; // the difference between card "2" and "ace" is 12 defined by the FaceValue enum
    if (Math.abs(getFaceValue(centerPile1TopCard) - getFaceValue(card)) == 1) {
      return Validality.CENTER1VALID;
    } else if (
      Math.abs(getFaceValue(centerPile2TopCard) - getFaceValue(card)) == 1
    ) {
      return Validality.CENTER2VALID;
    } else if (
      Math.abs(getFaceValue(centerPile1TopCard) - getFaceValue(card)) ==
      twoAndAceDiff
    ) {
      return Validality.CENTER1VALID;
    } else if (
      Math.abs(getFaceValue(centerPile2TopCard) - getFaceValue(card)) ==
      twoAndAceDiff
    ) {
      return Validality.CENTER2VALID;
    } else {
      return Validality.INVALID;
    }
  }
}

export type pileAndHand = {
  pile: Pile;
  hand: Cards;
};

export enum Validality {
  CENTER1VALID,
  CENTER2VALID,
  INVALID,
}
