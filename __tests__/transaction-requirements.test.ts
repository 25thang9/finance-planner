
import {
  describe,
  expect,
  it,
} from "vitest";

import {
  transactionSchema,
  transactionFilterSchema,
} from "../lib/validation";

const validTransaction = {
  type: "EXPENSE",
  amount: "50000",
  description: "Ăn trưa",
  category: "FOOD",
  date: "2026-11-24",
};

describe("Yêu cầu A.3 - Quản lý giao dịch", () => {
  it("Chấp nhận giao dịch hợp lệ", () => {
    const result = transactionSchema.safeParse(
      validTransaction
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.amount).toBe(50000);
    }
  });

  it("Không chấp nhận số tiền bằng 0", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      amount: "0",
    });

    expect(result.success).toBe(false);
  });

  it("Không chấp nhận số tiền âm", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      amount: "-50000",
    });

    expect(result.success).toBe(false);
  });

  it("Không chấp nhận số tiền thập phân", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      amount: "50000.5",
    });

    expect(result.success).toBe(false);
  });

  it("Không chấp nhận số tiền vượt giới hạn", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      amount: "2000000001",
    });

    expect(result.success).toBe(false);
  });

  it("Không chấp nhận mô tả trống", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      description: "   ",
    });

    expect(result.success).toBe(false);
  });

  it("Không chấp nhận mô tả vượt 120 ký tự", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      description: "A".repeat(121),
    });

    expect(result.success).toBe(false);
  });

  it("Không chấp nhận ngày sai định dạng", () => {
    const result = transactionSchema.safeParse({
      ...validTransaction,
      date: "24/11/2026",
    });

    expect(result.success).toBe(false);
  });
});

describe("Yêu cầu A.3 - Lọc giao dịch", () => {
  it("Mặc định lọc tháng hiện tại", () => {
    const result = transactionFilterSchema.parse({});

    expect(result.range).toBe("this-month");
  });

  it("Chấp nhận bộ lọc URL hợp lệ", () => {
    const result = transactionFilterSchema.safeParse({
      range: "last-month",
      type: "EXPENSE",
      category: "FOOD",
      q: "Ăn trưa",
    });

    expect(result.success).toBe(true);
  });

  it("Từ chối bộ lọc thời gian không hợp lệ", () => {
    const result = transactionFilterSchema.safeParse({
      range: "next-year",
    });

    expect(result.success).toBe(false);
  });
});
