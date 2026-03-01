/**
 * AnalysisForm
 * =============
 * Left panel: scenario selector + JSON input + run button
 * Right panel: live agent activity log
 */

import { useState, useEffect, useRef } from 'react'
import { getScenarios } from '../services/api'

export default function AnalysisForm({ onRun, isRunning, logs }) {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState('supply')
  const [inputData, setInputData] = useState('')
  const [confidence, setConfidence] = useState(85)
  const [priority, setPriority] = useState('critical')
  const logRef = useRef(null)

  // Load scenarios from backend
  useEffect(() => {
    getScenarios().then(data => {
      setScenarios(data)
      if (data.length > 0) {
        setInputData(JSON.stringify(data[0].input_data, null, 2))
      }
    }).catch(() => {
      // Fallback scenarios if backend offline
      setInputData(JSON.stringify({
        "event_type": "supply_chain_disruption",
        "affected_units": 145000,
        "current_stock_days": 4.2,
        "supplier": "Foxconn_Shenzhen",
        "contract_penalty_per_day_usd": 12000
      }, null, 2))
    })
  }, [])

  // Auto-scroll log to bottom
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  // When scenario changes, load its sample data
  const handleScenarioChange = (e) => {
    const val = e.target.value
    setSelectedScenario(val)
    const sc = scenarios.find(s => s.id === val)
    if (sc) setInputData(JSON.stringify(sc.input_data, null, 2))
  }

  const handleRun = () => {
    try {
      const parsed = JSON.parse(inputData)
      onRun({
        scenario: selectedScenario,
        inputData: parsed,
        confidenceThreshold: confidence / 100,
        priority
      })
    } catch {
      alert('❌ Invalid JSON in input data. Please check the format.')
    }
  }

  return (
    <div style={styles.grid}>
      {/* ─── Left: Input Form ─── */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <div style={styles.panelTitle}>📡 Input Configuration</div>
          <span style={styles.badge}>Sample Data Loaded</span>
        </div>
        <div style={styles.panelBody}>
          <label style={styles.label}>Analysis Scenario</label>
          <select style={styles.select} value={selectedScenario} onChange={handleScenarioChange}>
            {scenarios.length > 0
              ? scenarios.map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
                ))
              : [
                  <option key="supply" value="supply">📦 Supply Chain Disruption</option>,
                  <option key="demand" value="demand">📈 Prime Day Demand Forecast</option>,
                  <option key="fraud" value="fraud">🔒 Fraud Pattern Detection</option>,
                  <option key="cost" value="cost">💰 Cost Reduction Analysis</option>,
                  <option key="inventory" value="inventory">🏭 Inventory Rebalancing</option>,
                  <option key="logistics" value="logistics">🚚 Last-Mile Optimization</option>,
                ]
            }
          </select>

          <label style={styles.label}>Input Data (JSON)</label>
          <textarea
            style={styles.textarea}
            value={inputData}
            onChange={e => setInputData(e.target.value)}
            rows={10}
          />

          <label style={styles.label}>Confidence Threshold: {confidence}%</label>
          <input
            type="range" min={60} max={99} value={confidence}
            onChange={e => setConfidence(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--orange)', marginBottom: 16 }}
          />

          <label style={styles.label}>Priority Level</label>
          <select style={styles.select} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="critical">🔴 Critical — Immediate Action</option>
            <option value="high">🟠 High — Within 1 Hour</option>
            <option value="medium">🟡 Medium — Within 24 Hours</option>
          </select>

          <button
            style={{ ...styles.runBtn, opacity: isRunning ? 0.6 : 1 }}
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning
              ? <><span style={styles.spinner} /> Agents Running...</>
              : '⚡ DEPLOY AGENTS'
            }
          </button>
        </div>
      </div>

      {/* ─── Right: Log Stream ─── */}
      <div style={styles.panel}>
        <div style={styles.panelHead}>
          <div style={styles.panelTitle}>🖥️ Agent Activity Log</div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: isRunning ? 'var(--orange)' : 'var(--muted)' }}>
            {isRunning ? '● Processing...' : logs.length > 0 ? '✅ Complete' : 'Idle'}
          </div>
        </div>
        <div style={styles.panelBody}>
          <div style={styles.logStream} ref={logRef}>
            {logs.length === 0
              ? <div style={{ color: 'var(--muted)', fontSize: 12, fontFamily: 'var(--mono)' }}>
                  — System ready. Deploy agents to begin analysis —
                </div>
              : logs.map((log, i) => (
                  <div key={i} style={styles.logLine}>
                    <span style={styles.logTime}>{log.timestamp}</span>
                    <span style={styles.logAgent}>[{log.agent_name || log.agent}]</span>
                    <span style={{ ...styles.logMsg, color: getLogColor(log.log_type) }}>
                      {log.message}
                    </span>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function getLogColor(type) {
  if (type === 'success') return 'var(--teal)'
  if (type === 'warning' || type === 'warn') return 'var(--yellow)'
  if (type === 'error')   return 'var(--red)'
  return 'var(--text)'
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  panel: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' },
  panelHead: { padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  panelTitle: { fontSize: 13, fontWeight: 700 },
  panelBody: { padding: 20 },
  badge: { fontFamily: 'var(--mono)', fontSize: 10, padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 4, color: 'var(--muted)' },
  label: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  select: {
    width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 12,
    padding: '10px 12px', outline: 'none', marginBottom: 16, cursor: 'pointer',
  },
  textarea: {
    width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 11,
    padding: 12, resize: 'vertical', minHeight: 200, lineHeight: 1.7, outline: 'none', marginBottom: 16,
  },
  runBtn: {
    width: '100%', padding: 14,
    background: 'linear-gradient(135deg, var(--orange), #ff4500)',
    border: 'none', borderRadius: 8, color: '#000', fontWeight: 800,
    fontSize: 14, cursor: 'pointer', marginTop: 8, fontFamily: 'var(--sans)',
    letterSpacing: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  logStream: {
    background: '#090910', borderRadius: 8, padding: 16,
    fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.8,
    height: 320, overflowY: 'auto', border: '1px solid var(--border)',
  },
  logLine: { display: 'flex', gap: 10, marginBottom: 2 },
  logTime: { color: 'var(--muted)', minWidth: 65, fontSize: 11 },
  logAgent: { color: 'var(--orange)', minWidth: 150, fontSize: 11 },
  logMsg: { fontSize: 11, flex: 1 },
}
