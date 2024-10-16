import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("buttonタグがレンダリングされる", () => {
    render(<Button label="button" onClick={() => alert("click")} />);

    const element = screen.getByRole("button");
    // buttonのdomが画面にあること
    expect(element).toBeInTheDocument();
    // buttonの中にbuttonの文字があること
    expect(element).toHaveTextContent("button");
  });
});
