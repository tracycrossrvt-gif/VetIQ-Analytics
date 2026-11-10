import { useDashboard } from '../app/DashboardContext'
import { Heading, Stat, Panel, Actions, MetricRow } from '../app/UI'
import historicalData from '../data/historicalData'
export default function Clients() {
 const {data,settings,recommend}=useDashboard()
 const percent=settings.monthlyNewClientGoal?Math.round(data.newClients/settings.monthlyNewClientGoal*100):0
 return <><Heading eyebrow="PRACTICE GROWTH" title="Client growth" subtitle="Monitor new-client acquisition and discover where to focus."/>
 <div className="stats-grid stats-four">
  <Stat label="New clients · MTD" value={data.newClients} detail="Current-month actual"/>
  <Stat label="Monthly target" value={settings.monthlyNewClientGoal} detail="Practice-specific goal"/>
  <Stat label="Goal attainment" value={`${percent}%`} detail="Month-to-date versus full-month target"/>
 </div>
 <div className="two-columns">
 <Panel title="Progress toward target"><div className="progress-label"><span>New clients</span><strong>{data.newClients} / {settings.monthlyNewClientGoal}</strong></div><div className="wide-progress"><span style={{width:`${Math.max(0,Math.min(100,percent))}%`}}/></div><p className="fine-print">Month-to-date count compared with a full-month goal; this is not a pace-adjusted forecast.</p></Panel>
 <Panel title="Recommended actions"><Actions items={recommend('clients')}/></Panel>
 </div>
 <Panel title="Historical new-client counts" aside="Sample history"><div className="data-table-wrap"><table className="data-table"><thead><tr><th>Month</th><th>New clients</th></tr></thead><tbody>{historicalData.map(row=><tr key={row.month}><td>{row.month}</td><td>{row.newClients}</td></tr>)}</tbody></table></div></Panel>
 </>
}
