
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { userBalance } from "@/lib/data";
import { WishlistManager } from "./wishlist-manager";

// Lấy ngày hiện tại theo múi giờ Việt Nam.
function getTodayInVietnam(): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(new Date());

  const getPart = (type: "year" | "month" | "day") =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}`;
}

export default async function WishlistPage() {
  const user = await requireUser();

  const [items, totals] = await Promise.all([
    prisma.wishlistItem.findMany({
      where: {
        userId: user.id,
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
    }),
    userBalance(user.id),
  ]);

  const today = getTodayInVietnam();

  return (
    <WishlistManager
      items={items.map((item) => ({
        id: item.id,
        name: item.name,
        cost: item.cost,
        priority: item.priority,
        deadline: item.deadline
          ? item.deadline.toISOString().slice(0, 10)
          : null,
      }))}
      balance={totals.balance}
      today={today}
    />
  );
}
