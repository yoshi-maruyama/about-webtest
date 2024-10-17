import express from "express";
import { GroupService } from "../services/groupService";
import { GroupController } from "./groupController";
import { Group } from "../type";
import exp from "constants";

describe("GroupController", () => {
  let mockGroupService: Partial<GroupService>;
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: jest.Mock;
  let groupController: GroupController;

  beforeEach(() => {
    mockGroupService = {
      getGroups: jest.fn(),
      getGroupByName: jest.fn(),
      addGroup: jest.fn(),
    };
    groupController = new GroupController(mockGroupService as GroupService);
    req = {};
    res = {
      // thisを返却。つまりresオブジェクト自身が返る
      status: jest.fn().mockReturnThis(),
      // statusが自身を返すので、この書き方でメソッドチェーンができる
      // res.status(200).json(group);
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("addGroup", () => {
    it("グループが登録される", () => {
      const group: Group = { name: "group1", members: ["一郎", "二郎"] };
      req.body = group;
      (mockGroupService.getGroups as jest.Mock).mockReturnValueOnce([]);
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(mockGroupService.addGroup).toHaveBeenCalledWith(group);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("バリデーションエラー: グループ名は必須", () => {
      const invalidGroup: Group = { name: "", members: ["一郎", "二郎"] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["グループ名は必須です"]);
    });

    it("バリデーションエラー: メンバーは2人以上", () => {
      const invalidGroup: Group = { name: "group1", members: ["一郎"] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["メンバーは2人以上必要です"]);
    });

    it("バリデーションエラー: メンバー名はユニーク", () => {
      const invalidGroup: Group = { name: "group1", members: ["一郎", "一郎"] };
      req.body = invalidGroup;
      groupController.addGroup(
        req as express.Request,
        res as express.Response,
        next as express.NextFunction
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(["メンバー名が重複しています"]);
    });
  });
});
