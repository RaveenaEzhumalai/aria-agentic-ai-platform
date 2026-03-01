/**
 * ARIA - Main App
 * ================
 * Root component that orchestrates all pages and state.
 * 
 * Data flow:
 *   AnalysisForm  →  runAnalysis (API call)  →  ResultsDashboard
 *                                            →  AgentPipeline (live updates)
 */

import { useState, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AgentPipeline from './components/AgentPipeline'
import AnalysisForm from './components/AnalysisForm'
import ResultsDashboard from './components/ResultsDashboard'
import { runAnalysisStreaming, runAnalysis } from './services/api'

export default function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [result, setResult] = useState(null)
  const [agentStatuses, setAgentStatuses] = useState({})
  const [pipelineStatus, setPipelineStatus] = useState('Awaiting Input Signal...')
  const demoRef = useRef(null)

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleRun = async (params) => {
    // Reset state
    setIsRunning(true)
    setLogs([])
    setResult(null)
    setAgentStatuses({})
    setPipelineStatus('🔄 Agents Deploying...')

    try {
      // Try streaming first (most impressive for demo)
      runAnalysisStreaming(
        params,
        // onLog: called for each log entry
        (logEntry) => {
          setLogs(prev => [...prev, logEntry])

          // Update pipeline node statuses
          if (logEntry.type === 'agent_start' && logEntry.agent_key) {
            setAgentStatuses(prev => ({ ...prev, [logEntry.agent_key]: 'running' }))
          }
          if (logEntry.type === 'agent_done' && logEntry.agent_key) {
            setAgentStatuses(prev => ({ ...prev, [logEntry.agent_key]: 'done' }))
          }
        },
        // onComplete: called with final result
        (finalResult) => {
          setResult(finalResult)
          setIsRunning(false)
          setPipelineStatus('✅ Analysis Complete — All Agents Returned')
          // Mark all agents done
          setAgentStatuses({
            supply: 'done', demand: 'done', fraud: 'done',
            cost: 'done', inventory: 'done', logistics: 'done', compliance: 'done'
          })
        },
        // onError: fallback to non-streaming if SSE fails
        async (err) => {
          console.warn('Streaming failed, falling back to regular API call:', err)
          try {
            // Add a simple log
            setLogs(prev => [...prev, {
              timestamp: new Date().toTimeString().slice(0,8),
              agent_name: '🧠 Orchestrator',
              message: 'Running analysis (non-streaming mode)...',
              log_type: 'info'
            }])
            const res = await runAnalysis(params)
            setResult(res)
            setAgentStatuses({
              supply: 'done', demand: 'done', fraud: 'done',
              cost: 'done', inventory: 'done', logistics: 'done', compliance: 'done'
            })
            // Add result logs
            res.agent_logs?.forEach(log => setLogs(prev => [...prev, log]))
          } catch (e2) {
            setLogs(prev => [...prev, {
              timestamp: new Date().toTimeString().slice(0,8),
              agent_name: '❌ System',
              message: `Error: ${e2.message}. Is the backend running? Run: cd backend && python main.py`,
              log_type: 'error'
            }])
          } finally {
            setIsRunning(false)
            setPipelineStatus('Analysis Complete')
          }
        }
      )
    } catch (e) {
      setIsRunning(false)
      setPipelineStatus('Error — Check console')
      console.error(e)
    }
  }

  return (
    <div>
      {/* ─── Navigation ─── */}
      <Navbar />

      {/* ─── Hero Section ─── */}
      <Hero onScrollToDemo={scrollToDemo} />

      {/* ─── Agent Pipeline ─── */}
      <section style={styles.section}>
        <div style={styles.label}>// Agent Architecture</div>
        <h2 style={styles.h2}>Autonomous Agent Pipeline</h2>
        <p style={styles.sub}>Real-time multi-agent orchestration — agents communicate, delegate, and self-heal</p>
        <AgentPipeline agentStatuses={agentStatuses} pipelineStatus={pipelineStatus} />
      </section>

      {/* ─── Live Demo ─── */}
      <section style={styles.section} ref={demoRef}>
        <div style={styles.label}>// Live Intelligence Interface</div>
        <h2 style={styles.h2}>Deploy Agentic Analysis</h2>
        <p style={styles.sub}>
          Select a scenario, deploy agents, get enterprise-grade recommendations instantly.
          <br />
          <span style={{ color: 'var(--orange)' }}>
            Note: Add your Anthropic API key to backend/.env for live AI responses.
            Without it, rich sample data is used — still great for demos!
          </span>
        </p>

        <AnalysisForm
          onRun={handleRun}
          isRunning={isRunning}
          logs={logs}
        />

        <ResultsDashboard result={result} />
      </section>

      {/* ─── Footer ─── */}
      <footer style={styles.footer}>
        <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--muted)' }}>
          ARIA · Agentic Retail Intelligence Architecture
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
          Built for Amazon Enterprise · Secure · Compliant · Profitable
        </div>
      </footer>
    </div>
  )
}

const styles = {
  section: {
    padding: '60px 48px',
    borderTop: '1px solid var(--border)',
  },
  label: {
    fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--orange)',
    letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12,
  },
  h2: {
    fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800,
    letterSpacing: -1, marginBottom: 8,
  },
  sub: {
    fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)',
    marginBottom: 40, lineHeight: 1.8,
  },
  footer: {
    borderTop: '1px solid var(--border)',
    padding: '24px 48px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
}
