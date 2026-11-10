import { NavLink, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useDashboard } from './DashboardContext'
const links = [
  ['/', 'Overview', '▦'], ['/revenue', 'Revenue Intelligence', '↗'],
  ['/doctors', 'Doctor Insights', '✚'], ['/clients', 'Client Growth', '♙'],
  ['/costs', 'Cost & Labor', '◫'], ['/data-entry', 'Data Entry', '✎']
]
export default function AppLayout() {
  const [open, setOpen] = useState(false)
  const { settings } = useDashboard()
  return <div className="shell">
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark">✚</span><div><strong>VetIQ</strong><small>ANALYTICS</small></div></div>
      <p className="nav-caption">WORKSPACE</p>
      <nav aria-label="Main navigation">{links.map(([to, label, symbol]) =>
        <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}
          className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
          <span aria-hidden="true" className="nav-symbol">{symbol}</span>{label}
        </NavLink>)}</nav>
      <div className="sidebar-bottom"><span className="demo-dot"/> Demo workspace <small>VetIQ Analytics · v2 preview</small></div>
    </aside>
    {open && <button className="backdrop" onClick={() => setOpen(false)} aria-label="Close navigation"/>}
    <div className="workspace">
      <header className="topbar">
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>☰</button>
        <span className="practice-name">{settings.practiceName}</span>
        <span className="topbar-pill">Sample practice data</span>
      </header>
      <main className="page-content"><Outlet/></main>
    </div>
  </div>
}
