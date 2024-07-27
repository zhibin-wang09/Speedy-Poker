"use client";

import { useParams } from 'next/navigation';
import GameBoard from '../gameBoard';

export default function Home() {
  const params = useParams<{roomID: string}>();
    return(
      <GameBoard roomID={params.roomID}></GameBoard>
    )
}
