
import "server-only";

import { prisma } from "@/lib/prisma";
import { getCrossedMilestones } from "@/lib/milestones";

export async function userBalance(userId: string) {
  const [income, expense] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: "INCOME",
      },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: "EXPENSE",
      },
    }),
  ]);

  const totalIncome = income._sum.amount ?? 0;
  const totalExpense = expense._sum.amount ?? 0;

  return {
    income: totalIncome,
    expense: totalExpense,
    balance: totalIncome - totalExpense,
  };
}

export async function recordCrossedMilestones(
  userId: string,
  before: number,
  after: number
): Promise<string[]> {
  // Số dư không tăng thì không có mốc mới.
  if (after <= before) {
    return [];
  }

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      cost: true,
    },
  });

  const messages: string[] = [];

  for (const item of wishlist) {
    const milestones = getCrossedMilestones(
      before,
      after,
      item.cost
    );

    for (const milestone of milestones) {
      const result = await prisma.savingMilestone.createMany({
        data: [
          {
            userId,
            wishlistId: item.id,
            milestone,
          },
        ],
        skipDuplicates: true,
      });

      // Chỉ hiện toast nếu mốc thực sự được ghi mới.
      if (result.count === 1) {
        messages.push(
          `Bạn đã tiết kiệm được ${milestone}% cho ${item.name}!`
        );
      }
    }
  }

  return messages;
}
