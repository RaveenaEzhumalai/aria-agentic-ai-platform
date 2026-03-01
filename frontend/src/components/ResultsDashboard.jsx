/**
 * ResultsDashboard
 * =================
 * Shows analysis results in 4 tabs:
 * 1. Live Metrics  2. Agent Insights  3. Action Plan  4. Architecture
 */

import { useState, useEffect } from 'react'

const PRIORITY_COLORS = {
  critical: 'var(--red)',
  high:     'var(--orange)',
  medium:   'var(--yellow)',
  low:      'var(--muted)',
}

const METRIC_COLORS = {
  orange: 'var(--orange)',
  green:  'var(--teal)',
  red:    'var(--red)',
  yellow: 'var(--yellow)',
}

export default function ResultsDashboard({ result }) {
  const [activeTab, setActiveTab] = useState('metrics')
  const [barsAnimated, setBarsAnimated] = useState(false)

  useEffect(() => {
    if (result) {
      setBarsAnimated(false)
      setTimeout(() => setBarsAnimated(true), 200)
      setActiveTab('metrics')
    }
  }, [result])

  if (!result) return null

  const tabs = [
    { key: 'metrics',         label: '📊 Live Metrics' },
    { key: 'insights',        label: '🧠 Agent Insights' },
    { key: 'recommendations', label: '✅ Action Plan' },
    { key: 'architecture',    label: '🏗️ Architecture' },
  ]

  return (
    <div style={styles.wrapper} className="fade-up">
      {/* Summary banner */}
      <div style={styles.summary}>
        <span style={{ fontSize: 18 }}>🎯</span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
          {result.summary}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--orange)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
          ⚡ {result.execution_time_ms}ms
        </span>
      </div>

      {/* Tabs */}
      <div style={styles.tabBar}>
        {tabs.map(t => (
          <div
            key={t.key}
            style={{ ...styles.tab, ...(activeTab === t.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={styles.tabBody}>

        {/* ─── METRICS TAB ─── */}
        {activeTab === 'metrics' && (
          <div>
            <div style={styles.metricsGrid}>
              {result.metrics?.map((m, i) => (
                <div key={i} style={styles.metricCard}>
                  <div style={{ ...styles.metricVal, color: METRIC_COLORS[m.color] || 'var(--text)' }}>
                    {m.value}
                  </div>
                  <div style={styles.metricLabel}>{m.label}</div>
                  <div style={styles.metricDelta}>{m.delta}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={styles.chartTitle}>Savings Breakdown by Agent</div>
              {result.chart_bars?.map((bar, i) => (
                <div key={i} style={styles.barRow}>
                  <div style={styles.barLabel}>{bar.label}</div>
                  <div style={styles.barTrack}>
                    <div style={{
                      ...styles.barFill,
                      width: barsAnimated ? `${bar.percentage}%` : '0%',
                      background: bar.color,
                      transition: `width 1.2s ease ${i * 0.15}s`,
                    }} />
                  </div>
                  <div style={styles.barVal}>{bar.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── INSIGHTS TAB ─── */}
        {activeTab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.insights?.map((ins, i) => (
              <div key={i} style={styles.insightCard} className="fade-up">
                <div style={styles.insightIcon}>{ins.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.insightTitle}>{ins.title}</div>
                  <div style={styles.insightDesc}>{ins.description}</div>
                  <span style={{ ...styles.badge, ...getBadgeStyle(ins.badge_type) }}>
                    {ins.badge_text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── RECOMMENDATIONS TAB ─── */}
        {activeTab === 'recommendations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {result.recommendations?.map((rec, i) => (
              <div key={i} style={{ ...styles.insightCard, borderLeft: `3px solid ${PRIORITY_COLORS[rec.priority] || 'var(--muted)'}` }}>
                <div style={{ ...styles.rankNum, color: PRIORITY_COLORS[rec.priority] }}>#{rec.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={styles.recMeta}>
                    <span style={{ ...styles.priorityBadge, color: PRIORITY_COLORS[rec.priority], borderColor: PRIORITY_COLORS[rec.priority] }}>
                      {rec.priority?.toUpperCase()}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
                      👤 {rec.owner}
                    </span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)' }}>
                      ⏰ {rec.deadline}
                    </span>
                  </div>
                  <div style={styles.insightTitle}>{rec.action}</div>
                  <div style={{ ...styles.insightDesc, color: 'var(--teal)', marginTop: 4 }}>
                    💰 {rec.impact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── ARCHITECTURE TAB ─── */}
        {activeTab === 'architecture' && (
          <div>
            <div style={styles.archGrid}>
              {[
                { title: 'Data Layer', items: ['Amazon S3 / Data Lake', 'Kinesis Streams (Real-time)', 'DynamoDB (NoSQL)', 'Redshift (Analytics)'] },
                { title: 'Agent Layer', items: ['LangGraph Orchestrator', 'RAG Memory Store', 'Tool Calling Engine', 'Self-Reflection Loop'] },
                { title: 'Output Layer', items: ['FastAPI Gateway', 'Alert / PagerDuty', 'SOC2 Audit Trail', 'BI Dashboard Sync'] },
              ].map((layer, i) => (
                <div key={i} style={styles.archLayer}>
                  <div style={styles.archLayerTitle}>{layer.title}</div>
                  {layer.items.map((item, j) => (
                    <div key={j} style={styles.archComponent}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
            <div style={styles.techStack}>
              <strong style={{ color: 'var(--text)' }}>Tech Stack: </strong>
              Python 3.11 · FastAPI · LangChain + LangGraph · Claude (Anthropic API) · React 18 + Vite ·
              Amazon Bedrock · SageMaker · Kinesis · Lambda · ECS Fargate · Pinecone Vector DB ·
              PostgreSQL · Redis · Terraform IaC · GitHub Actions CI/CD
              <br/><br/>
              <strong style={{ color: 'var(--text)' }}>Security & Compliance: </strong>
              SOC 2 Type II · GDPR · CCPA · ISO 27001 · PCI-DSS · AES-256 Encryption ·
              Zero-Trust Network · IAM Least-Privilege · Secrets Manager · CloudTrail Audit Logs
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function getBadgeStyle(type) {
  if (type === 'save') return { background: 'rgba(0,201,167,0.15)', color: 'var(--teal)', border: '1px solid rgba(0,201,167,0.3)' }
  if (type === 'risk') return { background: 'rgba(255,56,96,0.15)', color: 'var(--red)', border: '1px solid rgba(255,56,96,0.3)' }
  return { background: 'rgba(255,107,0,0.15)', color: 'var(--orange)', border: '1px solid rgba(255,107,0,0.3)' }
}

const styles = {
  wrapper: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginTop: 24 },
  summary: { display: 'flex', gap: 12, alignItems: 'flex-start', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'rgba(255,107,0,0.05)' },
  tabBar: { display: 'flex', borderBottom: '1px solid var(--border)', overflowX: 'auto' },
  tab: { padding: '14px 20px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: '2px solid transparent', transition: 'all 0.2s' },
  tabActive: { color: 'var(--orange)', borderBottomColor: 'var(--orange)', background: 'var(--orange-dim)' },
  tabBody: { padding: 24 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 8 },
  metricCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 },
  metricVal: { fontSize: 28, fontWeight: 800, letterSpacing: -1 },
  metricLabel: { fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  metricDelta: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--teal)', marginTop: 6 },
  chartTitle: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1 },
  barRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 },
  barLabel: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', minWidth: 180 },
  barTrack: { flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 100, height: 8, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 100, transition: 'width 1.2s ease' },
  barVal: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', minWidth: 50, textAlign: 'right' },
  insightCard: { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, display: 'flex', gap: 16, alignItems: 'flex-start' },
  insightIcon: { fontSize: 22, minWidth: 30 },
  insightTitle: { fontSize: 13, fontWeight: 700, marginBottom: 4 },
  insightDesc: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 },
  badge: { display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--mono)', fontSize: 10, marginTop: 8 },
  rankNum: { fontWeight: 800, fontFamily: 'var(--mono)', fontSize: 12, minWidth: 28 },
  recMeta: { display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' },
  priorityBadge: { fontFamily: 'var(--mono)', fontSize: 10, padding: '2px 8px', borderRadius: 3, border: '1px solid', background: 'rgba(255,255,255,0.05)' },
  archGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 },
  archLayer: { background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, textAlign: 'center' },
  archLayerTitle: { fontSize: 11, fontWeight: 700, color: 'var(--orange)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  archComponent: { background: 'rgba(255,107,0,0.08)', border: '1px solid rgba(255,107,0,0.2)', borderRadius: 6, padding: 8, marginBottom: 8, fontFamily: 'var(--mono)', fontSize: 11 },
  techStack: { fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.8, background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 16 },
}
