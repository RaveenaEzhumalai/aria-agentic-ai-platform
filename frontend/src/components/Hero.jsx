export default function Hero({ onScrollToDemo }) {
  return (
    <div style={styles.hero}>
      {/* Grid background */}
      <div style={styles.gridBg} />

      <div style={styles.content}>
        <div style={styles.badge}>⚡ Amazon Enterprise AI Platform · v2.4.1</div>

        <h1 style={styles.h1}>
          Intelligent Agents<br />
          that <em style={styles.em}>solve</em> Amazon's<br />
          real-time challenges
        </h1>

        <p style={styles.desc}>
          ARIA deploys 8 specialized autonomous agents — Supply Chain, Demand Forecaster,
          Fraud Sentinel, Cost Analyst, Inventory Rebalancer, Logistics Predictor,
          Review Authenticator, and Compliance Guardian — working in concert to eliminate
          operational losses and maximize profit at enterprise scale.
        </p>

        <div style={styles.stats}>
          {[
            { val: '$4.2M', label: 'Avg. Monthly Savings' },
            { val: '97.8%', label: 'Forecast Accuracy' },
            { val: '43ms',  label: 'Avg. Agent Response' },
            { val: '8',     label: 'Autonomous Agents' },
          ].map((s, i) => (
            <div key={i}>
              <div style={styles.statVal}>{s.val}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <button style={styles.btn} onClick={onScrollToDemo}>
          ▶ Launch Live Demo
        </button>
      </div>
    </div>
  )
}

const styles = {
  hero: { padding: '80px 48px 60px', position: 'relative', overflow: 'hidden' },
  gridBg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
    backgroundSize: '60px 60px',
    opacity: 0.4,
    maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
  },
  content: { position: 'relative', maxWidth: 900 },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    border: '1px solid var(--orange)', padding: '5px 14px', borderRadius: 4,
    fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--orange)',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 28,
    background: 'var(--orange-dim)',
  },
  h1: { fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, marginBottom: 24 },
  em: { fontStyle: 'normal', color: 'var(--orange)', fontFamily: 'var(--serif)', fontWeight: 300 },
  desc: { fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--muted)', lineHeight: 1.8, maxWidth: 640, marginBottom: 40 },
  stats: { display: 'flex', gap: 48, marginBottom: 40 },
  statVal: { fontSize: 32, fontWeight: 800, color: 'var(--orange)', letterSpacing: -1 },
  statLabel: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 },
  btn: {
    display: 'inline-flex', alignItems: 'center', gap: 10,
    background: 'var(--orange)', color: '#000', fontWeight: 700, fontSize: 14,
    padding: '14px 28px', borderRadius: 6, border: 'none', cursor: 'pointer',
    fontFamily: 'var(--sans)',
  },
}
