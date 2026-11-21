
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  parseCsvTransactions,
  MAX_CSV_SIZE,
} from "@/lib/csv-import";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Kiểm tra đăng nhập
  const user = await getUser();

  if (!user) {
    return Response.json(
      { error: "Cần đăng nhập." },
      { status: 401 }
    );
  }

  // 2. Kiểm tra nguồn yêu cầu
  const origin = request.headers.get("origin");

  if (
    origin &&
    origin !== new URL(request.url).origin
  ) {
    return Response.json(
      { error: "Nguồn yêu cầu không hợp lệ." },
      { status: 403 }
    );
  }

  // 3. Đọc dữ liệu tải lên
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Dữ liệu tải lên không hợp lệ." },
      { status: 400 }
    );
  }

  const file = form.get("file");
  const mode = form.get("mode");

  if (
    mode !== "preview" &&
    mode !== "import"
  ) {
    return Response.json(
      { error: "Chế độ nhập không hợp lệ." },
      { status: 400 }
    );
  }

  // 4. Kiểm tra file
  if (!(file instanceof File)) {
    return Response.json(
      { error: "Vui lòng chọn file CSV." },
      { status: 400 }
    );
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return Response.json(
      { error: "Chỉ chấp nhận file .csv." },
      { status: 400 }
    );
  }

  if (
    file.size === 0 ||
    file.size > MAX_CSV_SIZE
  ) {
    return Response.json(
      { error: "File phải lớn hơn 0 và không quá 2 MB." },
      { status: 400 }
    );
  }

  // 5. Đọc file dưới dạng UTF-8
  let content: string;

  try {
    content = new TextDecoder("utf-8", {
      fatal: true,
    }).decode(await file.arrayBuffer());
  } catch {
    return Response.json(
      { error: "File phải sử dụng UTF-8." },
      { status: 400 }
    );
  }

  // 6. Kiểm tra CSV bằng Zod
  const result = parseCsvTransactions(content);

  if (!result.success) {
    return Response.json(
      {
        error:
          `Phát hiện ${result.errors.length} lỗi. ` +
          "Chưa nhập giao dịch nào.",
        errors: result.errors.slice(0, 20),
      },
      { status: 400 }
    );
  }

  // 7. Xem trước: không lưu vào database
  if (mode === "preview") {
    return Response.json({
      validRows: result.rows.length,
      message: "File hợp lệ, chưa lưu dữ liệu.",
    });
  }

  // 8. Nhập toàn bộ giao dịch hợp lệ
  const created = await prisma.transaction.createMany({
    data: result.rows.map((row) => ({
      ...row,
      userId: user.id,
    })),
  });

  return Response.json({
    imported: created.count,
    message:
      `Đã nhập thành công ${created.count} giao dịch.`,
  });
}
