
"use client";

import { useCallback, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Plus,
} from "lucide-react";

import { formatVND } from "@/lib/finance";
import { CATEGORY_NAMES } from "@/lib/labels";

import {
  TransactionForm,
  type TransactionInitial,
} from "./transaction-form";

import { deleteTransaction } from "./actions";
import { DeleteConfirm } from "@/components/delete-confirm";
import { EmptyState } from "@/components/ui/empty-state";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

export type TransactionRow = TransactionInitial;

export function TransactionManager({
  rows,
}: {
  rows: TransactionRow[];
}) {
  const [adding, setAdding] = useState(false);

  const closeAddDialog = useCallback(() => {
    setAdding(false);
  }, []);

  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-lg font-bold">
            Danh sách giao dịch
          </h2>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Đang hiển thị{" "}
            <strong>{rows.length}</strong>{" "}
            giao dịch theo bộ lọc
          </p>
        </div>

        <Dialog
          open={adding}
          onOpenChange={setAdding}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} />
              Thêm giao dịch
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle className="text-xl font-bold">
              Thêm giao dịch mới
            </DialogTitle>

            <DialogDescription className="mb-5 mt-1">
              Nhập thông tin giao dịch. Số tiền phải
              là số nguyên dương.
            </DialogDescription>

            <TransactionForm
              onSaved={closeAddDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      {rows.length === 0 ? (
        <div className="p-6">
          <EmptyState
            title="Không tìm thấy giao dịch"
            description="Thử chọn thời gian hoặc danh mục khác, hoặc thêm giao dịch mới."
          />
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {rows.map((row) => (
            <TransactionItem
              key={row.id}
              data={row}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function TransactionItem({
  data,
}: {
  data: TransactionRow;
}) {
  const [editing, setEditing] = useState(false);

  const closeEditDialog = useCallback(() => {
    setEditing(false);
  }, []);

  const isIncome = data.type === "INCOME";

  const displayDate = new Date(
    `${data.date}T00:00:00Z`
  ).toLocaleDateString("vi-VN", {
    timeZone: "UTC",
  });

  return (
    <div className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--muted)]/30 sm:px-6">
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          isIncome
            ? "bg-emerald-50 text-emerald-700"
            : "bg-rose-50 text-rose-700"
        }`}
      >
        {isIncome ? (
          <ArrowUpRight size={21} />
        ) : (
          <ArrowDownRight size={21} />
        )}
      </span>

      <div className="min-w-[110px] flex-1">
        <p className="truncate text-sm font-bold">
          {data.description}
        </p>

        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {CATEGORY_NAMES[data.category]}
          {" · "}
          {displayDate}
        </p>
      </div>

      <div className="ml-auto text-right">
        <p
          className={`whitespace-nowrap text-sm font-bold sm:text-base ${
            isIncome
              ? "text-emerald-700 dark:text-emerald-400"
              : ""
          }`}
        >
          {isIncome ? "+" : "−"}
          {formatVND(data.amount)}
        </p>

        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {isIncome ? "Thu nhập" : "Chi tiêu"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Dialog
          open={editing}
          onOpenChange={setEditing}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Sửa ${data.description}`}
              title="Sửa"
            >
              <Pencil size={17} />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle className="text-xl font-bold">
              Sửa giao dịch
            </DialogTitle>

            <DialogDescription className="mb-5 mt-1">
              Chỉnh sửa thông tin và lưu để cập nhật.
            </DialogDescription>

            <TransactionForm
              initial={data}
              onSaved={closeEditDialog}
            />
          </DialogContent>
        </Dialog>

        <DeleteConfirm
          id={data.id}
          label={data.description}
          action={deleteTransaction}
        />
      </div>
    </div>
  );
}
