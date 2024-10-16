describe("配列に関するテスト", () => {
  it("配列に要素を追加できる", () => {
    const arr = [];
    arr.push("element");
    expect(arr).toEqual(["element"]);
  });

  it("配列の長さが正しい", () => {
    const arr = ["element1", "element2"];
    expect(arr.length).toBe(2);
  });

  describe("配列の検索に関するテスト", () => {
    it("配列の要素を検索できる", () => {
      const arr = ["element1", "element2"];
      expect(arr.indexOf("element2")).toBe(1);
    });
  });
});
