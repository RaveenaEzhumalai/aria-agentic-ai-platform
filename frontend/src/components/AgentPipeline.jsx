/**
 * AgentPipeline
 * ==============
 * Shows the 8 agents as nodes in a pipeline.
 * Updates in real time as analysis runs.
 */

const AGENTS = [
  { key: 'orchestrator', emoji: '🧠', label: 'Orchestrator', alwaysDone: true },
  { key: 'supply',       emoji: '📦', label: 'Supply Chain' },
  { key: 'demand',       emoji: '📈', label: 'Demand Forecast' },
  { key: 'fraud',        emoji: '🔒', label: 'Fraud Sentinel' },
  { key: 'cost',         emoji: '💰', label: 'Cost Analyst' },
  { key: 'inventory',    emoji: '🏭', label: 'Inventory AI' },
  { key: 'logistics',    emoji: '🚚', label: 'Logistics AI' },
  { key: 'compliance',   emoji: '🛡️', label: 'Compliance' },
]

export default function AgentPipeline({ agentStatuses, pipelineStatus }) {
  return (
    <div style={styles.wrapper}>
      {/* Scanning line animation */}
      <div style={styles.scanLine} />

      <div style={styles.header}>
        <div style={styles.title}>🔄 Orchestration Engine</div>
        <div style={styles.status}>{pipelineStatus || 'Awaiting Input Signal...'}</div>
      </div>

      <div style={styles.row}>
        {AGENTS.map((agent, i) => {
          const status = agent.alwaysDone ? 'done' : (agentStatuses[agent.key] || 'idle')
          return (
            <div key={agent.key} style={styles.nodeWrapper}>
              {/* Agent node */}
              <div style={{ ...styles.node, ...getNodeStyle(status) }}>
                {agent.emoji}
              </div>
              <div style={styles.label}>{agent.label}</div>
              <div style={{ ...styles.statusText, color: getStatusColor(status) }}>
                {status === 'done' ? '✓ Done' : status === 'running' ? 'Running' : 'Queued'}
              </div>

              {/* Connector after each node (except last) */}
              {i < AGENTS.length - 1 && (
                <div style={styles.connector}>
                  <div style={{
                    ...styles.dot,
                    animationDelay: `${i * 0.25}s`
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getNodeStyle(status) {
  if (status === 'done')    return { border: '2px solid var(--teal)', background: 'var(--teal-dim)' }
  if (status === 'running') return { border: '2px solid var(--orange)', animation: 'nodePulse 2s ease-in-out infinite' }
  return { border: '2px solid var(--border)', background: 'rgba(255,255,255,0.03)' }
}

function getStatusColor(status) {
  if (status === 'done')    return 'var(--teal)'
  if (status === 'running') return 'var(--orange)'
  return 'var(--muted)'
}

const styles = {
  wrapper: {
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 12, padding: 32, position: 'relative', overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
    background: 'linear-gradient(90deg, transparent, var(--orange), var(--teal), transparent)',
    animation: 'scan 3s linear infinite',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: { fontSize: 16, fontWeight: 700 },
  status: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--teal)' },
  row: {
    display: 'flex', alignItems: 'center',
    overflowX: 'auto', paddingBottom: 8,
    gap: 0,
  },
  nodeWrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    position: 'relative', minWidth: 100,
  },
  node: {
    width: 56, height: 56, borderRadius: 14,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, cursor: 'pointer', transition: 'all 0.3s',
  },
  label: {
    fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)',
    marginTop: 8, textAlign: 'center', letterSpacing: 0.3,
  },
  statusText: { fontSize: 9, marginTop: 3, textTransform: 'uppercase', letterSpacing: 1 },
  connector: {
    position: 'absolute', right: -30, top: 25,
    width: 30, height: 2, background: 'var(--border)',
  },
  dot: {
    width: 6, height: 6, borderRadius: '50%', background: 'var(--orange)',
    position: 'absolute', top: -2, animation: 'travel 2s linear infinite',
  },
}
