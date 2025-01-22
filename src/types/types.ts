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
  playerId: PlayerId = PlayerId.Default;
  name: string;
  isReady: boolean;

  constructor(hand: Cards, drawPile: Pile, playerId: PlayerId) {
    this.hand = hand;
    this.drawPile = drawPile;
    this.playerId = playerId;
    this.name = "";
    this.isReady = false;
  }

  setName(name: string) {
    this.name = name;
  }

  setIsReady(isReady: boolean) {
    this.isReady = isReady;
  }
}

export class Game {
  player1: Player = new Player([], [], 1);
  player2: Player = new Player([], [], 2);
  centerPile1: Pile = [];
  centerPile2: Pile = [];
  centerDrawPile1: Pile = [];
  centerDrawPile2: Pile = [];

  constructor(
    player1: Player,
    player2: Player,
    centerPile1: Pile,
    centerPile2: Pile,
    centerDrawPile1: Pile,
    centerDrawPile2: Pile
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.centerPile1 = centerPile1;
    this.centerPile2 = centerPile2;
    this.centerDrawPile1 = centerDrawPile1;
    this.centerDrawPile2 = centerDrawPile2;
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
