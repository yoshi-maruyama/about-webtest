// beforeEach: 各テスト（it）の前に実行される
// afterEach: 各テスト（it）の後に実行される

// beforeAll: グループ内のすべてのテストの前に1度だけ実行される
// afterAll: グループ内のすべてのテストの後に1度だけ実行される

describe("outer describe block", () => {
  beforeEach(() => {
    console.log("outer beforeEach");
  });

  afterEach(() => {
    console.log("outer afterEach");
  });

  beforeAll(() => {
    console.log("outer beforeAll");
  });

  afterAll(() => {
    console.log("outer afterAll");
  });

  it("outer test 1", () => {
    console.log("outer test 1");
  });

  it("outer test 2", () => {
    console.log("outer test 2");
  });

  describe("inner describe block", () => {
    beforeEach(() => {
      console.log("inner beforeEach");
    });

    afterEach(() => {
      console.log("inner afterEach");
    });

    beforeAll(() => {
      console.log("inner beforeAll");
    });

    afterAll(() => {
      console.log("inner afterAll");
    });

    it("inner test 1", () => {
      console.log("inner test 1");
    });

    it("inner test 2", () => {
      console.log("inner test 2");
    });
  });
});
// outer beforeAll

// outer beforeEach
// outer test 1
// outer afterEach

// outer beforeEach
// outer test 2
// outer afterEach

// inner beforeAll

// outer beforeEach
// inner beforeEach
// inner test 1
// inner afterEach
// outer afterEach

// outer beforeEach
// inner beforeEach
// inner test 2
// inner afterEach
// outer afterEach

// inner afterAll

// outer afterAll
