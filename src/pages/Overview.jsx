import { useDashboard } from '../app/DashboardContext'
import { Heading, Stat, Panel, Actions, MetricRow, money } from '../app/UI'
export default function Overview() {
  const {data,settings,act,labor,cogs,projectedRevenue,health,healthStatus,recommend,ebitdaMargin} = useDashboard()
  const priority = [
    {name:'Revenue',bad:projectedRevenue<settings.monthlyRevenueGoal,route:'/revenue',note:'Projected month-end performance'},
    {name:'Hourly labor',bad:labor>settings.hourlyLaborPercentGoal,route:'/costs',note:'Hourly labor against target'},
    {name:'New clients',bad:data.newClients<settings.monthlyNewClientGoal,route:'/clients',note:'New-client acquisition'}
  ].filter(x=>x.bad)
  return <>
    <Heading eyebrow="PRACTICE PERFORMANCE" title="Practice overview" subtitle="Your most important numbers, without the noise." action={['/data-entry','Update data']}/>
    <section className="hero-panel">
      <div><p className="hero-eyebrow">PRACTICE HEALTH SCORE</p><div className="hero-score">{health.score}<span>/100</span></div><p className="hero-caption">Weighted score across revenue, ACT, labor, COGS and client growth</p></div>
      <div className={`health-pill ${healthStatus}`}>{healthStatus === 'healthy'?'On track':healthStatus==='monitor'?'Monitor performance':'Needs attention'}</div>
    </section>
    <div className="stats-grid">
      <Stat label="Revenue · MTD" value={money(data.revenue)} detail={`Monthly goal ${money(settings.monthlyRevenueGoal)}`} to="/revenue"/>
      <Stat label="Average client transaction" value={money(act)} detail={`Target ${money(settings.actGoal)}`} to="/revenue" tone={act>=settings.actGoal?'good':'warn'}/>
      <Stat label="Hourly labor" value={`${labor.toFixed(1)}%`} detail={`Target ≤ ${settings.hourlyLaborPercentGoal}%`} to="/costs" tone={labor<=settings.hourlyLaborPercentGoal?'good':'warn'}/>
      <Stat label="Cost of Goods" value={`${cogs.toFixed(1)}%`} detail={`Target ≤ ${settings.cogsPercentGoal}%`} to="/costs" tone={cogs<=settings.cogsPercentGoal?'good':'warn'}/>
      <Stat label="New clients" value={data.newClients.toLocaleString()} detail={`Monthly goal ${settings.monthlyNewClientGoal}`} to="/clients"/>
      <Stat label="EBITDA margin" value={ebitdaMargin === null ? 'Not set' : `${ebitdaMargin.toFixed(1)}%`} detail={ebitdaMargin === null ? 'Enter operating expenses to calculate' : 'Estimated from entered operating costs'} to="/costs"/>
    </div>
    <div className="two-columns">
      <Panel title="Month-end outlook" aside="Based on elapsed business days">
        <MetricRow label="Projected revenue" value={money(projectedRevenue)}/>
        <MetricRow label="Revenue goal" value={money(settings.monthlyRevenueGoal)}/>
        <MetricRow label="Projected variance" value={money(projectedRevenue-settings.monthlyRevenueGoal)}/>
        <p className="fine-print">Forecast is an estimate, not actual booked revenue.</p>
      </Panel>
      <Panel title="Where to focus">
        {priority.length ? <><p className="muted">Metrics requiring attention</p>{priority.map(p=><a className="focus-link" href={p.route} key={p.name}><span><strong>{p.name}</strong><small>{p.note}</small></span><span>→</span></a>)}</> : <p className="muted">The selected metrics are meeting their targets.</p>}
      </Panel>
    </div>
    <Panel title="Recommended next steps"><Actions items={[...recommend('revenue'),...recommend('labor')].slice(0,3)}/></Panel>
    <p className="data-note">Demo workspace. Current-month figures are editable and saved in this browser; historical, provider and category figures are separate sample datasets.</p>
  </>
}
