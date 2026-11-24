
export const SAVING_MILESTONES = [50, 75, 100] as const;

export function getCrossedMilestones(
  before: number,
  after: number,
  cost: number
): number[] {
  if (
    !Number.isFinite(before) ||
    !Number.isFinite(after) ||
    !Number.isFinite(cost) ||
    cost <= 0 ||
    after <= before
  ) {
    return [];
  }

  return SAVING_MILESTONES.filter((milestone) => {
    const thresholdAmount = (cost * milestone) / 100;

    return (
      before < thresholdAmount &&
      after >= thresholdAmount
    );
  });
}
