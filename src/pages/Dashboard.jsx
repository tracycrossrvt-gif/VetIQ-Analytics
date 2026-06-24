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
import ProgressBar from '../components/ProgressBar'

import RevenueChart from '../components/RevenueChart'
import DataEntryForm from '../components/DataEntryForm'

function Dashboard() {
    const [selectedKPI, setSelectedKPI] = useState('revenue')
const [currentMonthData, setCurrentMonthData] = useState(monthlyData)
const [formData, setFormData] = useState(monthlyData)
function handleInputChange(event) {
  const { name, value } = event.target

   setFormData((previousData) => ({
    ...previousData,
    [name]: value === '' ? '' : Number(value),
  }))
}

function handleSubmit(event) {
  event.preventDefault()

  if (
  formData.revenue <= 0 ||
  formData.transactions <= 0 ||
  formData.totalBusinessDays <= 0
) {
  alert('Please enter valid values.')
  return
}
  setCurrentMonthData(formData)

  setIsUpdated(true)

  setTimeout(() => {
    setIsUpdated(false)
  }, 2000)
}

function handleReset() {
  setFormData(currentMonthData)
}

  const act = calculateACT(currentMonthData.revenue, currentMonthData.transactions)

  const hourlyLaborPercent = calculateHourlyLaborPercent(
    currentMonthData.hourlyLaborCost,
    currentMonthData.revenue
  )

  const cogsPercent = calculateCOGSPercent(
    currentMonthData.cogs,
    currentMonthData.revenue
  )

  const projectedRevenue = calculateProjectedRevenue(
  currentMonthData.revenue,
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
  newClients: currentMonthData.newClients,
  newClientGoal: practiceSettings.monthlyNewClientGoal,
})

const healthStatus = getHealthStatus(health.score)

const recommendations = getRecommendation(selectedKPI, {
  revenueVariance,
  act,
  actGoal: practiceSettings.actGoal,
  hourlyLaborPercent,
  hourlyLaborGoal: practiceSettings.hourlyLaborPercentGoal,
  cogsPercent,
  cogsGoal: practiceSettings.cogsPercentGoal,
  newClients: currentMonthData.newClients,
  newClientGoal: practiceSettings.monthlyNewClientGoal,
})

const revenueTrend = calculateRevenueTrend(historicalData)
const revenueTrendDirection =
  getTrendDirection(revenueTrend)

const revenueProgress = Math.round(
  (projectedRevenue / practiceSettings.monthlyRevenueGoal) * 100
)

const actProgress = Math.round(
  (act / practiceSettings.actGoal) * 100
)

const newClientProgress = Math.round(
  (currentMonthData.newClients / practiceSettings.monthlyNewClientGoal) * 100
)

const laborProgress = Math.round(
  (practiceSettings.hourlyLaborPercentGoal / hourlyLaborPercent) * 100
)

const cogsProgress = Math.round(
  (practiceSettings.cogsPercentGoal / cogsPercent) * 100
)  

const [isUpdated, setIsUpdated] = useState(false)

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
  value={`$${currentMonthData.revenue.toLocaleString()}`}
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
    value={currentMonthData.newClients}
    goal={`Goal: ${practiceSettings.monthlyNewClientGoal}`}
    status="healthy"
    onClick={() => setSelectedKPI('clients')}
  />
</div> 

<div className="progress-section">
  <h3>Goal Progress</h3>

  <div className="progress-grid">
    <ProgressBar
      label="Revenue Goal"
      value={`$${Math.round(projectedRevenue).toLocaleString()}`}
      target={`$${practiceSettings.monthlyRevenueGoal.toLocaleString()}`}
      percent={revenueProgress}
      helper="Projected month-end revenue"
    />

    <ProgressBar
      label="ACT Goal"
      value={`$${act.toFixed(0)}`}
      target={`$${practiceSettings.actGoal}`}
      percent={actProgress}
      helper="Current average client transaction"
    />

    <ProgressBar
      label="New Client Goal"
      value={currentMonthData.newClients}
      target={practiceSettings.monthlyNewClientGoal}
      percent={newClientProgress}
      helper="Month-to-date new clients"
    />

    <ProgressBar
      label="Hourly Labor Target"
      value={`${hourlyLaborPercent.toFixed(1)}%`}
      target={`${practiceSettings.hourlyLaborPercentGoal}%`}
      percent={laborProgress}
      helper="Higher progress means better labor control"
    />

    <ProgressBar
      label="COGS Target"
      value={`${cogsPercent.toFixed(1)}%`}
      target={`${practiceSettings.cogsPercentGoal}%`}
      percent={cogsProgress}
      helper="Higher progress means better COGS control"
    />
  </div>
</div>

<RevenueChart
  data={historicalData}
  goal={practiceSettings.monthlyRevenueGoal}
/>

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
        {currentMonthData.newClients}
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

<DataEntryForm
  formData={formData}
  onChange={handleInputChange}
  onSubmit={handleSubmit}
  isUpdated={isUpdated}
  onReset={handleReset} 
/>
      
    </section>
  )
}

export default Dashboard