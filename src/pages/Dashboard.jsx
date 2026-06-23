import practiceSettings from '../data/practiceSettings'
import monthlyData from '../data/monthlyData'
import {
  calculateACT,
  calculateHourlyLaborPercent,
  calculateCOGSPercent,
} from '../utils/calculations'
import KPICard from '../components/KPICard'
import {
  calculateProjectedRevenue,
  calculateRevenueVariance,
} from '../utils/forecasting'
import {
  calculatePracticeHealthScore,
  getHealthStatus,
} from '../utils/healthScore'
import { useState } from 'react'
import { getRecommendation } from '../utils/recommendations'
import historicalData from '../data/historicalData'
import {
  calculateRevenueTrend,
  getTrendDirection,
} from '../utils/trends'


function Dashboard() {
  const act = calculateACT(monthlyData.revenue, monthlyData.transactions)

  const hourlyLaborPercent = calculateHourlyLaborPercent(
    monthlyData.hourlyLaborCost,
    monthlyData.revenue
  )

  const cogsPercent = calculateCOGSPercent(
    monthlyData.cogs,
    monthlyData.revenue
  )

  const projectedRevenue = calculateProjectedRevenue(
  monthlyData.revenue,
  monthlyData.businessDaysElapsed,
  monthlyData.totalBusinessDays
)

const revenueVariance = calculateRevenueVariance(
  projectedRevenue,
  practiceSettings.monthlyRevenueGoal
)

const health = calculatePracticeHealthScore({
  projectedRevenue,
  revenueGoal: practiceSettings.monthlyRevenueGoal,
  act,
  actGoal: practiceSettings.actGoal,
  hourlyLaborPercent,
  hourlyLaborGoal: practiceSettings.hourlyLaborPercentGoal,
  cogsPercent,
  cogsGoal: practiceSettings.cogsPercentGoal,
  newClients: monthlyData.newClients,
  newClientGoal: practiceSettings.monthlyNewClientGoal,
})

const healthStatus = getHealthStatus(health.score)

const [selectedKPI, setSelectedKPI] = useState('revenue')

const recommendations = getRecommendation(selectedKPI, {
  revenueVariance,
  act,
  actGoal: practiceSettings.actGoal,
  hourlyLaborPercent,
  hourlyLaborGoal: practiceSettings.hourlyLaborPercentGoal,
  cogsPercent,
  cogsGoal: practiceSettings.cogsPercentGoal,
  newClients: monthlyData.newClients,
  newClientGoal: practiceSettings.monthlyNewClientGoal,
})

const revenueTrend = calculateRevenueTrend(historicalData)
const revenueTrendDirection =
  getTrendDirection(revenueTrend)

  return (
    <section className="dashboard">
      <p className="eyebrow">{practiceSettings.practiceName}</p>
      <h1>Practice Health Dashboard</h1>
    <div className="health-score-card">
  <div>
    <p>Practice Health Score</p>
    <h2>{health.score}/100</h2>
  </div>

  <span className={`status-badge ${healthStatus}`}>
    {healthStatus}
  </span>
</div>
     
       <div className="kpi-grid">
 <KPICard
  title="Revenue MTD"
  value={`$${monthlyData.revenue.toLocaleString()}`}
  goal={`Goal: $${practiceSettings.monthlyRevenueGoal.toLocaleString()}`}
  status="monitor"
  onClick={() => setSelectedKPI('revenue')}
/>

  <KPICard
    title="ACT"
    value={`$${act.toFixed(0)}`}
    goal={`Goal: $${practiceSettings.actGoal}`}
    status="healthy"
    onClick={() => setSelectedKPI('act')}
  />

  <KPICard
    title="Hourly Labor %"
    value={`${hourlyLaborPercent.toFixed(1)}%`}
    goal={`Goal: ${practiceSettings.hourlyLaborPercentGoal}%`}
    status="monitor"
    onClick={() => setSelectedKPI('labor')}
  />

  <KPICard
    title="COGS %"
    value={`${cogsPercent.toFixed(1)}%`}
    goal={`Goal: ${practiceSettings.cogsPercentGoal}%`}
    status="healthy"
    onClick={() => setSelectedKPI('cogs')}
 />

  <KPICard
    title="New Clients"
    value={monthlyData.newClients}
    goal={`Goal: ${practiceSettings.monthlyNewClientGoal}`}
    status="healthy"
    onClick={() => setSelectedKPI('clients')}
  />
</div> 
<div className="drilldown-card">
 
  {selectedKPI === 'revenue' && (
  <>
    <h3>Revenue Analysis</h3>
    <p>
  Score: {health.breakdown.revenue}/100
</p>

    <p>
      Revenue is projected to finish
      {' '}
      ${Math.abs(revenueVariance).toLocaleString()}
      {' '}
      {revenueVariance < 0
        ? 'below goal.'
        : 'above goal.'}
    </p>

    <p>
      Projected Revenue:
      ${projectedRevenue.toLocaleString()}
    </p>

    <p>
      Revenue Goal:
      ${practiceSettings.monthlyRevenueGoal.toLocaleString()}
    </p>

    <p>
  Revenue is {revenueTrendDirection} at{' '}
  {revenueTrend}% over the last{' '}
  {historicalData.length} months.
</p>

<p>
  {revenueTrendDirection === 'declining' &&
    'Revenue is trending below historical performance and may require intervention.'}

  {revenueTrendDirection === 'stable' &&
    'Revenue is relatively stable compared to recent historical performance.'}

  {revenueTrendDirection === 'improving' &&
    'Revenue growth is trending positively compared to historical performance.'}
</p>

      <h4>Revenue Trend</h4>

<ul className="trend-list">
  {historicalData.map((month) => (
    <li key={month.month}>
      <span>{month.month}</span>
      <strong>${month.revenue.toLocaleString()}</strong>
    </li>
  ))}
</ul>

  </>
)}

  {selectedKPI === 'act' && (
    <>
      <h3>ACT Analysis</h3>
      <p>Score: {health.breakdown.act}/100</p>

      <p>
        Current ACT:
        ${act.toFixed(0)}
      </p>

      <p>
        Goal ACT:
        ${practiceSettings.actGoal}
      </p>
    </>
  )}

  {selectedKPI === 'labor' && (
    <>
      <h3>Labor Analysis</h3>
        <p>Score: {health.breakdown.labor}/100</p>
      <p>
        Hourly Labor:
        {hourlyLaborPercent.toFixed(1)}%
      </p>

      <p>
        Goal:
        {practiceSettings.hourlyLaborPercentGoal}%
      </p>
    </>
  )}

  {selectedKPI === 'cogs' && (
    <>
      <h3>COGS Analysis</h3>
       <p>Score: {health.breakdown.cogs}/100</p> 
      <p>
        Current COGS:
        {cogsPercent.toFixed(1)}%
      </p>

      <p>
        Goal:
        {practiceSettings.cogsPercentGoal}%
      </p>
    </>
  )}

  {selectedKPI === 'clients' && (
    <>
      <h3>New Client Analysis</h3>
       <p>Score: {health.breakdown.newClients}/100</p> 
      <p>
        Current:
        {monthlyData.newClients}
      </p>

      <p>
        Goal:
        {practiceSettings.monthlyNewClientGoal}
      </p>
    </>
  )}

<div className="recommendation-list">
  <h4>Recommended Actions</h4>

  <ul>
    {recommendations.map((recommendation) => (
      <li key={recommendation}>{recommendation}</li>
    ))}
  </ul>
</div>

</div>
<div className="forecast-card">
  <h3>Revenue Forecast</h3>

  <p>
    Projected Revenue:
    ${projectedRevenue.toLocaleString()}
  </p>

  <p>
    Goal:
    ${practiceSettings.monthlyRevenueGoal.toLocaleString()}
  </p>

  <p>
    Variance:
    ${revenueVariance.toLocaleString()}
  </p>
</div>
      
    </section>
  )
}

export default Dashboard