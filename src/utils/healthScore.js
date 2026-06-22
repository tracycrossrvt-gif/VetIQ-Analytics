function scoreHigherIsBetter(actual, goal) {
  const percentOfGoal = actual / goal

  if (percentOfGoal >= 1) return 100
  if (percentOfGoal >= 0.95) return 85
  if (percentOfGoal >= 0.9) return 70
  return 50
}

function scoreLowerIsBetter(actual, goal) {
  if (actual <= goal) return 100
  if (actual <= goal * 1.05) return 85
  if (actual <= goal * 1.1) return 70
  return 50
}

export function calculatePracticeHealthScore({
  projectedRevenue,
  revenueGoal,
  act,
  actGoal,
  hourlyLaborPercent,
  hourlyLaborGoal,
  cogsPercent,
  cogsGoal,
  newClients,
  newClientGoal,
}) {
  const scores = {
    revenue: scoreHigherIsBetter(projectedRevenue, revenueGoal),
    act: scoreHigherIsBetter(act, actGoal),
    labor: scoreLowerIsBetter(hourlyLaborPercent, hourlyLaborGoal),
    cogs: scoreLowerIsBetter(cogsPercent, cogsGoal),
    newClients: scoreHigherIsBetter(newClients, newClientGoal),
  }

  const weightedScore =
    scores.revenue * 0.35 +
    scores.act * 0.2 +
    scores.labor * 0.2 +
    scores.cogs * 0.15 +
    scores.newClients * 0.1

  return {
    score: Math.round(weightedScore),
    breakdown: scores,
  }
}

export function getHealthStatus(score) {
  if (score >= 90) return 'healthy'
  if (score >= 75) return 'monitor'
  return 'action'
}