export enum Suit{ 
    Diamond,
    Clubs,
    Heart,
    Spade
}

export enum FaceValue{
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
    Ace
}

export type Card = number;
export const SUIT_BIN_WIDTH = 2; // two bits used to store information about the suite of a card because there are only 4 suites so 00, 01, 10, 11

export function createCard(suit : Suit, faceValue : FaceValue): Card{
    return (faceValue << SUIT_BIN_WIDTH) | suit;
}

export function getSuit(card : Card): Suit{
    return mask(SUIT_BIN_WIDTH) & card;
}

function mask(n: number): number{
    return (1 << n )-1; // create a mask of 00111.11 depend on the position of bits shifted
}

export function getFaceValue(card: Card): FaceValue{
    return card >> SUIT_BIN_WIDTH;
}

