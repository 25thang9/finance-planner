
"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus } from "lucide-react";

import { Category } from "@/generated/prisma/enums";
import { CATEGORY_NAMES } from "@/lib/labels";

import {
  type TransactionFormState,
  type TransactionValues,
} from "@/lib/validation";

import {
  createTransaction,
  updateTransaction,
} from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type TransactionInitial = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  category: Category;
  date: string;
};

export type TransactionSaveFeedback = {
  message?: string;
  notifications?: string[];
};

export function TransactionForm({
  initial,
  onSaved,
}: {
  initial?: TransactionInitial;
  onSaved?: (feedback: TransactionSaveFeedback) => void;
}) {
  const action = initial
    ? updateTransaction.bind(null, initial.id)
    : createTransaction;

  const [state, formAction, pending] = useActionState<
    TransactionFormState,
    FormData
  >(action, {});

  useEffect(() => {
    if (state.ok) {
      const feedback: TransactionSaveFeedback = {
        message: state.message,
        notifications: state.notifications,
      };

      if (onSaved) {
        // Giao trách nhiệm hiện toast cho màn hình cha, nơi không bị
        // unmount khi hộp thoại đóng sau khi lưu giao dịch.
        onSaved(feedback);
      } else if (state.notifications?.length) {
        toast.success("🎉 Chúc mừng đạt mốc tiết kiệm!", {
          description: state.notifications.join(" · "),
          duration: 9000,
        });
      } else {
        toast.success(state.message ?? "Đã lưu giao dịch");
      }
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [
    state.nonce,
    state.ok,
    state.message,
    state.notifications,
    onSaved,
  ]);

  const values: TransactionValues = state.values ?? {};

  const errors: NonNullable<
    TransactionFormState["errors"]
  > = state.errors ?? {};

  const renderError = (name: keyof TransactionValues) =>
    errors[name]?.[0] ? (
      <p
        role="alert"
        className="mt-1.5 text-xs font-semibold text-rose-600"
      >
        {errors[name]?.[0]}
      </p>
    ) : null;

  const labelClass =
    "mb-1.5 block text-sm font-semibold";

  const selectClass =
    "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--foreground)] focus:border-[#5eafb8] focus:outline-none focus:ring-2 focus:ring-[#5eafb833]";

  const prefix = initial?.id ?? "new";

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className={labelClass}
            htmlFor={`${prefix}-type`}
          >
            Loại giao dịch
          </label>

          <select
            id={`${prefix}-type`}
            name="type"
            className={selectClass}
            defaultValue={
              values.type ?? initial?.type ?? "EXPENSE"
            }
          >
            <option value="EXPENSE">Chi tiêu</option>
            <option value="INCOME">Thu nhập</option>
          </select>

          {renderError("type")}
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor={`${prefix}-amount`}
          >
            Số tiền (VND)
          </label>

          <Input
            id={`${prefix}-amount`}
            name="amount"
            type="number"
            inputMode="numeric"
            min={1}
            max={2000000000}
            step={1}
            placeholder="Ví dụ: 250000"
            defaultValue={
              values.amount ?? initial?.amount ?? ""
            }
          />

          {renderError("amount")}
        </div>
      </div>

      <div>
        <label
          className={labelClass}
          htmlFor={`${prefix}-description`}
        >
          Mô tả giao dịch
        </label>

        <Input
          id={`${prefix}-description`}
          name="description"
          maxLength={120}
          placeholder="Ví dụ: Ăn trưa, tiền lương..."
          defaultValue={
            values.description ??
            initial?.description ??
            ""
          }
        />

        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Tối đa 120 ký tự.
        </p>

        {renderError("description")}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className={labelClass}
            htmlFor={`${prefix}-category`}
          >
            Danh mục
          </label>

          <select
            id={`${prefix}-category`}
            name="category"
            className={selectClass}
            defaultValue={
              values.category ??
              initial?.category ??
              "FOOD"
            }
          >
            {Object.values(Category).map((category) => (
              <option key={category} value={category}>
                {CATEGORY_NAMES[category]}
              </option>
            ))}
          </select>

          {renderError("category")}
        </div>

        <div>
          <label
            className={labelClass}
            htmlFor={`${prefix}-date`}
          >
            Ngày giao dịch
          </label>

          <Input
            id={`${prefix}-date`}
            name="date"
            type="date"
            defaultValue={
              values.date ??
              initial?.date ??
              new Date().toISOString().slice(0, 10)
            }
          />

          {renderError("date")}
        </div>
      </div>

      <Button
        disabled={pending}
        type="submit"
        className="w-full"
      >
        {pending ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : initial ? (
          <Save size={17} />
        ) : (
          <Plus size={17} />
        )}

        {pending
          ? "Đang lưu..."
          : initial
            ? "Cập nhật giao dịch"
            : "Thêm giao dịch"}
      </Button>
    </form>
  );
}
