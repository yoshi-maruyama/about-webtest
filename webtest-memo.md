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
    // テストの中でaxiosのgetの戻り値を変更するので、それが他のテストに影響しないようにクリアしている
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

## UI テスト

### UI テストの概要

ロジックに関するテストもあるけど、

主に見た目やユーザーの操作感にフォーカスしたテストを行う

検証内容：

コンポーネントが意図通りのデザインになっているか

ボタンクリックしたり入力したときのアプリケーションの反応が正しいか

コンポーネントが生成されてから終了するまでが予想通りか（状態変数の変化とか）

props が正確な伝達になっているか

テストの種類

ユニットテスト
→ 個々のコンポーネントや react のフックが期待通りか

スナップショットテスト
→ コンポーネントのレンダリング結果に意図しない変更がないかを検証(jest, react testing library)

ビジュアルリグレッションテスト
→ 画面に表示された UI のスクリーンショットに意図しない変更がないかを検証（storybook, chromatic）

E2E テスト
→ アプリケーション全体をブラウザ上で動作させ、ユーザーの操作をシュミレートして検証(playwright)

### react 環境のセットアップ

```
npm create vite @latest

cd ui-test-lesson

npm run dev
```

### React testing library

jest だけだと機能が不足しているのでこのライブラリも入れる。

react testing library とはいうけど、vue や angular でも使えるよ

```
npm i -D jest @types/jest ts-jest
npm i -D jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

npx ts-jest config:init
```

### React testing library のセットアップ

jest.setup.ts
jest.config.js
tsconfig.app.json
とかにいろいろ設定を入れていくよ

### react testing library の基礎

```ts
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button", () => {
  it("buttonタグがレンダリングされる", () => {
    render(<Button label="button" onClick={() => alert("click")} />);

    const element = screen.getByRole("button");
    // buttonのdomが画面にあること
    expect(element).toBeInTheDocument();
    // buttonの中にbuttonの文字があること
    expect(element).toHaveTextContent("button");
  });
});
```

### ユーザーイベントのテスト

userEvent.setup()からイベント操作するためのインスタンスを作成

user.click や type は非同期処理なので注意してね

```ts
const user = userEvent.setup();

it("入力したテキストがサブミットされる", async () => {
  // alertを確認するにはspyを使うと便利
  const alertSpy = jest.spyOn(window, "alert").mockReturnValue();

  render(<Form />);
  const input = screen.getByPlaceholderText("Enter text");
  await user.type(input, "Test Text");
  // getByDisplayValue: 指定の文字がある要素を取得する
  expect(screen.getByDisplayValue("Test Text")).toBeInTheDocument();

  const button = screen.getByRole("button");
  await user.click(button);

  expect(alertSpy).toHaveBeenCalledWith("submitted: Test Text");

  alertSpy.mockRestore();
});
```

### 非同期 UI のテスト

waitFor を使って所定の時間だけ、なんどもリトライをして結果を確認し続けることで、非同期の処理をテストする

```ts
const user = userEvent.setup();

describe("AsyncComponent", () => {
  it("ボタンをクリックすると非同期処理が実行される", async () => {
    render(<AsyncComponent />);
    expect(screen.getByText("Initial text")).toBeInTheDocument();

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // expect(screen.getByText("Updated text")).toBeInTheDocument();
    await waitFor(
      () => {
        expect(screen.getByText("Updated text")).toBeInTheDocument();
      },
      // 50ms間隔で期待の結果になっているか。3000msでタイムアウト
      { interval: 50, timeout: 3000 }
    );
  });
});
```

waitFor を使うことで、どうしてもテストの時間は長くなってくる。

本当にテストする必要があるか？をよく考えていこう

### フックのテスト

カスタムフックをテストする

フックのテストには renderHook を使うよ

renderHook は result を返し、その result は current の中に useCounter が本来返していたものを受け取っている

なので、result.current.`何か`で変数やメソッドを実行して動作を見ることになる

ただし、そのまま increment しても current には反映されないので、act 関数の callback の中でメソッドを実行する必要がある

```ts
import { act, renderHook } from "@testing-library/react";
import useCounter from "./useCounter";

describe("useCounter", () => {
  it("increment", () => {
    const { result } = renderHook(() => useCounter(1));

    expect(result.current.count).toBe(1);

    act(() => result.current.increment());
    expect(result.current.count).toBe(2);
  });
});
```

### スナップショットテスト

testing library というより jest 側の機能

特定のコンポーネントのレンダリング結果を記録して、変更がされていないかを検証する

まず初めにスナップショットを作成して、次回以降はそのスナップショットがあればそれと比較する

初回実行にそのテストファイルと同じ階層に`__snapshots__`のディレクトリが作成される

スナップショットがちゃんと更新されて欲しいときはオプションをつけることで更新される

```
npm test src/components/SnapshotComponent.test.tsx -- --u
```

更新するときは本当に意図通りかに関わらず更新されるので、更新するときは注意してね

また、これはチームで開発するときはみんなで同じスナップショットを使わないといけないので、git の管理対象にすること

