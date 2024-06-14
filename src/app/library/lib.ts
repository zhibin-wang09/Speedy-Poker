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

export enum Player {
  Player1,
  Player2,
}

export const CARD_HOLDER = -1;

export type Card = number;
export const SUIT_BIN_WIDTH = 2; // two bits used to store information about the suite of a card because there are only 4 suites so 00, 01, 10, 11

export function createCard(suit: Suit, faceValue: FaceValue): Card {
  return (faceValue << SUIT_BIN_WIDTH) | suit;
}

export function getSuit(card: Card): Suit {
  return mask(SUIT_BIN_WIDTH) & card;
}

function mask(n: number): number {
  return (1 << n) - 1; // create a mask of 00111.11 depend on the position of bits shifted
}

export function getFaceValue(card: Card): FaceValue {
  return card >> SUIT_BIN_WIDTH;
}

export type Cards = Card[];
export type Deck = Cards;
export type Pile = Cards;

export function createSuits(): Suit[] {
  return [Suit.Diamonds, Suit.Clubs, Suit.Hearts, Suit.Spades];
}

export function createFaceValues(): FaceValue[] {
  return [
    FaceValue.Two,
    FaceValue.Three,
    FaceValue.Four,
    FaceValue.Five,
    FaceValue.Six,
    FaceValue.Seven,
    FaceValue.Eight,
    FaceValue.Nine,
    FaceValue.Ten,
    FaceValue.Jack,
    FaceValue.Queen,
    FaceValue.King,
    FaceValue.Ace,
  ];
}

export function createDeck(): Deck {
  let deck: Deck = createSuits().flatMap((s) =>
    createFaceValues().flatMap((f) => createCard(s, f))
  );
  shuffle(deck);
  return deck; // just a way to create an array of cards using nested flatmap to simulate nested loops
}

export function dealCards(deck: Deck, numberOfCards: number): Pile {
  return deck.splice(0, numberOfCards);
}

function shuffle(deck: Deck): void {
  let currentIndex = deck.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [deck[currentIndex], deck[randomIndex]] = [
      deck[randomIndex],
      deck[currentIndex],
    ];
  }
}

export type pileAndHand = {
  pile: Pile;
  hand: Cards;
};

export function dealCardToPlayer(deck: Deck, hand: Cards): pileAndHand {
  let res: pileAndHand = { pile: [], hand: [] };
  let card: Card = deck[0];
  res.hand = [card, ...hand];
  res.pile = deck.filter((c) => c != card);
  return res;
}
