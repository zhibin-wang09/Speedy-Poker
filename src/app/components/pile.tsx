import {Pile as cPile} from '../library/lib';
import Card from './card';

interface PileProp{
    Cards: cPile,
    isFlipped: boolean
}

export default function Pile({Cards, isFlipped} : PileProp){
    return (
        <div>
            <Card key = {Cards[0]} card={Cards[0]} isFlipped={isFlipped}/>
        </div>
    )
}