"use client"

import Card from "./card"
import {Pile} from '../library/lib'
import { Card as TCard, Destination, Player} from "../library/lib"


interface HandProp{
    cards : Pile,
    useCard : (c : TCard, p: Player) => void,
    player: Player
}

export default function Hand({cards, useCard, player} : HandProp){

    return (
        <div>
            {cards.map(c => {return <Card key = {c} card={c} isFlipped={false} useCard={useCard} player = {player}/>})}
        </div>
    )
}