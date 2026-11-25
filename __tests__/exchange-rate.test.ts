import { afterEach, describe, expect, it, vi } from "vitest";
import {
  convertToVnd,
  getExchangeRate,
  isForeignCurrency,
  parseExchangeRate,
} from "../lib/exchange-rate";

afterEach(() => vi.unstubAllGlobals());

const validPayload = {
  result: "success",
  base_code: "USD",
  rates: { VND: 25000.75 },
  time_last_update_utc: "Tue, 24 Nov 2026 00:00:01 +0000",
};

describe("Exchange rate (USD/EUR → VND)", () => {
  it("chỉ chấp nhận USD hoặc EUR", () => {
    expect(isForeignCurrency("USD")).toBe(true);
    expect(isForeignCurrency("EUR")).toBe(true);
    expect(isForeignCurrency("GBP")).toBe(false);
    expect(isForeignCurrency("usd")).toBe(false);
  });

  it("quy đổi đúng USD sang VND", () => {
    expect(convertToVnd(2, 25000.75)).toBe(50001.5);
  });

  it("chấp nhận số tiền bằng 0", () => {
    expect(convertToVnd(0, 27000)).toBe(0);
  });

  it("từ chối số tiền âm hoặc tỷ giá không hợp lệ", () => {
    expect(() => convertToVnd(-1, 25000)).toThrow();
    expect(() => convertToVnd(1, 0)).toThrow();
    expect(() => convertToVnd(Number.NaN, 25000)).toThrow();
  });

  it("trả về đúng dữ liệu tỷ giá và nguồn", () => {
    expect(parseExchangeRate(validPayload, "USD")).toMatchObject({
      currency: "USD", target: "VND", rate: 25000.75,
      source: "ExchangeRate-API",
      sourceUrl: "https://www.exchangerate-api.com",
    });
  });

  it("từ chối mã gốc và tỷ giá không hợp lệ", () => {
    expect(() => parseExchangeRate(validPayload, "EUR")).toThrow();
    expect(() => parseExchangeRate({ ...validPayload, rates: { VND: -1 } }, "USD")).toThrow();
  });

  it("sử dụng API USD với cấu hình cache 3600 giây", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => validPayload });
    vi.stubGlobal("fetch", fetchMock);
    await expect(getExchangeRate("USD")).resolves.toMatchObject({ rate: 25000.75 });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://open.er-api.com/v6/latest/USD",
      { next: { revalidate: 3600 } },
    );
  });

  it("trả lỗi khi nguồn API trả HTTP 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(getExchangeRate("EUR")).rejects.toThrow("HTTP 500");
  });
});
