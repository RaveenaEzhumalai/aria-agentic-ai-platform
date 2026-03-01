import { useState, useEffect } from 'react'
import { checkHealth } from '../services/api'

export default function Navbar() {
  const [backendOnline, setBackendOnline] = useState(false)
  const [activeAgents, setActiveAgents] = useState(8)

  useEffect(() => {
    // Check backend health every 5 seconds
    const check = async () => {
      try {
        const data = await checkHealth()
        setBackendOnline(data.status === 'operational')
        setActiveAgents(data.agents_active || 8)
      } catch {
        setBackendOnline(false)
      }
    }
    check()
    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoMark}>A</div>
        <div>
          <div style={styles.logoText}>ARIA</div>
          <div style={styles.logoSub}>Agentic Retail Intelligence Architecture</div>
        </div>
      </div>

      {/* Right side */}
      <div style={styles.right}>
        <div style={{
          ...styles.statusPill,
          borderColor: backendOnline ? 'var(--teal)' : 'var(--red)',
          color: backendOnline ? 'var(--teal)' : 'var(--red)',
        }}>
          <div style={{
            ...styles.statusDot,
            background: backendOnline ? 'var(--teal)' : 'var(--red)',
            animation: 'blink 1.5s ease-in-out infinite'
          }} />
          {backendOnline ? 'All Systems Operational' : 'Backend Offline — Start server'}
        </div>
        <div style={styles.agentCount}>
          <span style={{ color: 'var(--orange)', fontWeight: 700 }}>{activeAgents}</span>
          &nbsp;Agents Active
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 48px',
    borderBottom: '1px solid var(--border)',
    position: 'sticky', top: 0,
    background: 'rgba(10,10,11,0.92)',
    backdropFilter: 'blur(20px)',
    zIndex: 100,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 36, height: 36,
    background: 'var(--orange)',
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 800, color: '#000',
    animation: 'logoPulse 3s ease-in-out infinite',
  },
  logoText: { fontSize: 18, fontWeight: 800, letterSpacing: -0.5 },
  logoSub: { fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase' },
  right: { display: 'flex', alignItems: 'center', gap: 24 },
  statusPill: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 14px',
    border: '1px solid',
    borderRadius: 100,
    fontFamily: 'var(--mono)', fontSize: 11,
  },
  statusDot: { width: 7, height: 7, borderRadius: '50%' },
  agentCount: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' },
}
