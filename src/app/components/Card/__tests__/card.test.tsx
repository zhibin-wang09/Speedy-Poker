import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import Card from '../card'

describe('Card', () => {
    it('Renders a card', () => {
        render(<Card card={0} isFlipped={false} useCard={jest.fn()}/>);
    })
})