```ts
import { render } from "@testing-library/react";
import SnapshotComponent from "./SnapshotComponent";

it("Snapshotテスト", () => {
  const { container } = render(<SnapshotComponent text="Vue" />);
  expect(container).toMatchSnapshot();
});
```

### 演習

```ts
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
```

UI のテストは

テストの準備、レンダリング、レンダリング要素の取得、ユーザー操作、アサーション

の順に構成される。

これに慣れていこう

## Storybook とビジュアルリグレッションテスト

### storybook の概要

storybook:
アプリケーションと UI コンポーネントを切り離し、独立した状態でコンポーネントの開発を行うことができるオープンソースツール

開発した UI コンポーネントをカタログとして管理

一つのコンポーネントに対して複数の状態を登録することができる。
一つ一つの状態のことを Story と呼ぶ

[メリット]

アプリケーションを実行せずに UI コンポーネントの開発が可能

開発した UI コンポーネントの確認や再利用が行いやすく開発効率の向上に寄与する

UI コンポーネントのデザインや動作を共有でき、エンジニアとデザイナーの認識齟齬を減らすことができる

UI の変更に対してビジュラルリグレッションテストを実施できる

[デメリット]

導入にそれなりにコストがかかる

メンテナンスのコストもかかる

→ ストーリーへの登録を共通コンポーネントや重要なコンポーネントに限定することで軽減する

### storybook のセットアップ

下記のコマンドで現在のプロジェクト設定に対して最適なストーリーブックの設定が入る

```
npx sb@7 init
```

空のプロジェクトに対してこのコマンドを実行すると対話形式でインストールされる

main.ts

```ts
// なにをstorybookの対象にするか
stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
// プロジェクトのフレームワークが記載
  framework: {
    name: "@storybook/react-vite",
```

preview.ts

全てのストーリーに適用する設定が書かれる

### コンポーネントストーリーの作成

Button コンポーネントに対して、二つのストーリーを作成

meta には Button コンポーネント全体の設定

```ts
import Button from "./Button";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Button",
  component: Button,
} as Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: "Primaryボタン",
    primary: true,
  },
};

export const Normal: Story = {
  args: {
    label: "Normalボタン",
    primary: false,
  },
};
```

### story のコントロールとアクション

controll
→props の内容を変更したり制限できる

```ts
const meta = {
  title: "Button",
  component: Button,
  argTypes: {
    label: {
      options: ["Primaryボタン", "Normalボタン"],
      control: { type: "select" },
    },
  },
} as Meta<typeof Button>;
```

actions
→ コンポーネントに渡されたイベントハンドラーがどんな動きをしているかを確認するための機能

操作バーのアクションズから確認する

### storybook を利用したインタラクションテスト

play function を使う

```
npm i -D @storybook/jest
```

```ts
import { Meta, StoryObj } from "@storybook/react";
import Form from "./Form";
import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import { userEvent } from "@storybook/testing-library";

const meta = {
  title: "Form",
  component: Form,
} as Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {};

export const Testing: Story = {
  play: async ({ canvasElement }) => {
    // このcanvasはreact testing libのscreenに似ているよ
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");
    await expect(input).toHaveTextContent("");
    await userEvent.type(input, "play function");
    await expect(canvas.getByDisplayValue("play function")).toBeInTheDocument();
  },
};
```

intaractions をみて、テストがすでに実行されてパスされている

storybook を使って testing library と同じような感覚でテストを書くことができる

testing library と storybook で同じことをテストする必要はない

まずは testing library でできないかを検討しよう

storybook はモックができない。でも視覚的に確認しながらテストが作れるのは嬉しいね

### ビジュラルリグレッションテストの概要

アプリケーションの変更前後で画面のスクリーンショットを取得し、画像の差分比較を行うことで意図せぬ変更が生じていないかを検証するテスト

アプリケーションのロジックのテストというよりデザインのテスト

スナップショットテストは dom をみてる。ビジュラルリグレッションテストは画像を見てる

動作：
基準となるスクリーンショットを取得
変更後のスクリーンショットを取得
2 つのスクショを比較して差分を検出

[メリット]

差分チェックが簡単に行える(px 単位でみれる)

デザインレビューが容易になる

テストツール

reg-suit + Storycap
→ これが一番よく使われる

Chromatic
→ クラウドサービス。導入が一番簡単

Playwright
→E2E で有名だけど、ビジュラルリグレッションもできる

Chromatic の概要
クラウドサービス
Storybook のメンテナーが開発・メンテナンスしている
デザインに対するコメント、承認フローなど豊富な機能
5000 スナップショット/月まで無料で使用できる

### ビジュラルリグレッションテストの準備

Chromatic を使う

https://www.chromatic.com/

git 管理されているプロジェクトである必要があるので git init から

公式サイトからアカウントを作成

プロジェクトを chromatic に登録

storybook を publish するためのコマンドを実行

publish できると chromatic の画面に作成した storybook が見れる

### 演習

Counter
