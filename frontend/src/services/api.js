/**
 * API Service — FIXED VERSION
 * ============================
 * KEY FIX: API_BASE is now '' (empty string) instead of 'http://localhost:8000'
 *
 * WHY THIS MATTERS:
 * - Before: axios called http://localhost:8000/api/... DIRECTLY
 *   → Browser blocked this as CORS error (different port = different "origin")
 *   → This caused "Network Error" even though backend was running fine!
 *
 * - After: axios calls /api/... (relative URL, same port as frontend)
 *   → Vite dev server receives it and PROXIES it to http://localhost:8000
 *   → No CORS problem because the browser thinks it's talking to the same server
 *   → Works perfectly on ANY port (3000, 3001, 3002, doesn't matter!)
 */

import axios from 'axios'

// FIXED: Empty string = use same host/port as frontend (Vite proxies to backend)
const API_BASE = ''

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' }
})


/** Check if backend is running */
export async function checkHealth() {
  const res = await api.get('/health')
  return res.data
}


/** Get all available demo scenarios */
export async function getScenarios() {
  const res = await api.get('/api/scenarios')
  return res.data.scenarios
}


/** Run a full agentic analysis (non-streaming) */
export async function runAnalysis({ scenario, inputData, confidenceThreshold, priority }) {
  const res = await api.post('/api/analyze', {
    scenario,
    input_data: inputData,
    confidence_threshold: confidenceThreshold,
    priority
  })
  return res.data
}


/**
 * Run analysis with real-time streaming logs.
 * Uses fetch() with relative URL — Vite proxies to backend automatically.
 */
export function runAnalysisStreaming(
  { scenario, inputData, confidenceThreshold, priority },
  onLog,
  onComplete,
  onError
) {
  const body = JSON.stringify({
    scenario,
    input_data: inputData,
    confidence_threshold: confidenceThreshold,
    priority
  })

  // FIXED: '/api/analyze/stream' — relative URL, no localhost:8000
  fetch('/api/analyze/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      function read() {
        reader.read().then(({ done, value }) => {
          if (done) return

          const text = decoder.decode(value)
          const lines = text.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.type === 'complete') {
                  onComplete(data.result)
                } else if (data.type === 'error') {
                  onError(data.message)
                } else {
                  onLog(data)
                }
              } catch (e) {
                // Skip malformed lines silently
              }
            }
          }
          read() // Keep reading stream
        }).catch(onError)
      }
      read()
    })
    .catch(onError)
}


/** Get current status of all agents */
export async function getAgentStatus() {
  const res = await api.get('/api/agents/status')
  return res.data
}
