import { render, screen, waitFor } from "@testing-library/react";
import { UserSearch } from "./UserSearch";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const user = userEvent.setup();
jest.mock("axios");
const mockAxios = jest.mocked(axios);

describe("UserSearch", () => {
  beforeEach(() => {
    // テストの中でaxiosのgetの戻り値を変更するので、それが他のテストに影響しないようにクリアしている
    mockAxios.get.mockReset();
  });

  it("入力したフォームに入力した内容でAPIリクエストが送信される", async () => {
    const userInfo = {
      id: 1,
      name: "Taro",
    };
    const resp = { data: userInfo };
    mockAxios.get.mockResolvedValue(resp);

    render(<UserSearch />);

    const input = screen.getByRole("textbox");
    await user.type(input, userInfo.name);
    const button = screen.getByRole("button");
    await user.click(button);

    expect(mockAxios.get).toHaveBeenCalledWith(
      `/api/users?query=${userInfo.name}`
    );
  });

  it("APIから取得したユーザー情報が画面に表示される", async () => {
    const userInfo = {
      id: 1,
      name: "Taro",
    };
    const resp = { data: userInfo };
    mockAxios.get.mockResolvedValue(resp);

    render(<UserSearch />);

    const input = screen.getByRole("textbox");
    await user.type(input, userInfo.name);
    const button = screen.getByRole("button");
    await user.click(button);

    waitFor(() => {
      expect(screen.getByText(userInfo.name)).toBeInTheDocument();
    });
  });
});
