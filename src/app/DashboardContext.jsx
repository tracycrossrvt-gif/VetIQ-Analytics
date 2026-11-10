import { createContext, useContext, useMemo, useState } from 'react'
import monthlyData from '../data/monthlyData'
import practiceSettings from '../data/practiceSettings'
import { calculateACT, calculateHourlyLaborPercent, calculateCOGSPercent } from '../utils/calculations'
import { calculateProjectedRevenue, calculateRevenueVariance } from '../utils/forecasting'
import { calculatePracticeHealthScore, getHealthStatus } from '../utils/healthScore'
import { getRecommendation } from '../utils/recommendations'

const KEY = 'vetiq-current-month-data'
const Context = createContext(null)
function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY))
    return parsed && typeof parsed === 'object' ? { ...monthlyData, ...parsed } : monthlyData
  } catch { return monthlyData }
}
export function DashboardProvider({ children }) {
  const [data, setData] = useState(load)
  const [savedAt, setSavedAt] = useState(null)
  const metrics = useMemo(() => {
    const act = calculateACT(data.revenue, data.transactions)
    const labor = calculateHourlyLaborPercent(data.hourlyLaborCost, data.revenue)
    const cogs = calculateCOGSPercent(data.cogs, data.revenue)
    const projectedRevenue = data.businessDaysElapsed > 0
      ? calculateProjectedRevenue(data.revenue, data.businessDaysElapsed, data.totalBusinessDays) : 0
    const revenueVariance = calculateRevenueVariance(projectedRevenue, practiceSettings.monthlyRevenueGoal)
    const health = calculatePracticeHealthScore({
      projectedRevenue, revenueGoal: practiceSettings.monthlyRevenueGoal,
      act, actGoal: practiceSettings.actGoal,
      hourlyLaborPercent: labor, hourlyLaborGoal: practiceSettings.hourlyLaborPercentGoal,
      cogsPercent: cogs, cogsGoal: practiceSettings.cogsPercentGoal,
      newClients: data.newClients, newClientGoal: practiceSettings.monthlyNewClientGoal,
    })
    // EBITDA margin requires a complete operating expense entry.
    // A missing field is intentionally NOT interpreted as zero.
    const hasOtherExpenses = data.otherOperatingExpenses !== '' &&
      data.otherOperatingExpenses !== null && data.otherOperatingExpenses !== undefined &&
      Number.isFinite(Number(data.otherOperatingExpenses))
    const ebitda = hasOtherExpenses
      ? data.revenue - data.cogs - data.hourlyLaborCost - data.salaryLaborCost - Number(data.otherOperatingExpenses)
      : null
    const ebitdaMargin = ebitda !== null && data.revenue > 0 ? ebitda / data.revenue * 100 : null
    const context = {
      revenueVariance, act, actGoal: practiceSettings.actGoal,
      hourlyLaborPercent: labor, hourlyLaborGoal: practiceSettings.hourlyLaborPercentGoal,
      cogsPercent: cogs, cogsGoal: practiceSettings.cogsPercentGoal,
      newClients: data.newClients, newClientGoal: practiceSettings.monthlyNewClientGoal,
    }
    return { act, labor, cogs, ebitda, ebitdaMargin, projectedRevenue, revenueVariance, health,
      healthStatus: getHealthStatus(health.score),
      recommend: (key) => getRecommendation(key, context) }
  }, [data])
  function save(next) {
    setData(next)
    localStorage.setItem(KEY, JSON.stringify(next))
    setSavedAt(new Date())
  }
  return <Context.Provider value={{ data, save, savedAt, settings: practiceSettings, ...metrics }}>{children}</Context.Provider>
}
export function useDashboard() {
  const value = useContext(Context)
  if (!value) throw new Error('DashboardProvider missing')
  return value
}
