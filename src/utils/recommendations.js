export function getRecommendation(selectedKPI, data) {
  const {
    revenueVariance,
    act,
    actGoal,
    hourlyLaborPercent,
    hourlyLaborGoal,
    cogsPercent,
    cogsGoal,
    newClients,
    newClientGoal,
  } = data

  if (selectedKPI === 'revenue') {
    if (revenueVariance < 0) {
      return [
        'Review appointment availability and identify unused capacity.',
        'Look for ACT opportunities such as estimates, diagnostics, preventatives, and follow-up care.',
        'Review doctor production and schedule utilization.',
      ]
    }

    return ['Revenue is projected to meet or exceed goal. Continue monitoring daily pace.']
  }

  if (selectedKPI === 'act') {
    if (act < actGoal) {
      return [
        'Review estimate compliance and missed-charge patterns.',
        'Look for opportunities to improve preventive care and diagnostic acceptance.',
        'Coach teams on presenting complete treatment plans.',
      ]
    }

    return ['ACT is meeting goal. Continue monitoring transaction quality.']
  }

  if (selectedKPI === 'labor') {
    if (hourlyLaborPercent > hourlyLaborGoal) {
      return [
        'Review hourly schedule against revenue pace.',
        'Check for overtime risk or overstaffed shifts.',
        'Compare support staff coverage to doctor production.',
      ]
    }

    return ['Hourly labor is within target. Continue monitoring schedule efficiency.']
  }

  if (selectedKPI === 'cogs') {
    if (cogsPercent > cogsGoal) {
      return [
        'Review inventory purchasing trends and high-use products.',
        'Check for seasonal drivers such as dental month, allergy season, or preventatives.',
        'Audit potential shrinkage or missed charges.',
      ]
    }

    return ['COGS is within target. Continue monitoring product usage and purchasing patterns.']
  }

  if (selectedKPI === 'clients') {
    if (newClients < newClientGoal) {
      return [
        'Review referral sources and new-client acquisition trends.',
        'Identify local events or social opportunities to increase visibility.',
        'Consider outreach campaigns for lapsed clients and community partners.',
      ]
    }

    return ['New client growth is meeting goal. Continue tracking acquisition sources.']
  }

  return []
}