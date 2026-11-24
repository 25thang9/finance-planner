
"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Category } from "@/generated/prisma/enums";
import { CATEGORY_NAMES } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveBudget, type BudgetState } from "./actions";

export function BudgetForm({
  onSaved,
}: {
  onSaved?: () => void;
}) {
  const [state, action, pending] = useActionState<
    BudgetState,
    FormData
  >(saveBudget, {});

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      onSaved?.();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [
    state.nonce,
    state.ok,
    state.message,
    onSaved,
  ]);

  const values: Record<string, string> =
    state.values ?? {};

  const selectClass =
    "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm";

  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          className="mb-1.5 block text-sm font-semibold"
          htmlFor="b-category"
        >
          Danh mục chi tiêu
        </label>

        <select
          id="b-category"
          name="category"
          className={selectClass}
          defaultValue={values.category ?? "FOOD"}
        >
          {Object.values(Category)
            .filter((category) => category !== "SALARY")
            .map((category) => (
              <option
                key={category}
                value={category}
              >
                {CATEGORY_NAMES[category]}
              </option>
            ))}
        </select>

        {state.errors?.category?.[0] && (
          <p role="alert" className="text-xs text-rose-600">
            {state.errors.category[0]}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-1.5 block text-sm font-semibold"
          htmlFor="b-month"
        >
          Tháng
        </label>

        <Input
          id="b-month"
          name="month"
          type="month"
          defaultValue={
            values.month ?? currentMonth
          }
        />

        {state.errors?.month?.[0] && (
          <p role="alert" className="text-xs text-rose-600">
            {state.errors.month[0]}
          </p>
        )}
      </div>

      <div>
        <label
          className="mb-1.5 block text-sm font-semibold"
          htmlFor="b-amount"
        >
          Ngân sách tối đa (VND)
        </label>

        <Input
          id="b-amount"
          name="amount"
          type="number"
          min={1}
          max={2147483647}
          step={1}
          inputMode="numeric"
          placeholder="Ví dụ: 3000000"
          defaultValue={values.amount ?? ""}
        />

        {state.errors?.amount?.[0] && (
          <p role="alert" className="text-xs text-rose-600">
            {state.errors.amount[0]}
          </p>
        )}
      </div>

      <Button
        disabled={pending}
        type="submit"
        className="w-full"
      >
        {pending ? "Đang lưu..." : "Lưu ngân sách"}
      </Button>
    </form>
  );
}
