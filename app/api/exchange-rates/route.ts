import { NextRequest, NextResponse } from "next/server";
import { getExchangeRate, isForeignCurrency } from "@/lib/exchange-rate";

export async function GET(request: NextRequest) {
  const currency = request.nextUrl.searchParams.get("currency")?.toUpperCase();

  if (!isForeignCurrency(currency)) {
    return NextResponse.json(
      { error: "Tiền tệ không hợp lệ. Chỉ hỗ trợ USD và EUR." },
      { status: 400 },
    );
  }

  try {
    const data = await getExchangeRate(currency);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Không thể lấy tỷ giá. Vui lòng thử lại sau." },
      { status: 502 },
    );
  }
}
