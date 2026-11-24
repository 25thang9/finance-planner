
export type BudgetStatus =
  | "safe"
  | "warning"
  | "limit"
  | "over";

export type BudgetInsight = {
  status: BudgetStatus;
  percent: number;
  remaining: number;
  exceededBy: number;
};

export function getBudgetInsight(
  spent: number,
  amount: number
): BudgetInsight {
  if (
    !Number.isFinite(spent) ||
    !Number.isFinite(amount) ||
    spent < 0 ||
    amount <= 0
  ) {
    throw new Error("Dữ liệu ngân sách không hợp lệ");
  }

  const percent =
    Math.floor((spent / amount) * 1000) / 10;

  const remaining = Math.max(0, amount - spent);
  const exceededBy = Math.max(0, spent - amount);

  let status: BudgetStatus = "safe";

  if (spent > amount) {
    status = "over";
  } else if (spent === amount) {
    status = "limit";
  } else if (spent * 5 >= amount * 4) {
    status = "warning";
  }

  return {
    status,
    percent,
    remaining,
    exceededBy,
  };
}
