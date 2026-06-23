export function calculateRevenueTrend(data) {
  const firstMonth = data[0].revenue
  const lastMonth = data[data.length - 1].revenue

  return Number(
    (((lastMonth - firstMonth) / firstMonth) * 100).toFixed(1)
  )
}

export function getTrendDirection(trend) {
  if (trend > 2) return 'improving'
  if (trend < -2) return 'declining'
  return 'stable'
}