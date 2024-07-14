import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import Card from "@/app/components/Card/card";
import { playerFactory } from "@/app/test/factories/player";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Card", () => {
  const cardNum: number = 46;
  const isFlipped: boolean = false;
  const useCard: () => {} = jest.fn();
  const player = playerFactory.build();

  it("Renders a card", async () => {
    render(<Card card={cardNum} isFlipped={isFlipped} useCard={useCard} />);
    await screen.findByTestId(`card-${cardNum}-div`);
  });

  it("Using a card", async () => {
    render(<Card card={cardNum} isFlipped={isFlipped} useCard={useCard} player={player} />);
    const user = userEvent.setup();
    const card = await screen.findByTestId(`card-${cardNum}`);
    await user.click(card);
    expect(useCard).toHaveBeenCalled();
  });
});
