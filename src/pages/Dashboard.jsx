import practiceSettings from '../data/practiceSettings'
import monthlyData from '../data/monthlyData'
import {
  calculateACT,
  calculateHourlyLaborPercent,
  calculateCOGSPercent,
} from '../utils/calculations'

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

  return (
    <section className="dashboard">
      <p className="eyebrow">{practiceSettings.practiceName}</p>
      <h1>Practice Health Dashboard</h1>

      <div className="kpi-grid">
        <div className="kpi-card">
          <p>Revenue MTD</p>
          <h2>${monthlyData.revenue.toLocaleString()}</h2>
          <span>Goal: ${practiceSettings.monthlyRevenueGoal.toLocaleString()}</span>
        </div>

        <div className="kpi-card">
          <p>ACT</p>
          <h2>${act.toFixed(0)}</h2>
          <span>Goal: ${practiceSettings.actGoal}</span>
        </div>

        <div className="kpi-card">
          <p>Hourly Labor %</p>
          <h2>{hourlyLaborPercent.toFixed(1)}%</h2>
          <span>Goal: {practiceSettings.hourlyLaborPercentGoal}%</span>
        </div>

        <div className="kpi-card">
          <p>COGS %</p>
          <h2>{cogsPercent.toFixed(1)}%</h2>
          <span>Goal: {practiceSettings.cogsPercentGoal}%</span>
        </div>

        <div className="kpi-card">
          <p>New Clients</p>
          <h2>{monthlyData.newClients}</h2>
          <span>Goal: {practiceSettings.monthlyNewClientGoal}</span>
        </div>
      </div>
    </section>
  )
}

export default Dashboard