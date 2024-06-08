"use client"

import {Card as TCard, getSuit, getFaceValue, FaceValue, Suit, Destination, Player} from '../library/lib';
import {motion} from 'framer-motion';

interface CardProp{
    card: TCard,
    isFlipped: boolean,
    useCard?: (c : TCard, p: Player) => void,
    player?: Player,
}

export default function Card({card, isFlipped, useCard, player}: CardProp){
    const isFace = !isFlipped && card !== undefined;
    const src = isFace ? createCardSVGPath(card!) : CARD_BACK_SVG_PATH;
    
    return (
            <motion.img
                initial={{ opacity: 0, scale: 0.5}}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                    if(player != null && useCard) useCard(card, player)
                }}
                src={src}
                className='size-40 inline'
                id={player == null ? "" : `player${player}-card${card}`}
            />
    )
}


const CARDS_PREFIX_PATH = "/cards/";
const CARD_BACK_SVG_PATH = `${CARDS_PREFIX_PATH}BACK.svg`;

function createCardSVGPath(card: TCard) {
  return (
    CARDS_PREFIX_PATH +
    SuitePathCompLUT[getSuit(card)] +
    "-" +
    RankPathCompLUT[getFaceValue(card)] +
    ".svg"
  );
}

const SuitePathCompLUT: Record<Suit, string> = {
  [Suit.Clubs]: "CLUB",
  [Suit.Diamonds]: "DIAMOND",
  [Suit.Hearts]: "HEART",
  [Suit.Spades]: "SPADE",
};

const RankPathCompLUT: Record<FaceValue, string> = {
  [FaceValue.Ace]: "1",
  [FaceValue.Two]: "2",
  [FaceValue.Three]: "3",
  [FaceValue.Four]: "4",
  [FaceValue.Five]: "5",
  [FaceValue.Six]: "6",
  [FaceValue.Seven]: "7",
  [FaceValue.Eight]: "8",
  [FaceValue.Nine]: "9",
  [FaceValue.Ten]: "10",
  [FaceValue.Jack]: "11-JACK",
  [FaceValue.Queen]: "12-QUEEN",
  [FaceValue.King]: "13-KING",
};