
import { describe, expect, it } from "vitest";
import { parseCsvTransactions } from "@/lib/csv-import";

const header =
  "Ngày,Loại,Số tiền (VND),Danh mục,Mô tả";

function csv(row: string) {
  return `${header}\n${row}`;
}

function expectCsvError(
  content: string,
  expectedMessage: string
) {
  const result = parseCsvTransactions(content);

  expect(result.success).toBe(false);

  if (!result.success) {
    expect(result.errors.join(" ")).toContain(
      expectedMessage
    );
  }
}

describe("CSV Import Validation", () => {
  it("Chấp nhận file CSV hợp lệ", () => {
    const result = parseCsvTransactions(
      csv("2026-11-20,EXPENSE,85000,FOOD,Ăn trưa")
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].amount).toBe(85000);
      expect(result.rows[0].type).toBe("EXPENSE");
    }
  });

  it("Chấp nhận tiêu đề tiếng Anh", () => {
    const result = parseCsvTransactions(
      "date,type,amount,category,description\n" +
      "2026-11-20,INCOME,2000000,SALARY,Lương"
    );

    expect(result.success).toBe(true);
  });

  it("Đọc được CSV UTF-8 có BOM", () => {
    const result = parseCsvTransactions(
      "\uFEFF" +
      csv("2026-11-20,EXPENSE,85000,FOOD,Ăn trưa")
    );

    expect(result.success).toBe(true);
  });

  it("Đọc đúng mô tả chứa dấu phẩy", () => {
    const result = parseCsvTransactions(
      csv(
        '2026-11-20,EXPENSE,85000,FOOD,"Cà phê, bánh mì"'
      )
    );

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.rows[0].description).toBe(
        "Cà phê, bánh mì"
      );
    }
  });

  it("Từ chối số tiền là chữ", () => {
    expectCsvError(
      csv("2026-11-20,EXPENSE,abc,FOOD,Ăn trưa"),
      "Số tiền"
    );
  });

  it("Từ chối số tiền âm", () => {
    expectCsvError(
      csv("2026-11-20,EXPENSE,-5000,FOOD,Ăn trưa"),
      "Số tiền"
    );
  });

  it("Từ chối ngày không tồn tại", () => {
    expectCsvError(
      csv("2026-02-30,EXPENSE,85000,FOOD,Ăn trưa"),
      "Ngày"
    );
  });

  it("Từ chối loại giao dịch sai", () => {
    expectCsvError(
      csv("2026-11-20,ABC,85000,FOOD,Ăn trưa"),
      "Loại"
    );
  });

  it("Từ chối danh mục không tồn tại", () => {
    expectCsvError(
      csv("2026-11-20,EXPENSE,85000,ABC,Ăn trưa"),
      "Danh mục"
    );
  });

  it("Từ chối file thiếu cột", () => {
    expectCsvError(
      csv("2026-11-20,EXPENSE,85000,FOOD"),
      "5 cột"
    );
  });

  it("Từ chối file không có giao dịch", () => {
    expectCsvError(header, "từ 1 đến 500");
  });

  it("Nếu một dòng sai thì không trả dữ liệu để lưu", () => {
    const result = parseCsvTransactions(
      [
        header,
        "2026-11-20,EXPENSE,85000,FOOD,Ăn trưa",
        "2026-11-20,EXPENSE,abc,FOOD,Ăn tối",
      ].join("\n")
    );

    expect(result.success).toBe(false);
    expect("rows" in result).toBe(false);
  });

  it("Từ chối file vượt quá 500 giao dịch", () => {
    const rows = Array.from(
      { length: 501 },
      () =>
        "2026-11-20,EXPENSE,85000,FOOD,Ăn trưa"
    );

    expectCsvError(
      [header, ...rows].join("\n"),
      "từ 1 đến 500"
    );
  });
});
