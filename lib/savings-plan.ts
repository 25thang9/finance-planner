
export type SavingsPlan = {
  status: "completed" | "no-deadline" | "overdue" | "active";
  remaining: number;
  monthsLeft: number | null;
  perMonth: number | null;
};

export type SavingsPlanInput = {
  cost: number;
  currentBalance: number;
  deadline?: string | null;
  today: string;
};

function parseDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Ngày phải có định dạng YYYY-MM-DD");
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error("Ngày không hợp lệ");
  }

  return date;
}

export function calculateSavingsPlan({
  cost,
  currentBalance,
  deadline,
  today,
}: SavingsPlanInput): SavingsPlan {
  if (!Number.isSafeInteger(cost) || cost <= 0) {
    throw new Error("Giá mục tiêu phải là số nguyên dương");
  }

  if (!Number.isSafeInteger(currentBalance)) {
    throw new Error("Số dư phải là số nguyên");
  }

  const remaining = Math.max(
    0,
    cost - Math.max(0, currentBalance)
  );

  if (remaining === 0) {
    return {
      status: "completed",
      remaining: 0,
      monthsLeft: 0,
      perMonth: 0,
    };
  }

  if (!deadline) {
    return {
      status: "no-deadline",
      remaining,
      monthsLeft: null,
      perMonth: null,
    };
  }

  const currentDate = parseDate(today);
  const endDate = parseDate(deadline);

  if (endDate < currentDate) {
    return {
      status: "overdue",
      remaining,
      monthsLeft: 0,
      perMonth: null,
    };
  }

  let monthsLeft =
    (endDate.getUTCFullYear() -
      currentDate.getUTCFullYear()) *
      12 +
    (endDate.getUTCMonth() -
      currentDate.getUTCMonth());

  if (
    endDate.getUTCDate() >
    currentDate.getUTCDate()
  ) {
    monthsLeft += 1;
  }

  monthsLeft = Math.max(1, monthsLeft);

  return {
    status: "active",
    remaining,
    monthsLeft,
    perMonth: Math.ceil(remaining / monthsLeft),
  };
}
