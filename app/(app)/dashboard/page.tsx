
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  Plus,
  ArrowRight,
  Target,
  AlertCircle,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { userBalance } from "@/lib/data";

import {
  formatVND,
  getDateRange,
  wishlistProgress,
  spendingByCategory,
  budgetStatus,
  monthKey,
} from "@/lib/finance";

import {
  CATEGORY_NAMES,
  CATEGORY_COLORS,
} from "@/lib/labels";

import {
  ExpensePie,
  TrendChart,
} from "@/components/charts";

import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";

import type { Category } from "@/generated/prisma/enums";

export default async function DashboardPage() {
  const user = await requireUser();
  const now = new Date();
  const monthRange = getDateRange("this-month", now)!;

  const [
    totals,
    thisMonth,
    recent,
    wishlist,
    budgets,
    lastSixMonths,
  ] = await Promise.all([
    userBalance(user.id),

    prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: monthRange,
      },
      select: {
        type: true,
        amount: true,
        category: true,
      },
    }),

    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        description: true,
        category: true,
        date: true,
        amount: true,
      },
    }),

    prisma.wishlistItem.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),

    prisma.budget.findMany({
      where: {
        userId: user.id,
        month: new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            1
          )
        ),
      },
    }),

    prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(
            now.getFullYear(),
            now.getMonth() - 5,
            1
          ),
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    }),
  ]);

  const categoryTotals = spendingByCategory(thisMonth);

  const pie = Object.entries(categoryTotals)
    .map(([key, value]) => ({
      name: CATEGORY_NAMES[key as Category],
      value: value!,
      color: CATEGORY_COLORS[key as Category],
    }))
    .sort((a, b) => b.value - a.value);

  const thisMonthIncome = thisMonth
    .filter((x) => x.type === "INCOME")
    .reduce((a, x) => a + x.amount, 0);

  const thisMonthExpense = thisMonth
    .filter((x) => x.type === "EXPENSE")
    .reduce((a, x) => a + x.amount, 0);

  const monthSeries = Array.from(
    { length: 6 },
    (_, index) => {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - 5 + index,
        1
      );

      const key = monthKey(d);
      const matches = lastSixMonths.filter(
        (x) => monthKey(x.date) === key
      );

      return {
        month: `T${d.getMonth() + 1}`,
        income: matches
          .filter((x) => x.type === "INCOME")
          .reduce((a, x) => a + x.amount, 0),
        expense: matches
          .filter((x) => x.type === "EXPENSE")
          .reduce((a, x) => a + x.amount, 0),
      };
    }
  );

  const riskBudgets = budgets
    .map((b) => ({
      name: CATEGORY_NAMES[b.category],
      progress: Math.round(
        ((categoryTotals[b.category] ?? 0) / b.amount) * 100
      ),
      status: budgetStatus(
        categoryTotals[b.category] ?? 0,
        b.amount
      ),
    }))
    .filter((b) => b.status !== "safe");

  return (
    <div className="space-y-7">
      {/* TIÊU ĐỀ */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="muted-label">
            TỔNG QUAN TÀI CHÍNH
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Xin chào, {user.name.split(" ").at(-1)}{" "}
            <span aria-hidden="true"></span>
          </h1>

          <p className="subtle-title mt-2">
            Dữ liệu thực từ tài khoản của bạn ·{" "}
            {new Intl.DateTimeFormat("vi-VN", {
              month: "long",
              year: "numeric",
            }).format(now)}
          </p>
        </div>

        <Button asChild>
          <Link href="/transactions">
            <Plus size={17} />
            Thêm giao dịch
          </Link>
        </Button>
      </div>

      {/* CẢNH BÁO NGÂN SÁCH */}
      {riskBudgets.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900 dark:border-amber-700 dark:bg-amber-950/25 dark:text-amber-200">
          <AlertCircle size={19} />

          <p className="text-sm">
            <strong>Cảnh báo ngân sách:</strong>{" "}
            {riskBudgets
              .map((x) => `${x.name} đạt ${x.progress}%`)
              .join(" · ")}
            .{" "}
            <Link
              href="/budgets"
              className="font-bold underline"
            >
              Xem ngân sách
            </Link>
          </p>
        </div>
      )}

      {totals.balance < 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          <AlertCircle size={20} />

          <p className="text-sm">
            <strong>Cảnh báo tài chính:</strong>{" "}
            Chi tiêu đã vượt thu nhập{" "}
            {formatVND(Math.abs(totals.balance))}.
            Hãy xem lại kế hoạch chi tiêu.
          </p>
        </div>
      )}

      {/* THỐNG KÊ TÀI CHÍNH */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted-foreground)]">
              Số dư hiện tại
            </p>

            <span className="rounded-xl bg-sky-50 p-2 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
              <Wallet size={21} />
            </span>
          </div>

          <p className="mt-4 break-words text-2xl font-bold text-[var(--foreground)]">
            {formatVND(totals.balance)}
          </p>

          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            Tổng thu − Tổng chi (toàn thời gian)
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
              Tổng thu nhập
            </p>

            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
              <ArrowUpRight size={21} />
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold">
            {formatVND(totals.income)}
          </p>

          <p className="mt-2 text-xs text-emerald-600">
            Tháng này: {formatVND(thisMonthIncome)}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted-foreground)]">
              Tổng chi tiêu
            </p>

            <span className="rounded-xl bg-rose-50 p-2 text-rose-600">
              <ArrowDownRight size={21} />
            </span>
          </div>

          <p className="mt-4 text-2xl font-bold">
            {formatVND(totals.expense)}
          </p>

          <p className="mt-2 text-xs text-rose-600">
            Tháng này: {formatVND(thisMonthExpense)}
          </p>
        </Card>
      </div>

      {/* BIỂU ĐỒ */}
      <div className="grid gap-5 xl:grid-cols-[1.04fr_.96fr]">
        <Card>
          <CardTitle>
            Xu hướng thu chi
          </CardTitle>

          <CardDescription className="mt-1">
            So sánh 6 tháng gần nhất
          </CardDescription>

          <div className="mt-4">
            <TrendChart data={monthSeries} />
          </div>
        </Card>

        <Card>
          <CardTitle>
            Chi tiêu theo danh mục
          </CardTitle>

          <CardDescription className="mt-1">
            Phân bổ trong tháng hiện tại
          </CardDescription>

          <ExpensePie data={pie} />

          <div className="mt-1 space-y-2">
            <table className="w-full text-sm">
              <caption className="sr-only">
                Bảng số liệu thay thế biểu đồ tròn chi tiêu
              </caption>

              <thead className="sr-only">
                <tr>
                  <th>Danh mục</th>
                  <th>Số tiền</th>
                </tr>
              </thead>

              <tbody>
                {pie.map((d) => (
                  <tr key={d.name}>
                    <th className="py-1.5 text-left font-medium">
                      <span
                        className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.name}
                    </th>

                    <td className="py-1.5 text-right font-semibold">
                      {formatVND(d.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* GIAO DỊCH VÀ MỤC TIÊU */}
      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <CardTitle>
                Giao dịch gần đây
              </CardTitle>

              <CardDescription className="mt-1">
                5 hoạt động mới nhất
              </CardDescription>
            </div>

            <Link
              className="inline-flex items-center gap-1 text-sm font-bold text-[#398190]"
              href="/transactions"
            >
              Xem tất cả
              <ArrowRight size={16} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <EmptyState title="Chưa có giao dịch" />
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {recent.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 py-3"
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      t.type === "INCOME"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {t.type === "INCOME" ? (
                      <ArrowUpRight size={20} />
                    ) : (
                      <ArrowDownRight size={20} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {t.description}
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {CATEGORY_NAMES[t.category]}
                      {" · "}
                      {t.date.toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  <span
                    className={`text-sm font-bold ${
                      t.type === "INCOME"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : ""
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "−"}
                    {formatVND(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <CardTitle>
                Mục tiêu của bạn
              </CardTitle>

              <CardDescription className="mt-1">
                Từng bước tiến gần hơn
              </CardDescription>
            </div>

            <Target
              size={20}
              className="text-[#4b98a6]"
            />
          </div>

          {wishlist.length === 0 ? (
            <EmptyState title="Chưa có mục tiêu tiết kiệm" />
          ) : (
            <div className="space-y-5">
              {wishlist.map((w) => {
                const progress = wishlistProgress(
                  totals.balance,
                  w.cost
                );
                const exactProgress = w.cost > 0
                  ? Math.min(100, Math.max(0, (totals.balance / w.cost) * 100))
                  : 0;
                const progressLabel = exactProgress > 0 && exactProgress < 1
                  ? exactProgress.toLocaleString("vi-VN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : String(progress);

                return (
                  <div key={w.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {w.name}
                      </p>

                      <Badge>
                        {progressLabel}%
                      </Badge>
                    </div>

                    <Progress value={progress} />

                    <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                      Mục tiêu: {formatVND(w.cost)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <Button
            variant="outline"
            className="mt-6 w-full"
            asChild
          >
            <Link href="/wishlist">
              <Plus size={16} />
              Quản lý wishlist
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
