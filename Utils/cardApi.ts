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
  } from "../src/types/types";
  
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
  
  /**
   * Used during a ongoing game to reset the center piles when ever a dead state occurs
   * @param game The ongoing game
   * @returns A game with center piles reshuffuled
   */
  export function shuffleUntilNotDead(game: Game): Game {
    let isDead: boolean = checkIsDead(game, game.player1, game.player2);
    while (isDead) {
      isDead = checkIsDead(game, game.player1, game.player2);
      console.log("Cant Move");
      let centerDrawPile1TopCard: Card = game.centerDrawPile1[0];
      let centerDrawPile2TopCard: Card = game.centerDrawPile2[0];
      // in case it's dead and there are no cards to refill from we will take from the center piles and redistribute the cards to the side
      if (game.centerDrawPile1.length == 0 || game.centerDrawPile2.length == 0) {
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
  
  /**
   * Initailize a game that is not dead. Used only when the game is initailized
   * @returns a game that does not have a dead state
   */
  export function initializeGameUntilNotDead(): Game{
    let game = createGame();
    while(checkIsDead(game,game.player1,game.player2)){
      game = createGame();
    }
    return game;
  }
  
  function createGame(): Game{
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
  