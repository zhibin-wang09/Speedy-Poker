import {
  Card,
  Cards,
  Deck,
  FaceValue,
  Game,
  Pile,
  pileAndHand,
  Suit,
  SUIT_BIN_WIDTH,
  Validality,
  Player,
} from "../../shared/types/types";

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

export function dealCardToPlayer(deck: Deck, hand: Cards): pileAndHand {
  let res: pileAndHand = { pile: [], hand: [] };
  let card: Card = deck[0];
  res.hand = [card, ...hand];
  res.pile = deck.filter((c) => c != card);
  return res;
}

export function validateMove(
  centerPile1TopCard: Card,
  centerPile2TopCard: Card,
  card: Card
): Validality {
  if (Math.abs(getFaceValue(centerPile1TopCard) - getFaceValue(card)) == 1) {
    return Validality.CENTER1VALID;
  } else if (
    Math.abs(getFaceValue(centerPile2TopCard) - getFaceValue(card)) == 1
  ) {
    return Validality.CENTER2VALID;
  } else {
    return Validality.INVALID;
  }
}

export function checkIsDead(game: Game, player1: Player, player2: Player) {
  let canMove: boolean = false;
  player1.hand.forEach((c: Card) => {
    if (
      validateMove(game.centerPile1[0], game.centerPile2[0], c) !=
      Validality.INVALID
    )
      canMove = true;
  });
  player2.hand.forEach((c: Card) => {
    if (
      validateMove(game.centerPile1[0], game.centerPile2[0], c) !=
      Validality.INVALID
    )
      canMove = true;
  });
  return !canMove;
}
