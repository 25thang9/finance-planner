
export type CsvTransaction = {
  date: Date;
  type: string;
  amount: number;
  category: string;
  description: string;
};

function escapeCsv(value: string | number): string {
  const text = String(value);

  // Ngăn nội dung người dùng bị Excel hiểu thành công thức.
  const safe = /^[\s]*[=+\-@]/.test(text)
    ? "'" + text
    : text;

  return `"${safe.replace(/"/g, '""')}"`;
}

export function exportTransactionsCsv(
  transactions: CsvTransaction[]
): string {
  const header = [
    "Ngày",
    "Loại",
    "Số tiền (VND)",
    "Danh mục",
    "Mô tả",
  ];

  const rows = transactions.map((item) => [
    item.date.toISOString().slice(0, 10),
    item.type,
    item.amount,
    item.category,
    item.description,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  // BOM giúp Excel nhận diện tiếng Việt UTF-8.
  return "\uFEFF" + csv + "\r\n";
}
