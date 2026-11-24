
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { getCrossedMilestones } from "../lib/milestones";

const db = vi.hoisted(() => ({
  findMany: vi.fn(),
  createMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    wishlistItem: {
      findMany: db.findMany,
    },
    savingMilestone: {
      createMany: db.createMany,
    },
  },
}));

import { recordCrossedMilestones } from "../lib/data";

describe("Mốc tiết kiệm 50% - 75% - 100%", () => {
  it("Tăng 40% lên 55% đạt mốc 50%", () => {
    expect(
      getCrossedMilestones(400, 550, 1000)
    ).toEqual([50]);
  });

  it("Tăng 55% lên 80% đạt mốc 75%", () => {
    expect(
      getCrossedMilestones(550, 800, 1000)
    ).toEqual([75]);
  });

  it("Tăng 80% lên 100% đạt mốc 100%", () => {
    expect(
      getCrossedMilestones(800, 1000, 1000)
    ).toEqual([100]);
  });

  it("Tăng 40% lên 100% đạt cả ba mốc", () => {
    expect(
      getCrossedMilestones(400, 1000, 1000)
    ).toEqual([50, 75, 100]);
  });

  it("Không ghi mốc sớm do làm tròn phần trăm", () => {
    expect(
      getCrossedMilestones(400, 499, 1000)
    ).toEqual([]);

    expect(
      getCrossedMilestones(499, 500, 1000)
    ).toEqual([50]);
  });

  it("Không phát sinh mốc khi số dư giảm", () => {
    expect(
      getCrossedMilestones(800, 400, 1000)
    ).toEqual([]);
  });

  it("Không phát sinh mốc khi đã vượt 100%", () => {
    expect(
      getCrossedMilestones(1000, 1200, 1000)
    ).toEqual([]);
  });

  it("Không xử lý mục tiêu có chi phí không hợp lệ", () => {
    expect(
      getCrossedMilestones(0, 500, 0)
    ).toEqual([]);
  });
});

describe("Ghi nhận và chống lặp thông báo", () => {
  beforeEach(() => {
    db.findMany.mockReset();
    db.createMany.mockReset();

    db.findMany.mockResolvedValue([
      {
        id: "goal-1",
        name: "Laptop",
        cost: 1000,
      },
    ]);

    // Giả lập ràng buộc UNIQUE của database.
    const inserted = new Set<string>();

    db.createMany.mockImplementation(
      async (args: {
        data: {
          userId: string;
          wishlistId: string;
          milestone: number;
        }[];
        skipDuplicates: boolean;
      }) => {
        const row = args.data[0];

        const key = [
          row.userId,
          row.wishlistId,
          row.milestone,
        ].join(":");

        if (inserted.has(key)) {
          return { count: 0 };
        }

        inserted.add(key);

        return { count: 1 };
      }
    );
  });

  it("Ghi nhận và thông báo đủ ba mốc", async () => {
    const messages = await recordCrossedMilestones(
      "user-1",
      400,
      1000
    );

    expect(messages).toHaveLength(3);
    expect(messages[0]).toContain("50%");
    expect(messages[1]).toContain("75%");
    expect(messages[2]).toContain("100%");
    expect(db.createMany).toHaveBeenCalledTimes(3);
  });

  it("Không thông báo lại mốc đã ghi", async () => {
    const first = await recordCrossedMilestones(
      "user-1",
      400,
      600
    );

    const decrease = await recordCrossedMilestones(
      "user-1",
      600,
      400
    );

    const second = await recordCrossedMilestones(
      "user-1",
      400,
      600
    );

    expect(first).toHaveLength(1);
    expect(decrease).toEqual([]);
    expect(second).toEqual([]);
  });

  it("Theo dõi mốc riêng cho từng mục tiêu", async () => {
    db.findMany.mockResolvedValue([
      {
        id: "goal-1",
        name: "Laptop",
        cost: 1000,
      },
      {
        id: "goal-2",
        name: "Xe máy",
        cost: 2000,
      },
    ]);

    const messages = await recordCrossedMilestones(
      "user-1",
      400,
      1600
    );

    expect(messages).toHaveLength(5);
    expect(
      messages.filter((message) =>
        message.includes("Laptop")
      )
    ).toHaveLength(3);

    expect(
      messages.filter((message) =>
        message.includes("Xe máy")
      )
    ).toHaveLength(2);
  });

  it("Không truy vấn mục tiêu nếu số dư không tăng", async () => {
    const messages = await recordCrossedMilestones(
      "user-1",
      1000,
      500
    );

    expect(messages).toEqual([]);
    expect(db.findMany).not.toHaveBeenCalled();
    expect(db.createMany).not.toHaveBeenCalled();
  });
});
