# TypeScript で始める Web アプリケーションテスト入門

## はじめに

### テストの重要性

ウォータフォール型の開発からアジャイル開発になった

スプリントの中で機能を実装し、リリースするようになったことで
既存の機能を破壊してしまっていないかをテストによって確認することができる

品質の保証、リリースのスピード、開発者の安心感が確保される

### テストの種類とテスト戦略

ユニットテスト
→ 基本的なテスト
→ 関数やメソッドなどの単位での動作を検証する
→ 速度は速い
→ 全体の動作は検証できない

統合テスト
→ 複数のユニットが連携して正しく動作するかを検証する
→ セットアップやデータの準備が複雑になることがある

E2E テスト
→ アプリケーション全体をブラウザで動作させ、ユーザーの操作を模倣する
→ 実際のユーザーの導線を再現でき、全体の動作を検証できる
→ 実行時間が長く、セットアップも複雑になる

テスト戦略
→ プロジェクトの規模や状況に応じて最適なテスト実施の方向性を決めること

戦略の取り方として

テストピラミッド：

ユニットテスト　 → インテグレーションテスト　 → E2E テスト
の順にテストの数を減らしていく

実行速度が速いユニットテストは多めに。実行速度の遅くコストの高い E2E は最小限にする

テスティングトロフィー：

静的解析（linter のこと）を導入する
インテグレーションテストが一番バグ発見しやすいでしょということでこれを一番多くする

### Jest と基本的なテスト

Meta 社が開発したテストライブラリ

javascript や typescript で書かれたコードであればほぼテストができる

セットアップが簡単

テスト同士が独立していて高速

メリット：
機能が充実
高速
モック機能が豊富
ドキュメントが豊富

デメリット：
学習コストはそれなりに高い
実際のブラウザ上でのテストは d けいない
後発のフレームワークが出つつあるよ

Mocha, Jasmine などが他の選択肢があるよ

### Jest のインストールと設定

```
npm init -y
npm i -D typescript
npx tsc --init

npm i -D jest @types/jest ts-jest
npx ts-jest config:init
```

test.ts のように test が拡張子になっているものがテストファイルと認識される

成功

```
❯ npm test

> jest-lesson@1.0.0 test
> jest

 PASS  src/section2/sum.test.ts
  ✓ 1と2を足すと3になる (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.969 s
Ran all test suites.
```

失敗

```
❯ npm test

> jest-lesson@1.0.0 test
> jest

 FAIL  src/section2/sum.test.ts
  ✕ 1と2を足すと3になる (2 ms)

  ● 1と2を足すと3になる

    expect(received).toBe(expected) // Object.is equality

    Expected: 4
    Received: 3

      2 |
      3 | it("1と2を足すと3になる", () => {
    > 4 |   expect(sum(1, 2)).toBe(4);
        |                     ^
      5 | });
      6 |

      at Object.<anonymous> (src/section2/sum.test.ts:4:21)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        0.989 s, estimated 1 s
Ran all test suites.
```

### 基本的なマッチャ関数

toBe

javascript の object.is が行われる。
テストの結果と期待値が全く同じであるかを検証する

toEqual
配列やオブジェクト同士の同一性を確認する
配列やオブジェクトに対して toBe をやると中身が一緒でも違うものとして判定されてしまうので、そのときは Equal を使う

テスト実行するファイルの指定ができる

```
npm test src/section2/matcher_func.test.ts
```

### 例外処理のテスト

```ts
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
```

### 非同期関数のテスト

そのまま書くと、非同期処理の結果がでる前にテストが行われ、テストが終了してしまう。

なので、非同期処理の場合はテストが非同期の結果を待つようにコントロールする必要がある

```ts
import { delay } from "./async_func";

it("delayが指定された時間後にメッセージを返す", async () => {
  const result = await delay("Hello Jest", 1000);
  expect(result).toBe("Hello Jest");
});

it("timeが負の場合はエラーが発生する", async () => {
  try {
    await delay("Hello Jest", -1000);
  } catch (e: any) {
    expect(e.message).toEqual("timeは0以上で指定してください");
  }
});
```

### テストのグループ化

テストケースが増えると管理のしやすさのためにグループ化しておくとよい

describe でグループ化する

describe の中に describe を入れることができる

```ts
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
```

### テストの前後処理

セットアップ・クリーンアップ

```
// beforeEach: 各テスト（it）の前に実行される
// afterEach: 各テスト（it）の後に実行される

// beforeAll: グループ内のすべてのテストの前に1度だけ実行される
// afterAll: グループ内のすべてのテストの後に1度だけ実行される
```

inner の it には outer の each が適用されるよ

### パラメタライズドテスト

一連の入力データとその予想結果を使って同じテストロジックを複数回実行するテストのこと

jest では it.each``が一般的

```ts
it.each`
  a    | b     | expected
  ${1} | ${2}  | ${3}
  ${1} | ${-2} | ${-1}
  ${3} | ${4}  | ${7}
`("$aと$bを足すと$expectedになる", ({ a, b, expected }) => {
  expect(sum(a, b)).toBe(expected);
});
```

### jest を使った基本的なテスト

```ts
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
```

## jest を使ったモックテスト

### モックの概要

実際のオブジェクトや機能を模倣したもの

外部の API とか

外部の依存要因を排除する

特定のシナリオをシュミレート

テストの速度向上

似た概念のスパイ

既存の関数やメソッドの呼び出しを監視する

関数やメソッドがいつ何回呼び出されたかを知ることができる

モックとの最大の違いは、スパイは実際の振る舞いを置き換えない（※置き換えることもできるけど）

### jest によるモック関数の作成

### モック関数の戻り値の設定

```ts
it("モック関数に戻り値を設定する", () => {
  const mockFunc = jest.fn();
  mockFunc.mockReturnValue("Mock return value");
  expect(mockFunc()).toBe("Mock return value");
});

it("モック関数一度だけ返される戻り値を設定する", () => {
  const mockFunc = jest.fn();
  mockFunc.mockReturnValueOnce("Mock return value");
  expect(mockFunc()).toBe("Mock return value");
  // 2回目はundefined
  expect(mockFunc()).toBe(undefined);
});

it("モック関数に非同期な戻り値を設定する", async () => {
  const mockFunc = jest.fn();
  mockFunc.mockResolvedValue("Resolved value");
  const result = await mockFunc();
  expect(result).toBe("Resolved value");
});
```

### モック関数の呼び出しの検証

API 呼び出しやデータベースへの書き込みなど、副作用を含むテストはユニットテストではモックされる

### spyOn を使用した関数のモック化

```ts
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
```

### モジュール全体のモック化

モック化は describe や it の中ではなく、その外で行う

```ts
import fs from "fs";
import { readFile } from "./mock_module";

// この時点でfsっていう存在自体がすでにmock化されている
jest.mock("fs");

// だけど、コンパイラはそれを知ることができないのでそのままだとmockReturnValueにfs.readSyncから呼び出せることを知らない。
// そこで、mockFsを作成してそこからmockReturnValueを読んでreadFileSyncのレスポンスをモックする
const mockFs = jest.mocked(fs);
mockFs.readFileSync.mockReturnValue("dummy data");

it("readFileがデータを返却する", () => {
  const result = readFile("path/dummy");
  expect(result).toBe("dummy data");
  expect(fs.readFileSync).toHaveBeenCalledTimes(1);
});
```

### 演習

```ts
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
```
