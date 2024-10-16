import { ShoppingList } from "./practice";

describe("ShoppingListのテスト", () => {
  it("アイテムをリストに追加できる", () => {
    const shoppingList = new ShoppingList();
    shoppingList.addItem("apple");
    expect(shoppingList.list).toEqual(["apple"]);
  });

  it("アイテムをリストから削除できる", () => {
    const shoppingList = new ShoppingList();
    shoppingList.list = ["apple", "banana"];
    shoppingList.removeItem("apple");
    expect(shoppingList.list).toEqual(["banana"]);
  });

  it("存在しないアイテムの削除を試みたときにエラーをスローする", () => {
    const shoppingList = new ShoppingList();
    shoppingList.list = ["apple", "banana"];
    expect(() => shoppingList.removeItem("grape")).toThrow(
      "アイテム: grape は存在しません"
    );
  });
});

describe("ShoppingList 解答", () => {
  let shoppingList: ShoppingList;
  beforeEach(() => {
    shoppingList = new ShoppingList();
  });

  describe("addItem", () => {
    it("アイテムをリストに追加できる", () => {
      shoppingList.addItem("apple");
      expect(shoppingList.list).toEqual(["apple"]);
    });
  });

  describe("removeItem", () => {
    it("アイテムをリストから削除できる", () => {
      shoppingList.addItem("apple");
      shoppingList.removeItem("apple");
      // toContain: 配列に要素が存在するかを確認するマッチャ
      expect(shoppingList.list).not.toContain("apple");
    });

    it("存在しないアイテムの削除を試みたときにエラーをスローする", () => {
      expect(() => shoppingList.removeItem("grape")).toThrow(
        "アイテム: grape は存在しません"
      );
    });
  });
});
