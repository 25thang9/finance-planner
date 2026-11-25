export type ForeignCurrency = "USD" | "EUR";

export type ExchangeRate = {
  currency: ForeignCurrency;
  target: "VND";
  rate: number;
  updatedAt: string;
  source: "ExchangeRate-API";
  sourceUrl: "https://www.exchangerate-api.com";
};

const SOURCE_URL = "https://www.exchangerate-api.com" as const;

export function isForeignCurrency(value: unknown): value is ForeignCurrency {
  return value === "USD" || value === "EUR";
}

export function convertToVnd(amount: number, rate: number): number {
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(rate) || rate <= 0) {
    throw new RangeError("Số tiền hoặc tỷ giá không hợp lệ.");
  }
  const converted = amount * rate;
  if (!Number.isFinite(converted)) {
    throw new RangeError("Số tiền quy đổi vượt giới hạn.");
  }
  return converted;
}

export function parseExchangeRate(data: unknown, currency: ForeignCurrency): ExchangeRate {
  if (!data || typeof data !== "object") {
    throw new Error("Dữ liệu tỷ giá không hợp lệ.");
  }

  const payload = data as Record<string, unknown>;
  const rates = payload.rates;
  const rate =
    rates && typeof rates === "object"
      ? (rates as Record<string, unknown>).VND
      : undefined;
  const updatedAt = payload.time_last_update_utc;

  if (
    payload.result !== "success" ||
    payload.base_code !== currency ||
    typeof rate !== "number" ||
    !Number.isFinite(rate) ||
    rate <= 0 ||
    typeof updatedAt !== "string" ||
    !Number.isFinite(Date.parse(updatedAt))
  ) {
    throw new Error("Dữ liệu tỷ giá không hợp lệ.");
  }

  return {
    currency,
    target: "VND",
    rate,
    updatedAt,
    source: "ExchangeRate-API",
    sourceUrl: SOURCE_URL,
  };
}

export async function getExchangeRate(currency: ForeignCurrency): Promise<ExchangeRate> {
  const response = await fetch(`https://open.er-api.com/v6/latest/${currency}`, {
    next: { revalidate: 3600 }, // Cache Next.js Data Cache: 1 giờ
  });
  if (!response.ok) {
    throw new Error(`Không thể lấy tỷ giá (HTTP ${response.status}).`);
  }
  return parseExchangeRate(await response.json(), currency);
}
