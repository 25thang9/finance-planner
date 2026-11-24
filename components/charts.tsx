
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

import { ChartContainer } from "@/components/ui/chart";
import { formatVND } from "@/lib/finance";

type ExpenseItem = {
  name: string;
  value: number;
  color: string;
};

type MonthlyItem = {
  month: string;
  income: number;
  expense: number;
};

export function ExpensePie({
  data,
}: {
  data: ExpenseItem[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-[var(--muted-foreground)]">
        Chưa có chi tiêu tháng này
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        expense: {
          label: "Chi tiêu",
          color: "#5d99b0",
        },
      }}
    >
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          strokeWidth={0}
        >
          {data.map((item, index) => (
            <Cell key={index} fill={item.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatVND(Number(value))}
          contentStyle={{
            borderRadius: 12,
            borderColor: "#d8e5ed",
            color: "#233548",
          }}
        />
      </PieChart>
    </ChartContainer>
  );
}

export function TrendChart({
  data,
}: {
  data: MonthlyItem[];
}) {
  const totalIncome = data.reduce(
    (sum, item) => sum + item.income,
    0
  );

  const totalExpense = data.reduce(
    (sum, item) => sum + item.expense,
    0
  );

  return (
    <div className="min-w-0">
      <ChartContainer
        className="h-70"
        config={{
          income: {
            label: "Thu nhập",
            color: "#4b9e89",
          },
          expense: {
            label: "Chi tiêu",
            color: "#ef9f8e",
          },
        }}
      >
        <BarChart
          data={data}
          margin={{
            left: -12,
            right: 5,
            top: 15,
            bottom: 0,
          }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="#e3eaf0"
          />

          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{
              fontSize: 11,
              fill: "#8295a3",
            }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              `${Math.round(Number(value) / 1_000_000)}tr`
            }
            tick={{
              fontSize: 11,
              fill: "#8295a3",
            }}
          />

          <Tooltip
            formatter={(value) => formatVND(Number(value))}
            contentStyle={{
              borderRadius: 12,
              borderColor: "#d8e5ed",
              color: "#233548",
            }}
          />

          <Bar
            dataKey="income"
            name="Thu"
            fill="#4b9e89"
            radius={[5, 5, 0, 0]}
            maxBarSize={28}
          />

          <Bar
            dataKey="expense"
            name="Chi"
            fill="#ef9f8e"
            radius={[5, 5, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ChartContainer>

      {/* Chú giải nằm ngay dưới biểu đồ */}
      <div className="mt-3 flex justify-center gap-5 text-xs text-[var(--muted-foreground)]">
        <span className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full bg-[#4b9e89]"
            aria-hidden="true"
          />
          Thu nhập
        </span>

        <span className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full bg-[#ef9f8e]"
            aria-hidden="true"
          />
          Chi tiêu
        </span>
      </div>

      {/* Bảng số liệu nằm dưới chú giải */}
      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold">
          Chi tiết thu chi 6 tháng
        </h3>

        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[450px] text-xs">
            <caption className="sr-only">
              Bảng thu nhập, chi tiêu và chênh lệch
              theo từng tháng
            </caption>

            <thead className="bg-[var(--muted)]">
              <tr>
                <th
                  scope="col"
                  className="px-3 py-3 text-left font-semibold"
                >
                  Tháng
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right font-semibold"
                >
                  Thu
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right font-semibold"
                >
                  Chi
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-right font-semibold"
                >
                  Chênh lệch
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => {
                const difference =
                  item.income - item.expense;

                return (
                  <tr
                    key={`${item.month}-${index}`}
                    className="border-t border-[var(--border)]"
                  >
                    <th
                      scope="row"
                      className="px-3 py-3 text-left font-medium"
                    >
                      {item.month}
                    </th>

                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatVND(item.income)}
                    </td>

                    <td className="px-3 py-3 text-right tabular-nums">
                      {formatVND(item.expense)}
                    </td>

                    <td
                      className={`px-3 py-3 text-right font-semibold tabular-nums ${
                        difference > 0
                          ? "text-emerald-700 dark:text-emerald-400"
                          : difference < 0
                            ? "text-rose-600 dark:text-rose-400"
                            : ""
                      }`}
                    >
                      {formatVND(difference)}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot className="border-t border-[var(--border)] bg-[var(--muted)]/40 font-bold">
              <tr>
                <th
                  scope="row"
                  className="px-3 py-3 text-left"
                >
                  Tổng
                </th>

                <td className="px-3 py-3 text-right tabular-nums">
                  {formatVND(totalIncome)}
                </td>

                <td className="px-3 py-3 text-right tabular-nums">
                  {formatVND(totalExpense)}
                </td>

                <td className="px-3 py-3 text-right tabular-nums">
                  {formatVND(totalIncome - totalExpense)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          Chênh lệch = Thu nhập − Chi tiêu.
          Bảng sử dụng cùng dữ liệu với biểu đồ phía trên.
        </p>
      </div>
    </div>
  );
}
