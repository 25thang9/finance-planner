
import { parse } from "csv-parse/sync";
import { z } from "zod";
import {
  Category,
  TransactionType,
} from "@/generated/prisma/enums";

export const MAX_CSV_ROWS = 500;
export const MAX_CSV_SIZE = 2 * 1024 * 1024;

const HEADER_VI = [
  "Ngày",
  "Loại",
  "Số tiền (VND)",
  "Danh mục",
  "Mô tả",
];

const HEADER_EN = [
  "date",
  "type",
  "amount",
  "category",
  "description",
];

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

// Schema kiểm tra từng giao dịch bằng Zod
export const csvImportRowSchema = z.object({
  date: z
    .string()
    .refine(isValidDate, {
      error: "Ngày không hợp lệ, phải theo YYYY-MM-DD",
    })
    .transform(
      (value) => new Date(`${value}T00:00:00.000Z`)
    ),

  type: z.enum(TransactionType, {
    error: "Loại phải là INCOME hoặc EXPENSE",
  }),

  amount: z
    .string()
    .regex(/^[1-9]\d*$/, {
      error: "Số tiền phải là số nguyên dương",
    })
    .transform(Number)
    .pipe(
      z
        .number()
        .int()
        .positive()
        .max(2147483647)
    ),

  category: z.enum(Category, {
    error: "Mã danh mục không hợp lệ",
  }),

  description: z
    .string()
    .trim()
    .min(1, {
      error: "Mô tả không được để trống",
    })
    .max(200, {
      error: "Mô tả không quá 200 ký tự",
    }),
});

export type CsvImportRow = z.output<
  typeof csvImportRowSchema
>;

export type CsvParseResult =
  | {
      success: true;
      rows: CsvImportRow[];
    }
  | {
      success: false;
      errors: string[];
    };

function isValidHeader(headers: string[]): boolean {
  const normalize = (value: string) =>
    value.trim().toLowerCase();

  const matches = (expected: string[]) =>
    headers.length === expected.length &&
    headers.every(
      (header, index) =>
        normalize(header) === normalize(expected[index])
    );

  return matches(HEADER_VI) || matches(HEADER_EN);
}

// Đọc CSV và kiểm tra toàn bộ dữ liệu
export function parseCsvTransactions(
  content: string
): CsvParseResult {
  let records: string[][];

  try {
    records = parse(content, {
      bom: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
      max_record_size: 5000,
    }) as string[][];
  } catch {
    return {
      success: false,
      errors: ["Cấu trúc file CSV không hợp lệ."],
    };
  }

  if (
    records.length === 0 ||
    !isValidHeader(records[0])
  ) {
    return {
      success: false,
      errors: [
        "Tên hoặc thứ tự cột không đúng. Yêu cầu: Ngày, Loại, Số tiền (VND), Danh mục, Mô tả.",
      ],
    };
  }

  const dataRows = records.slice(1);

  if (
    dataRows.length === 0 ||
    dataRows.length > MAX_CSV_ROWS
  ) {
    return {
      success: false,
      errors: [
        `File phải có từ 1 đến ${MAX_CSV_ROWS} giao dịch.`,
      ],
    };
  }

  const rows: CsvImportRow[] = [];
  const errors: string[] = [];

  const fieldNames: Record<string, string> = {
    date: "Ngày",
    type: "Loại",
    amount: "Số tiền",
    category: "Danh mục",
    description: "Mô tả",
  };

  for (let index = 0; index < dataRows.length; index++) {
    const columns = dataRows[index];
    const line = index + 2;

    if (columns.length !== 5) {
      errors.push(
        `Dòng ${line}: Phải có đúng 5 cột.`
      );
      continue;
    }

    const result = csvImportRowSchema.safeParse({
      date: columns[0],
      type: columns[1].toUpperCase(),
      amount: columns[2],
      category: columns[3].toUpperCase(),
      description: columns[4],
    });

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] ?? "");
        const fieldName = fieldNames[field] ?? field;

        errors.push(
          `Dòng ${line} (${fieldName}): ${issue.message}`
        );
      }

      continue;
    }

    rows.push(result.data);
  }

  // Nếu một dòng sai, không trả dữ liệu để lưu
  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  return {
    success: true,
    rows,
  };
}
