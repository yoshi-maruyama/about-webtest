import axios from "axios";
import Users from "./practice";

jest.mock("axios");
const mockAxios = jest.mocked(axios);

describe("Users", () => {
  beforeEach(() => {
    mockAxios.get.mockClear();
  });

  it("ユーザーを取得できる", async () => {
    const users = [{ name: "Taro" }, { name: "Hanako" }];
    const res = { data: users };
    mockAxios.get.mockResolvedValue(res);

    const result = await Users.all();
    expect(result).toEqual(users);
    expect(mockAxios.get).toHaveBeenCalledWith("/users.json");
  });
});
