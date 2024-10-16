it("はじめてのmock関数", () => {
  const mockFunc = jest.fn(() => "Hello mock");
  expect(mockFunc()).toBe("Hello mock");
});

it("mockImplementation", () => {
  const mockFunc = jest.fn();
  // mockImplementation: 後から関数の結果を定義することができる
  mockFunc.mockImplementation(() => "Hello mock2");

  expect(mockFunc()).toBe("Hello mock2");
});
