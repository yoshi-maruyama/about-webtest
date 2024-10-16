it("モック関数が呼び出される", () => {
  const mockFunc = jest.fn();
  mockFunc();
  // mockFuncが呼び出されたかを確認
  expect(mockFunc).toHaveBeenCalled();
});

it("モック関数が2回呼び出される", () => {
  const mockFunc = jest.fn();
  mockFunc();
  mockFunc();
  // mockFuncが何度呼び出されたかを確認
  expect(mockFunc).toHaveBeenCalledTimes(2);
});

it("モック関数に引数hogeが渡される", () => {
  const mockFunc = jest.fn();
  mockFunc("hoge");
  // mockFuncの引数がhogeであるか
  expect(mockFunc).toHaveBeenCalledWith("hoge");
});
