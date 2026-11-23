
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateSavingsPlan,
} from "../lib/savings-plan";

describe("Savings plan", () => {
  const today = "2026-11-23";

  it("Tính số tiền tiết kiệm mỗi tháng", () => {
    const result = calculateSavingsPlan({
      cost: 12_000_000,
      currentBalance: 3_000_000,
      deadline: "2027-05-23",
      today,
    });

    expect(result.status).toBe("active");
    expect(result.monthsLeft).toBe(6);
    expect(result.perMonth).toBe(1_500_000);
  });

  it("Làm tròn số tiền cần tiết kiệm lên", () => {
    const result = calculateSavingsPlan({
      cost: 1_000_001,
      currentBalance: 0,
      deadline: "2027-01-23",
      today,
    });

    expect(result.perMonth).toBe(500_001);
  });

  it("Hạn chót trong tháng hiện tại", () => {
    const result = calculateSavingsPlan({
      cost: 1_000_000,
      currentBalance: 0,
      deadline: "2026-11-30",
      today,
    });

    expect(result.monthsLeft).toBe(1);
  });

  it("Mục tiêu đã đủ tiền", () => {
    const result = calculateSavingsPlan({
      cost: 2_000_000,
      currentBalance: 3_000_000,
      deadline: "2027-05-23",
      today,
    });

    expect(result.status).toBe("completed");
    expect(result.perMonth).toBe(0);
  });

  it("Số dư âm được tính là 0", () => {
    const result = calculateSavingsPlan({
      cost: 10_000_000,
      currentBalance: -1_000_000,
      deadline: "2027-04-23",
      today,
    });

    expect(result.remaining).toBe(10_000_000);
    expect(result.perMonth).toBe(2_000_000);
  });

  it("Chưa có hạn chót thì không gợi ý", () => {
    const result = calculateSavingsPlan({
      cost: 5_000_000,
      currentBalance: 0,
      today,
    });

    expect(result.status).toBe("no-deadline");
    expect(result.perMonth).toBeNull();
  });

  it("Nhận biết hạn chót đã qua", () => {
    const result = calculateSavingsPlan({
      cost: 5_000_000,
      currentBalance: 0,
      deadline: "2026-11-22",
      today,
    });

    expect(result.status).toBe("overdue");
    expect(result.monthsLeft).toBe(0);
  });

  it("Từ chối ngày không hợp lệ", () => {
    expect(() =>
      calculateSavingsPlan({
        cost: 5_000_000,
        currentBalance: 0,
        deadline: "2027-02-30",
        today,
      })
    ).toThrow("Ngày không hợp lệ");
  });
});
