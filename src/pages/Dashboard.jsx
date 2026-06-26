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

import doctorData from '../data/doctorData'
import DoctorInsights from '../components/DoctorInsights'

import RevenueCategoryChart from '../components/RevenueCategoryChart'

import revenueCategoryData from '../data/revenueCategoryData'

import Footer from '../components/Footer'

const STORAGE_KEY = 'vetiq-current-month-data'

function Dashboard() {
    const [selectedKPI, setSelectedKPI] = useState('revenue')

    const savedData = JSON.parse(localStorage.getItem(STORAGE_KEY))

const [currentMonthData, setCurrentMonthData] = useState(
  savedData || monthlyData
)

const [formData, setFormData] = useState(
  savedData || monthlyData
)


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

localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))

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

const revenueStatus = revenueProgress >= 100 ? 'healthy' : revenueProgress >= 90 ? 'monitor' : 'action'

const actStatus = actProgress >= 100 ? 'healthy' : actProgress >= 95 ? 'monitor' : 'action'

const laborStatus =
  hourlyLaborPercent <= practiceSettings.hourlyLaborPercentGoal
    ? 'healthy'
    : hourlyLaborPercent <= practiceSettings.hourlyLaborPercentGoal * 1.05
      ? 'monitor'
      : 'action'

const cogsStatus =
  cogsPercent <= practiceSettings.cogsPercentGoal
    ? 'healthy'
    : cogsPercent <= practiceSettings.cogsPercentGoal * 1.05
      ? 'monitor'
      : 'action'

const newClientStatus =
  newClientProgress >= 100 ? 'healthy' : newClientProgress >= 75 ? 'monitor' : 'action'
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
  status={revenueStatus}
  onClick={() => setSelectedKPI('revenue')}
/>

  <KPICard
    title="ACT"
    value={`$${act.toFixed(0)}`}
    goal={`Goal: $${practiceSettings.actGoal}`}
    status={actStatus}
    onClick={() => setSelectedKPI('act')}
  />

  <KPICard
    title="Hourly Labor %"
    value={`${hourlyLaborPercent.toFixed(1)}%`}
    goal={`Goal: ${practiceSettings.hourlyLaborPercentGoal}%`}
    status={laborStatus}
    onClick={() => setSelectedKPI('labor')}
  />

  <KPICard
    title="COGS %"
    value={`${cogsPercent.toFixed(1)}%`}
    goal={`Goal: ${practiceSettings.cogsPercentGoal}%`}
    status={cogsStatus}
    onClick={() => setSelectedKPI('cogs')}
 />

  <KPICard
    title="New Clients"
    value={currentMonthData.newClients}
    goal={`Goal: ${practiceSettings.monthlyNewClientGoal}`}
    status={newClientStatus}
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
      onClick={() => setSelectedKPI('revenue')}
    />

    <ProgressBar
  label="ACT Goal"
  value={`$${act.toFixed(0)}`}
  target={`$${practiceSettings.actGoal}`}
  percent={actProgress}
  helper="Current average client transaction"
  onClick={() => setSelectedKPI('act')}
/>

    <ProgressBar
      label="Hourly Labor Goal"
      value={`${hourlyLaborPercent.toFixed(1)}%`}
      target={`${practiceSettings.hourlyLaborPercentGoal}%`}
      percent={laborProgress}
      helper="Higher progress means better labor control"
      onClick={() => setSelectedKPI('labor')}
    />

    <ProgressBar
      label="COGS Goal"
      value={`${cogsPercent.toFixed(1)}%`}
      target={`${practiceSettings.cogsPercentGoal}%`}
      percent={cogsProgress}
      helper="Higher progress means better COGS control"
      onClick={() => setSelectedKPI('cogs')}
/>

<ProgressBar
      label="New Client Goal"
      value={currentMonthData.newClients}
      target={practiceSettings.monthlyNewClientGoal}
      percent={newClientProgress}
      helper="Month-to-date new clients"
      onClick={() => setSelectedKPI('clients')}
    />
  </div>
</div>

<div className="drilldown-card">
 
{selectedKPI === 'revenue' && (
  <>
    <h3>Revenue Analysis</h3>

    <p>
      Revenue details have been expanded into the{' '}
      <strong>Revenue Intelligence</strong> section below.
    </p>

    <p>The Revenue Intelligence section includes:</p>

    <ul>
      <li>Revenue Forecast</li>
      <li>Revenue Trend</li>
      <li>Revenue Mix</li>
      <li>Revenue Recommendations</li>
    </ul>

    <p>
      Scroll down to review the complete revenue analysis.
    </p>
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



</div>

<div className="revenue-intelligence-card">
  <h3>Revenue Intelligence</h3>

  <div className="revenue-intelligence-grid">
    <div>
      <h4>Revenue Analysis</h4>

      <p>Score: {health.breakdown.revenue}/100</p>

      <p>
        Revenue is projected to finish{' '}
        ${Math.abs(revenueVariance).toLocaleString()}{' '}
        {revenueVariance < 0 ? 'below goal.' : 'above goal.'}
      </p>

      <p>
        Projected Revenue: ${projectedRevenue.toLocaleString()}
      </p>

      <p>
        Revenue Goal: ${practiceSettings.monthlyRevenueGoal.toLocaleString()}
      </p>

      <p>
        Revenue is {revenueTrendDirection} at {revenueTrend}% over the last{' '}
        {historicalData.length} months.
      </p>
    </div>

    <div>
      <h4>Revenue Forecast</h4>

      <p>Projected Revenue: ${projectedRevenue.toLocaleString()}</p>
      <p>Goal: ${practiceSettings.monthlyRevenueGoal.toLocaleString()}</p>
      <p>Variance: ${revenueVariance.toLocaleString()}</p>
    </div>
  </div>

  <RevenueCategoryChart categories={revenueCategoryData} />

  <RevenueChart
    data={historicalData}
    goal={practiceSettings.monthlyRevenueGoal}
  />

<div className="recommendation-list">
  <h4>Recommended Actions</h4>

  <ul>
    {getRecommendation('revenue', {
      revenueVariance,
      act,
      actGoal: practiceSettings.actGoal,
      hourlyLaborPercent,
      hourlyLaborGoal: practiceSettings.hourlyLaborPercentGoal,
      cogsPercent,
      cogsGoal: practiceSettings.cogsPercentGoal,
      newClients: currentMonthData.newClients,
      newClientGoal: practiceSettings.monthlyNewClientGoal,
    }).map((recommendation) => (
      <li key={recommendation}>{recommendation}</li>
    ))}
  </ul>
</div>

</div>


<DoctorInsights doctors={doctorData} />


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
    <Footer />  
    </section>
  )
}

export default Dashboard