
import { Suspense } from "react";
import { Download } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { getDateRange } from "@/lib/finance";
import {
  transactionFilterSchema,
  type Filters,
} from "@/lib/validation";

import { Button } from "@/components/ui/button";
import { CsvImportDialog } from "./csv-import-dialog";
import { TransactionFilters } from "./transaction-filters";
import { TransactionManager } from "./transaction-manager";

type PageProps = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default function TransactionsPage({
  searchParams,
}: PageProps) {
  return (
    <Suspense
      fallback={
        <div role="status" className="panel p-8">
          Đang tải giao dịch...
        </div>
      }
    >
      <Results searchParams={searchParams} />
    </Suspense>
  );
}

async function Results({
  searchParams,
}: PageProps) {
  const user = await requireUser();
  const raw = await searchParams;

  const result =
    transactionFilterSchema.safeParse(raw);

  const filter: Filters = result.success
    ? result.data
    : { range: "this-month" };

  // Giữ bộ lọc hiện tại khi xuất CSV
  const exportParams = new URLSearchParams();

  exportParams.set("range", filter.range);

  if (filter.type) {
    exportParams.set("type", filter.type);
  }

  if (filter.category) {
    exportParams.set("category", filter.category);
  }

  if (filter.q) {
    exportParams.set("q", filter.q);
  }

  const exportUrl =
    `/api/transactions/export?${exportParams.toString()}`;

  // Lấy danh sách giao dịch
  const rows = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: getDateRange(filter.range),
      type: filter.type,
      category: filter.category,
      ...(filter.q
        ? {
            description: {
              contains: filter.q,
              mode: "insensitive" as const,
            },
          }
        : {}),
    },
    select: {
      id: true,
      type: true,
      amount: true,
      description: true,
      category: true,
      date: true,
    },
    orderBy: {
      date: "desc",
    },
    take: 500,
  });

  return (
    <div className="space-y-4">
      {/* Tiêu đề */}
      <div>
        <p className="muted-label">
          QUẢN LÝ DÒNG TIỀN
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Giao dịch
          </h1>

          {/* Nút Nhập CSV và Xuất CSV */}
          <div className="flex flex-wrap items-center gap-2">
            <CsvImportDialog />

            <Button asChild>
              <a href={exportUrl}>
                <Download size={16} />
                Xuất CSV
              </a>
            </Button>
          </div>
        </div>

        <p className="subtle-title mt-1">
          Thêm, xem, sửa, xóa và tìm kiếm thu chi theo URL.
        </p>
      </div>

      {/* Bộ lọc */}
      <TransactionFilters filter={filter} />

      {/* Danh sách giao dịch */}
      <TransactionManager
        rows={rows.map((row) => ({
          ...row,
          date: row.date.toISOString().slice(0, 10),
        }))}
      />
    </div>
  );
}
