import { describe, expect, it } from "vitest";
import { splitStatements } from "../src/db/migrate";
import { isCorrect, toScore } from "../src/quiz/quiz.attempt";

describe("splitStatements", () => {
  it("splits drizzle output with breakpoints on their own line or after the semicolon", () => {
    const sql = "CREATE TABLE a (id int);\n--> statement-breakpoint\nCREATE TABLE b (id int);--> statement-breakpoint\nALTER TABLE b ADD x int;";
    expect(splitStatements(sql)).toEqual(["CREATE TABLE a (id int)", "CREATE TABLE b (id int)", "ALTER TABLE b ADD x int"]);
  });

  it("keeps trigger bodies in one piece when DELIMITER is used", () => {
    const sql = [
      "-- a comment",
      "DELIMITER $$",
      "CREATE TRIGGER t BEFORE INSERT ON x FOR EACH ROW",
      "BEGIN",
      "  SET NEW.a = 1;",
      "  SET NEW.b = 2;",
      "END $$",
      "DELIMITER ;",
      "SELECT 1;",
    ].join("\n");
    const statements = splitStatements(sql);
    expect(statements).toHaveLength(2);
    expect(statements[0]).toMatch(/^CREATE TRIGGER t[\s\S]*SET NEW\.b = 2;\nEND$/);
    expect(statements[1]).toBe("SELECT 1");
  });

  it("handles Windows line endings", () => {
    expect(splitStatements("SELECT 1;\r\n--> statement-breakpoint\r\nSELECT 2;\r\n")).toEqual(["SELECT 1", "SELECT 2"]);
  });
});

describe("grading helpers", () => {
  it("compares multiple choice exactly", () => {
    expect(isCorrect("multiple choice", "2NF", "2NF")).toBe(true);
    expect(isCorrect("multiple choice", "2nf", "2NF")).toBe(false);
    expect(isCorrect("multiple choice", undefined, "2NF")).toBe(false);
  });

  it("compares free-text answers ignoring case and spacing", () => {
    expect(isCorrect("fill in blank", "  Primary   KEY ", "primary key")).toBe(true);
    expect(isCorrect("short answer", "foreign key", "primary key")).toBe(false);
  });

  it("scores out of 10 with two decimals", () => {
    expect(toScore(1, 3)).toBe(3.33);
    expect(toScore(2, 3)).toBe(6.67);
    expect(toScore(5, 5)).toBe(10);
    expect(toScore(0, 0)).toBe(0);
  });
});
