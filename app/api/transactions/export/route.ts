
import type { NextRequest } from "next/server";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { transactionFilterSchema } from "@/lib/validation";
import { getDateRange } from "@/lib/finance";
import { exportTransactionsCsv } from "@/lib/csv-export";

export async function GET(request: NextRequest) {
  // 1. Kiểm tra người dùng đã đăng nhập
  const user = await getUser();

  if (!user) {
    return Response.json(
      { error: "Cần đăng nhập" },
      { status: 401 }
    );
  }

  // 2. Đọc và kiểm tra bộ lọc từ URL
  const raw = Object.fromEntries(
    request.nextUrl.searchParams
  );

  const parsed = transactionFilterSchema.safeParse(raw);

  if (!parsed.success) {
    return Response.json(
      { error: "Tham số lọc không hợp lệ" },
      { status: 400 }
    );
  }

  const f = parsed.data;

  // 3. Lấy giao dịch của người dùng hiện tại
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: getDateRange(f.range),
      type: f.type,
      category: f.category,
      ...(f.q
        ? {
            description: {
              contains: f.q,
              mode: "insensitive" as const,
            },
          }
        : {}),
    },
    select: {
      date: true,
      type: true,
      amount: true,
      category: true,
      description: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // 4. Chuyển sang CSV
  const csv = exportTransactionsCsv(transactions);

  // 5. Trả file về trình duyệt
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="finance-planner-transactions.csv"',
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
