export function calculateACT(revenue, transactions) {
  return revenue / transactions;
}

export function calculateHourlyLaborPercent(
  hourlyLaborCost,
  revenue
) {
  return (hourlyLaborCost / revenue) * 100;
}

export function calculateCOGSPercent(cogs, revenue) {
  return (cogs / revenue) * 100;
}