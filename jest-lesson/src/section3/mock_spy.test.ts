import { Calculator } from "./mock_spy";

it("sumメソッドが呼び出される", () => {
  const calculator = new Calculator();
  const sumSpy = jest.spyOn(calculator, "sum");
  const result = calculator.sum(1, 2);

  expect(result).toBe(3);

  // 実際に実行されているのはcalculatorだけど、sumspyはその実行を見ている
  expect(sumSpy).toHaveBeenCalledTimes(1);
  expect(sumSpy).toHaveBeenCalledWith(1, 2);

  // テスト終了後はスパイが他のテストに影響しないように解除することが推奨される。afterEachでやるのがいい手になる
  sumSpy.mockRestore();
});
