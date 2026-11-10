import { Link } from 'react-router-dom'
export const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number.isFinite(n)?n:0)
export function Heading({eyebrow,title,subtitle,action}) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>{action && <Link className="primary-link" to={action[0]}>{action[1]} <span aria-hidden="true">→</span></Link>}</div>
}
export function Stat({label,value,detail,tone='neutral',to}) {
  const content=<><div className="stat-label">{label}<span className={`tone-dot ${tone}`}/></div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></>
  return to?<Link className="stat-card stat-link" to={to}>{content}<span className="stat-arrow">↗</span></Link>:<div className="stat-card">{content}</div>
}
export function Panel({title,children,aside}) {
  return <section className="panel"><div className="panel-heading"><h2>{title}</h2>{aside && <span>{aside}</span>}</div>{children}</section>
}
export function Actions({items}) {
  return <ul className="action-list">{items.map((a,i)=><li key={i}><span className="action-number">{String(i+1).padStart(2,'0')}</span><span>{a}</span></li>)}</ul>
}
export function MetricRow({label,value}) {return <div className="metric-row"><span>{label}</span><strong>{value}</strong></div>}
