// toThrow
// 関数がエラーを投げることを確認する

import { divide, hogehoge, ZeroDivisorError } from "./divide";

it("0で割るとエラーが投げられる", () => {
  expect(hogehoge).toThrow(ZeroDivisorError);

  // 引数ありきの関数のテストは関数を直接expectに入れるのではなく、無名関数をラップして渡す
  expect(() => divide(10, 0)).toThrow();
  expect(() => divide(10, 0)).toThrow("0で割ることはできません");
  expect(() => divide(10, 0)).toThrow(ZeroDivisorError);
});
