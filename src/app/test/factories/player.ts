import {Cards, createDeck, dealCards, Player, PlayerId} from '../../library/lib';
import {Factory} from 'fishery';
import {faker} from '@faker-js/faker';

export const playerFactory = Factory.define<Player>(() => {
    const deck = createDeck() as Cards;
    const hand = faker.helpers.arrayElements(dealCards(deck,4));
    const drawPile = faker.helpers.arrayElements(dealCards(deck,16));
    return {
        hand : hand,
        drawPile: drawPile,
        playerId: faker.helpers.enumValue(PlayerId),
    }
})