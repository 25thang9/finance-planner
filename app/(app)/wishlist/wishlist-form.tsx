
"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save, Plus } from "lucide-react";
import { Priority } from "@/generated/prisma/enums";
import { PRIORITY_NAMES } from "@/lib/labels";
import { type WishlistFormState } from "@/lib/validation";
import { saveWishlist } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type WishlistInitial = {
  id: string;
  name: string;
  cost: number;
  priority: Priority;
  deadline: string | null;
};

export function WishlistForm({
  initial,
  onSaved,
}: {
  initial?: WishlistInitial;
  onSaved?: () => void;
}) {
  const [state, formAction, pending] = useActionState<
    WishlistFormState,
    FormData
  >(saveWishlist.bind(null, initial?.id ?? null), {});

  useEffect(() => {
    if (state.ok) {
      toast.success(state.message);
      onSaved?.();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state.nonce, state.ok, state.message]);

  const values: Record<string, string> = state.values ?? {};
  const errors: Partial<Record<string, string[]>> =
    state.errors ?? {};

  const renderError = (field: string) =>
    errors[field]?.[0] ? (
      <p
        role="alert"
        className="mt-1 text-xs font-semibold text-rose-600"
      >
        {errors[field][0]}
      </p>
    ) : null;

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="w-name"
          className="mb-1.5 block text-sm font-semibold"
        >
          Tên món muốn mua
        </label>
        <Input
          id="w-name"
          name="name"
          placeholder="Ví dụ: Laptop mới"
          maxLength={120}
          defaultValue={values.name ?? initial?.name ?? ""}
        />
        {renderError("name")}
      </div>

      <div>
        <label
          htmlFor="w-cost"
          className="mb-1.5 block text-sm font-semibold"
        >
          Giá mục tiêu (VND)
        </label>
        <Input
          id="w-cost"
          name="cost"
          type="number"
          step="any"
          inputMode="numeric"
          placeholder="Ví dụ: 20000000"
          defaultValue={values.cost ?? initial?.cost ?? ""}
        />
        {renderError("cost")}
      </div>

      <div>
        <label
          htmlFor="w-priority"
          className="mb-1.5 block text-sm font-semibold"
        >
          Mức ưu tiên
        </label>
        <select
          id="w-priority"
          name="priority"
          className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
          defaultValue={
            values.priority ??
            initial?.priority ??
            "MEDIUM"
          }
        >
          {Object.values(Priority).map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_NAMES[priority]}
            </option>
          ))}
        </select>
        {renderError("priority")}
      </div>

      <div>
        <label
          htmlFor="w-deadline"
          className="mb-1.5 block text-sm font-semibold"
        >
          Hạn chót (không bắt buộc)
        </label>
        <Input
          id="w-deadline"
          name="deadline"
          type="date"
          defaultValue={
            values.deadline ??
            initial?.deadline ??
            ""
          }
        />
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          Chọn hạn chót để nhận gợi ý số tiền cần tiết kiệm
          mỗi tháng.
        </p>
        {renderError("deadline")}
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
        {initial ? "Lưu thay đổi" : "Thêm mục tiêu"}
      </Button>
    </form>
  );
}
