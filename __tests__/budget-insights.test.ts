
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getBudgetInsight,
} from "../lib/budget-insights";

describe("Budget insights", () => {
  const amount = 1_000_000;

  it("Chưa chi tiêu", () => {
    const result = getBudgetInsight(0, amount);

    expect(result.status).toBe("safe");
    expect(result.remaining).toBe(amount);
  });

  it("Dưới 80% vẫn an toàn", () => {
    const result = getBudgetInsight(790_000, amount);

    expect(result.status).toBe("safe");
    expect(result.percent).toBe(79);
  });

  it("Đúng 80% hiển thị cảnh báo", () => {
    const result = getBudgetInsight(800_000, amount);

    expect(result.status).toBe("warning");
    expect(result.percent).toBe(80);
  });

  it("Từ 80% đến dưới 100% vẫn cảnh báo", () => {
    const result = getBudgetInsight(990_000, amount);

    expect(result.status).toBe("warning");
    expect(result.remaining).toBe(10_000);
  });

  it("Đúng 100% hiển thị hết hạn mức", () => {
    const result = getBudgetInsight(1_000_000, amount);

    expect(result.status).toBe("limit");
    expect(result.remaining).toBe(0);
  });

  it("Trên 100% hiển thị số tiền vượt", () => {
    const result = getBudgetInsight(1_200_000, amount);

    expect(result.status).toBe("over");
    expect(result.exceededBy).toBe(200_000);
    expect(result.percent).toBe(120);
  });

  it("Từ chối ngân sách bằng 0", () => {
    expect(() => getBudgetInsight(100_000, 0))
      .toThrow("Dữ liệu ngân sách không hợp lệ");
  });

  it("Từ chối số tiền đã chi âm", () => {
    expect(() => getBudgetInsight(-10_000, amount))
      .toThrow("Dữ liệu ngân sách không hợp lệ");
  });
});
