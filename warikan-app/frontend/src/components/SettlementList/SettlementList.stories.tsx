import { Settlement } from "../../type";
import SettlementList from "./SettlementList";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "SettlementList",
  component: SettlementList,
} as Meta<typeof SettlementList>;

export default meta;

type Story = StoryObj<typeof SettlementList>;

const settlements: Settlement[] = [
  { from: "二郎", to: "一郎", amount: 1000 },
  { from: "三郎", to: "一郎", amount: 1000 },
];

export const Default: Story = {
  args: {
    settlements,
  },
};
