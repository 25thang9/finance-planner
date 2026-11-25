"use client";

import { useEffect, useMemo, useState } from "react";
import {
  convertToVnd,
  type ExchangeRate,
  type ForeignCurrency,
} from "@/lib/exchange-rate";

const VND_FORMAT = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const AMOUNT_FORMAT = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
});

const MONEY_SOURCE = "https://www.exchangerate-api.com";

type RateState = Partial<Record<ForeignCurrency, ExchangeRate>>;

export default function CurrencyConverter() {
  const [currency, setCurrency] = useState<ForeignCurrency>("USD");
  const [amountInput, setAmountInput] = useState("100");
  const [rates, setRates] = useState<RateState>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRates() {
      const results = await Promise.allSettled(
        (["USD", "EUR"] as const).map(async (code) => {
          const response = await fetch(`/api/exchange-rates?currency=${code}`, {
            cache: "no-store",
          });
          if (!response.ok) throw new Error(`Không thể lấy tỷ giá ${code}`);
          const data = (await response.json()) as ExchangeRate;
          if (data.currency !== code || !Number.isFinite(data.rate) || data.rate <= 0) {
            throw new Error(`Dữ liệu ${code} không hợp lệ`);
          }
          return data;
        }),
      );
      if (!active) return;
      const nextRates: RateState = {};
      for (const result of results) {
        if (result.status === "fulfilled") {
          nextRates[result.value.currency] = result.value;
        }
      }
      setRates(nextRates);
      setError(Object.keys(nextRates).length === 0 ? "Chưa tải được tỷ giá. Vui lòng tải lại trang." : "");
      setLoading(false);
    }

    void loadRates();
    return () => { active = false; };
  }, []);

  const amount = Number(amountInput);
  const amountIsValid = amountInput.trim() !== "" && Number.isFinite(amount) && amount >= 0;
  const rate = rates[currency];
  const converted = useMemo(() => {
    if (!rate || !amountIsValid) return null;
    try {
      return convertToVnd(amount, rate.rate);
    } catch {
      return null;
    }
  }, [amount, amountIsValid, rate]);

  return (
    <main className="mx-auto max-w-3xl space-y-6 pb-12">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Quy đổi tiền tệ
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Quy đổi USD hoặc EUR sang VND theo tỷ giá tham khảo. Dữ liệu được lưu cache 1 giờ.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Số tiền</span>
            <input
              type="number"
              min="0"
              step="any"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-lg text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              placeholder="Nhập số tiền"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Từ tiền tệ</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as ForeignCurrency)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-lg text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="USD">USD — Đô la Mỹ</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </label>
        </div>

        <div className="mt-6 rounded-xl border border-teal-100 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/40" aria-live="polite">
          <p className="text-sm font-medium text-teal-900 dark:text-teal-200">Số tiền quy đổi sang VND</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-teal-800 dark:text-teal-200">
            {loading ? "Đang tải tỷ giá…" : converted !== null ? VND_FORMAT.format(converted) : "—"}
          </p>
          {rate ? (
            <p className="mt-3 text-sm text-teal-900 dark:text-teal-200">
              1 {currency} = {AMOUNT_FORMAT.format(rate.rate)} VND
            </p>
          ) : null}
        </div>

        {!amountIsValid ? (
          <p className="mt-4 text-sm text-red-600" role="alert">Vui lòng nhập số tiền không âm, hợp lệ.</p>
        ) : null}
        {error ? <p className="mt-4 text-sm text-red-600" role="alert">{error}</p> : null}
        {!loading && !rate && !error ? (
          <p className="mt-4 text-sm text-amber-700 dark:text-amber-300" role="alert">
            Chưa lấy được tỷ giá {currency}. Vui lòng tải lại trang.
          </p>
        ) : null}
      </section>

      <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
        {rate ? `Dữ liệu gốc cập nhật: ${new Date(rate.updatedAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}. ` : ""}
        Tỷ giá chỉ mang tính tham khảo, không phải tỷ giá mua/bán của ngân hàng. Nguồn: {" "}
        <a href={MONEY_SOURCE} target="_blank" rel="noopener noreferrer" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
          Rates By Exchange Rate API
        </a>.
      </p>
    </main>
  );
}
