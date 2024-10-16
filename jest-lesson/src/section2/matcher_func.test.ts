// toBe

it("数値のテスト", () => {
  expect(2 + 2).toBe(4);
});

it("文字列のテスト", () => {
  expect("Jest").toBe("Jest");
});

it("booleanのテスト", () => {
  expect(true).toBe(true);
});

// toEqual

it("配列のテスト", () => {
  const arr1 = [1, 2, 3];
  const arr2 = [1, 2, 3];
  expect(arr1).toEqual(arr2);
});

it("オブジェクトのテスト", () => {
  const obj1 = { a: 1, b: 2 };
  const obj2 = { a: 1, b: 2 };
  expect(obj1).toEqual(obj2);
});

// not
// マッチャ関数の結果を反転させる

it("2 + 2は5ではない", () => {
  expect(2 + 2).not.toBe(5);
});
