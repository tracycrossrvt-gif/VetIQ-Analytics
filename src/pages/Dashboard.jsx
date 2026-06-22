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

  return (
    <section className="dashboard">
      <p className="eyebrow">{practiceSettings.practiceName}</p>
      <h1>Practice Health Dashboard</h1>

      
       <div className="kpi-grid">
  <KPICard
    title="Revenue MTD"
    value={`$${monthlyData.revenue.toLocaleString()}`}
    goal={`Goal: $${practiceSettings.monthlyRevenueGoal.toLocaleString()}`}
    status="monitor"
  />

  <KPICard
    title="ACT"
    value={`$${act.toFixed(0)}`}
    goal={`Goal: $${practiceSettings.actGoal}`}
    status="healthy"
  />

  <KPICard
    title="Hourly Labor %"
    value={`${hourlyLaborPercent.toFixed(1)}%`}
    goal={`Goal: ${practiceSettings.hourlyLaborPercentGoal}%`}
    status="monitor"
  />

  <KPICard
    title="COGS %"
    value={`${cogsPercent.toFixed(1)}%`}
    goal={`Goal: ${practiceSettings.cogsPercentGoal}%`}
    status="healthy"
 />

  <KPICard
    title="New Clients"
    value={monthlyData.newClients}
    goal={`Goal: ${practiceSettings.monthlyNewClientGoal}`}
    status="healthy"
  />
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