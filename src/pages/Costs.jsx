import { useDashboard } from '../app/DashboardContext'
import { Heading, Stat, Panel, Actions, MetricRow, money } from '../app/UI'
export default function Costs() {
 const {data,settings,labor,cogs,recommend,ebitdaMargin,ebitda}=useDashboard()
 const salaryPct=data.revenue?data.salaryLaborCost/data.revenue*100:0
 return <><Heading eyebrow="COST CONTROL" title="Cost & labor" subtitle="Keep staffing and supply costs in view, with practical next steps."/>
 <div className="stats-grid stats-four">
 <Stat label="Hourly labor" value={`${labor.toFixed(1)}%`} detail={`Goal ≤ ${settings.hourlyLaborPercentGoal}%`} tone={labor<=settings.hourlyLaborPercentGoal?'good':'warn'}/>
 <Stat label="Cost of Goods" value={`${cogs.toFixed(1)}%`} detail={`Goal ≤ ${settings.cogsPercentGoal}%`} tone={cogs<=settings.cogsPercentGoal?'good':'warn'}/>
 <Stat label="Hourly labor cost" value={money(data.hourlyLaborCost)} detail="Current month"/>
 <Stat label="Salaried labor" value={money(data.salaryLaborCost)} detail={`${salaryPct.toFixed(1)}% of current revenue`}/>
 </div>
 <Panel title="Estimated EBITDA margin" aside="Current month">
   <div className="profit-number">{ebitdaMargin === null ? 'Not available' : `${ebitdaMargin.toFixed(1)}%`}</div>
   <p className="fine-print">{ebitdaMargin === null ? 'Enter all other operating expenses on the Data Entry page to enable this estimate.' : `Estimated EBITDA ${money(ebitda)}. Revenue less COGS, hourly labor, salaried labor and other operating expenses.`}</p>
   <p className="fine-print">This estimate assumes all relevant operating expenses are included and excludes interest, taxes, depreciation and amortization. It is not an accounting-verified EBITDA figure.</p>
 </Panel>
 <div className="two-columns">
 <Panel title="Labor breakdown"><MetricRow label="Hourly labor cost" value={money(data.hourlyLaborCost)}/><MetricRow label="Salaried labor cost" value={money(data.salaryLaborCost)}/><MetricRow label="Combined labor cost" value={money(data.hourlyLaborCost+data.salaryLaborCost)}/><MetricRow label="Hourly labor rate" value={`${labor.toFixed(1)}%`}/><p className="fine-print">Hourly labor target does not include salaried labor.</p></Panel>
 <Panel title="Labor recommendations"><Actions items={recommend('labor')}/></Panel>
 <Panel title="Cost of Goods"><MetricRow label="COGS spend" value={money(data.cogs)}/><MetricRow label="COGS as % of revenue" value={`${cogs.toFixed(1)}%`}/><MetricRow label="Target" value={`${settings.cogsPercentGoal}%`}/></Panel>
 <Panel title="COGS recommendations"><Actions items={recommend('cogs')}/></Panel>
 </div>
 </>
}
