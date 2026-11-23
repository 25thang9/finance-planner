
"use client";

import { useState } from "react";
import {
  Target,
  Pencil,
  Plus,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  Wallet,
  Clock3,
} from "lucide-react";

import {
  formatVND,
  wishlistProgress,
} from "@/lib/finance";

import { calculateSavingsPlan } from "@/lib/savings-plan";
import { PRIORITY_NAMES } from "@/lib/labels";
import { deleteWishlist } from "./actions";
import {
  WishlistForm,
  type WishlistInitial,
} from "./wishlist-form";

import { DeleteConfirm } from "@/components/delete-confirm";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EmptyState } from "@/components/ui/empty-state";

type WishlistManagerProps = {
  items: WishlistInitial[];
  balance: number;
  today: string;
};

function formatDeadline(value: string): string {
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function WishlistManager({
  items,
  balance,
  today,
}: WishlistManagerProps) {
  const [add, setAdd] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="muted-label">
            MỤC TIÊU TƯƠNG LAI
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Wishlist của tôi
          </h1>

          <p className="subtle-title mt-2">
            Theo dõi tiến độ tiết kiệm dựa trên số dư hiện tại:{" "}
            <strong>{formatVND(balance)}</strong>.
          </p>
        </div>

        <Dialog open={add} onOpenChange={setAdd}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={17} />
              Thêm mục tiêu
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle className="text-xl font-bold">
              Mục tiêu mới
            </DialogTitle>

            <DialogDescription className="mb-5 mt-1">
              Đặt mục tiêu tiết kiệm và hạn chót dự kiến.
            </DialogDescription>

            <WishlistForm
              onSaved={() => setAdd(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="Chưa có wishlist"
            description="Thêm món đồ bạn đang muốn tiết kiệm để mua."
          />
        </div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <WishlistCard
              key={item.id}
              item={item}
              balance={balance}
              today={today}
            />
          ))}
        </div>
      )}

      <div className="panel mt-7 flex items-start gap-3 p-5">
        <Sparkles
          size={20}
          className="shrink-0 text-[#46949b]"
        />

        <div>
          <p className="font-semibold">
            Mốc động viên 50% · 75% · 100%
          </p>

          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Khi số dư vượt một mốc sau thao tác giao dịch,
            bạn sẽ nhận thông báo chúc mừng. Mỗi mốc của
            mỗi mục tiêu chỉ được báo một lần, có lưu
            trong database.
          </p>
        </div>
      </div>
    </>
  );
}

function WishlistCard({
  item,
  balance,
  today,
}: {
  item: WishlistInitial;
  balance: number;
  today: string;
}) {
  const [edit, setEdit] = useState(false);

  const percent = wishlistProgress(
    balance,
    item.cost
  );

  const plan = calculateSavingsPlan({
    cost: item.cost,
    currentBalance: balance,
    deadline: item.deadline,
    today,
  });

  return (
    <article className="panel p-6">
      <div className="flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f1f0] text-[#367e84]">
          <Target size={23} />
        </span>

        <Badge>
          {PRIORITY_NAMES[item.priority]}
        </Badge>
      </div>

      <h2 className="mt-5 line-clamp-2 text-xl font-bold">
        {item.name}
      </h2>

      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
        Giá mục tiêu: {formatVND(item.cost)}
      </p>

      <div className="mt-6 flex items-end justify-between">
        <span className="text-sm font-semibold">
          Tiến độ tiết kiệm
        </span>

        <strong className="text-2xl text-[#34838a]">
          {percent}%
        </strong>
      </div>

      <Progress
        className="mt-2"
        value={percent}
      />

      <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        {percent >= 100 ? (
          <>
            <CheckCircle2
              size={14}
              className="text-emerald-500"
            />
            Đã đủ số dư để mua mục tiêu này
          </>
        ) : (
          <>
            Còn cần {formatVND(plan.remaining)} để
            đạt mục tiêu
          </>
        )}
      </p>

      {item.deadline && (
        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--muted)]/40 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays
              size={16}
              className="text-[#46949b]"
            />

            Hạn chót: {formatDeadline(item.deadline)}
          </div>

          {plan.status === "active" && (
            <div className="mt-4 space-y-3">
              <p className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <Clock3 size={15} />
                Còn khoảng {plan.monthsLeft} tháng
              </p>

              <div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Gợi ý tiết kiệm mỗi tháng
                </p>

                <p className="mt-1 flex items-center gap-2 text-xl font-bold text-[#34838a]">
                  <Wallet size={19} />
                  {formatVND(plan.perMonth ?? 0)}
                </p>
              </div>

              <p className="text-xs text-[var(--muted-foreground)]">
                Ước tính theo số dư hiện tại.
              </p>
            </div>
          )}

          {plan.status === "completed" && (
            <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <CheckCircle2 size={17} />
              Đã đủ số dư để đạt mục tiêu
            </p>
          )}

          {plan.status === "overdue" && (
            <p className="mt-3 text-sm text-amber-600">
              Đã quá hạn chót và chưa đủ số dư.
              Có thể chỉnh sửa hạn chót để lập
              kế hoạch mới.
            </p>
          )}
        </div>
      )}

      {!item.deadline && (
        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
          <CalendarDays size={15} />
          Chưa đặt hạn chót cho mục tiêu này.
        </p>
      )}

      <div className="mt-6 flex justify-end gap-2 border-t border-[var(--border)] pt-4">
        <Dialog
          open={edit}
          onOpenChange={setEdit}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              <Pencil size={15} />
              Sửa
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogTitle className="text-xl font-bold">
              Sửa mục tiêu
            </DialogTitle>

            <DialogDescription className="mb-5 mt-1">
              Cập nhật tên, giá, mức độ ưu tiên
              hoặc hạn chót.
            </DialogDescription>

            <WishlistForm
              initial={item}
              onSaved={() => setEdit(false)}
            />
          </DialogContent>
        </Dialog>

        <DeleteConfirm
          id={item.id}
          label={item.name}
          action={deleteWishlist}
        />
      </div>
    </article>
  );
}
