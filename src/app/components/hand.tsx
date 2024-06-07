import Card from "./card"
import {Pile} from '../library/lib'

interface HandProp{
    Cards : Pile
}

export default function Hand({Cards} : HandProp){

    return (
        <div>
            {Cards.map(c => {return <Card key = {c} card={c} isFlipped={false}/>})}
        </div>
    )
}