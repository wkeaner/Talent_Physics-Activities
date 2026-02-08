/**
 * App.jsx (Updated)
 * 
 * Now supports multiple simulations via config-driven approach.
 * Uses simple state-based routing (no react-router needed).
 * 
 * IMPORTANT: Your original FrictionSimulation still works!
 * Set USE_NEW_ENGINE = false to switch back to the old version.
 */
import { useState } from 'react'

// ── Toggle this to switch between old and new system ──
const USE_NEW_ENGINE = true
// ────────────────────────────────────────────────────────

// New config-driven system
import SimulationPage from './pages/SimulationPage'
import SIMULATIONS from './configs'

// Old hard-coded system (keep as fallback)
import FrictionSimulation from './simulations/FrictionSimulation/FrictionSimulation'

function App() {
  const [currentSim, setCurrentSim] = useState('friction')
  const simKeys = Object.keys(SIMULATIONS)

  // Get current simulation config
  const currentSimData = SIMULATIONS[currentSim]

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '16px 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '2px' }}>
              ⚛️ Physics Simulation Platform
            </h1>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>
              Interactive simulations with AI tutoring — Based on SPHERE misconception data
            </p>
          </div>

          {/* Simulation Selector (shows when multiple sims available) */}
          {USE_NEW_ENGINE && simKeys.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {simKeys.map(key => {
                const sim = SIMULATIONS[key]
                const isActive = currentSim === key
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentSim(key)}
                    style={{
                      padding: '8px 16px',
                      background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      border: isActive ? '2px solid white' : '2px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '400',
                      transition: 'all 0.2s',
                    }}
                  >
                    {sim.emoji} {sim.config.scenario?.title || key}
                  </button>
                )
              })}
            </div>
          )}

          {/* Engine indicator (dev mode) */}
          <div style={{
            fontSize: '11px',
            opacity: 0.7,
            textAlign: 'right',
          }}>
            Engine: {USE_NEW_ENGINE ? 'Config-Driven v1' : 'Legacy'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {USE_NEW_ENGINE ? (
          /* ── New config-driven system ── */
          currentSimData ? (
            <SimulationPage
              key={currentSim}  // Force remount when switching simulations
              config={currentSimData.config}
            />
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
              Simulation not found: {currentSim}
            </div>
          )
        ) : (
          /* ── Old hard-coded system (fallback) ── */
          <FrictionSimulation />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #ddd',
        padding: '16px 20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '13px',
      }}>
        <p>
          Built with Matter.js & React |{' '}
          {currentSimData && (
            <>
              {currentSimData.config.education?.concept} —{' '}
              {currentSimData.config.education?.spherePrevalence
                ? `${(currentSimData.config.education.spherePrevalence * 100).toFixed(1)}% prevalence in SPHERE`
                : 'SPHERE dataset'
              }
            </>
          )}
        </p>
      </footer>
    </div>
  )
}

export default App
