import { describe, expect, it } from "vitest";
import { getCrossedMilestones } from "@/lib/milestones";

describe("getCrossedMilestones - kiểm tra thông báo chúc mừng", () => {
  it("vượt 50% từ 19.221.000 lên 1.019.221.000 với mục tiêu 2 tỷ", () => {
    expect(getCrossedMilestones(19_221_000, 1_019_221_000, 2_000_000_000)).toEqual([50]);
  });
  it("vượt đồng thời 50% và 75%", () => {
    expect(getCrossedMilestones(200_000, 800_000, 1_000_000)).toEqual([50, 75]);
  });
  it("đạt đúng mốc 100%", () => {
    expect(getCrossedMilestones(950, 1000, 1000)).toEqual([100]);
  });
  it("không báo nếu số dư không tăng", () => {
    expect(getCrossedMilestones(1000, 900, 1000)).toEqual([]);
  });
  it("không báo nếu đã ở phía trên mốc trước giao dịch", () => {
    expect(getCrossedMilestones(600, 650, 1000)).toEqual([]);
  });
  it("không báo khi mục tiêu không hợp lệ", () => {
    expect(getCrossedMilestones(10, 100, 0)).toEqual([]);
  });
});
