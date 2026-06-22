export function calculateProjectedRevenue(
  revenue,
  businessDaysElapsed,
  totalBusinessDays
) {
  return (
    revenue / businessDaysElapsed
  ) * totalBusinessDays
}

export function calculateRevenueVariance(
  projectedRevenue,
  revenueGoal
) {
  return projectedRevenue - revenueGoal
}