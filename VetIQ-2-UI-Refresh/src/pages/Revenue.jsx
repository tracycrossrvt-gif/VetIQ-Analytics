import { useDashboard } from '../app/DashboardContext'
import { Heading, Stat, Panel, Actions, MetricRow, money } from '../app/UI'
import RevenueChart from '../components/RevenueChart'
import RevenueCategoryChart from '../components/RevenueCategoryChart'
import historicalData from '../data/historicalData'
import revenueCategoryData from '../data/revenueCategoryData'
export default function Revenue() {
 const {data,settings,act,projectedRevenue,revenueVariance,recommend}=useDashboard()
 return <>
 <Heading eyebrow="FINANCIAL PERFORMANCE" title="Revenue intelligence" subtitle="Track revenue pace, understand trends and identify opportunities." action={['/data-entry','Update figures']}/>
 <div className="stats-grid stats-four">
  <Stat label="Revenue · MTD" value={money(data.revenue)} detail="Current-month actual"/>
  <Stat label="Month-end projection" value={money(projectedRevenue)} detail="Based on elapsed business days"/>
  <Stat label="Projected variance" value={money(revenueVariance)} detail={`Against ${money(settings.monthlyRevenueGoal)} goal`} tone={revenueVariance>=0?'good':'warn'}/>
  <Stat label="ACT" value={money(act)} detail={`Target ${money(settings.actGoal)}`}/>
 </div>
 <div className="two-columns revenue-columns">
  <Panel title="Historical revenue trend" aside="Sample history"><RevenueChart data={historicalData} goal={settings.monthlyRevenueGoal}/></Panel>
  <Panel title="Revenue by category" aside="Sample category data"><RevenueCategoryChart categories={revenueCategoryData}/></Panel>
 </div>
 <div className="two-columns">
  <Panel title="Revenue forecast"><MetricRow label="Revenue to date" value={money(data.revenue)}/><MetricRow label="Business days elapsed" value={data.businessDaysElapsed}/><MetricRow label="Business days in month" value={data.totalBusinessDays}/><MetricRow label="Projected month-end" value={money(projectedRevenue)}/><p className="fine-print">Linear pace estimate. Projection changes when business-day inputs change.</p></Panel>
  <Panel title="Recommended actions"><Actions items={recommend('revenue')}/></Panel>
 </div>
 <p className="data-note">Historical trend and category breakdown use independent demonstration datasets and do not automatically reconcile with current-month entries.</p>
 </>
}
