import { Meta, StoryObj } from "@storybook/react";
import Counter from "./Counter";
import { userEvent, within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";

const meta = {
  title: "Counter",
  component: Counter,
} as Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof Counter>;

export const Default: Story = {
  args: {
    initialCount: 1,
  },
};

export const Testing: Story = {
  args: {
    initialCount: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const incrementBtn = canvas.getByText("ー");
    await userEvent.click(incrementBtn);
    expect(canvas.getByRole("heading")).toHaveTextContent("-1");

    const decrementBtn = canvas.getByText("＋");
    await userEvent.click(decrementBtn);
    expect(canvas.getByRole("heading")).toHaveTextContent("0");
  },
};
