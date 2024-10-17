import { ExpenseRepository } from "../repositories/expenseRepository";
import { Expense, Group } from "../type";
import { ExpenseService } from "./expenseService";
import { GroupService } from "./groupService";

describe("ExpenseService", () => {
  // PartialでGroupServiceのプロパティを全てオプショナルに。これにより、テストに必要なメソッドのみを実装するだけでよくなる
  let mockGroupService: Partial<GroupService>;
  let mockExpenseRepository: Partial<ExpenseRepository>;
  let expenseService: ExpenseService;

  const group: Group = { name: "group1", members: ["一郎", "二郎"] };
  const expense: Expense = {
    groupName: "group1",
    expenseName: "ランチ",
    amount: 2000,
    payer: "一郎",
  };

  beforeEach(() => {
    mockGroupService = {
      // Partialによってその他のメソッドのmock化を省略できている
      getGroupByName: jest.fn(),
    };
    mockExpenseRepository = {
      loadExpenses: jest.fn(),
      saveExpense: jest.fn(),
    };
    expenseService = new ExpenseService(
      // とはいえ、やっぱりPartialなので型キャストはする
      mockExpenseRepository as ExpenseRepository,
      mockGroupService as GroupService
    );
  });

  describe("addExpense", () => {
    it("支出が登録される", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(group);
      expenseService.addExpense(expense);
      expect(mockExpenseRepository.saveExpense).toHaveBeenCalledWith(expense);
    });

    it("グループが存在しない場合はエラーが発生する", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(null);
      expect(() => {
        expenseService.addExpense(expense);
      }).toThrowError();
    });

    it("支払者がグループに存在しない場合はエラーが発生する", () => {
      (mockGroupService.getGroupByName as jest.Mock).mockReturnValueOnce(null);
      const nonMemberExpense: Expense = { ...expense, payer: "太郎" };
      expect(() => {
        expenseService.addExpense(nonMemberExpense);
      }).toThrowError();
    });
  });
});
