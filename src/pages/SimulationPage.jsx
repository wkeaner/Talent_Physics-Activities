/**
 * SimulationPage.jsx
 * 
 * A generic simulation page that reads a config and renders:
 *   - SimulationEngine (Matter.js physics)
 *   - ControlFactory (sliders, buttons, etc.)
 *   - PedagogyManager (POE teaching flow)
 *   - ChatPanel (AI Tutor)
 *   - Real-time data display
 * 
 * This single component replaces the need for separate
 * FrictionSimulation.jsx, ThirdLawSimulation.jsx, etc.
 * 
 * Usage:
 *   <SimulationPage config={frictionConfig} />
 */
import { useRef, useState, useCallback } from 'react'
import SimulationLayout from '../components/Layout/SimulationLayout'
import SimulationEngine from '../engine/SimulationEngine'
import ControlFactory from '../engine/ControlFactory'
import PedagogyManager from '../engine/PedagogyManager'
import ChatPanel from '../components/AITutor/ChatPanel'
import { useAITutor } from '../hooks/useAITutor'

export default function SimulationPage({ config }) {
  const engineRef = useRef(null)
  const [physicsState, setPhysicsState] = useState({})
  const [forceCount, setForceCount] = useState(0)

  // AI Tutor - pass config context so the tutor knows which simulation this is
  const { messages, sendMessage, isLoading } = useAITutor(
    config.pedagogy?.aiTutor?.systemPrompt,
    config
  )

  // ============================================================
  // Handle physics state updates from the engine
  // ============================================================
  const handleStateUpdate = useCallback((state) => {
    setPhysicsState(state)
  }, [])

  // ============================================================
  // Handle control actions (buttons: applyForce, reset, etc.)
  // ============================================================
  const handleAction = useCallback((actionType, params, targetId) => {
    if (!engineRef.current) return

    switch (actionType) {
      case 'applyForce':
        if (targetId && params?.force) {
          engineRef.current.applyForce(targetId, params.force)
          setForceCount(prev => prev + 1)
        }
        break

      case 'reset':
        engineRef.current.reset()
        setForceCount(0)
        break

      case 'launchCollision':
        // For third-law simulation: set velocities of multiple objects
        if (params?.objectA && params?.objectB) {
          engineRef.current.launchCollision([
            { id: params.objectA.id, velocity: params.objectA.velocity },
            { id: params.objectB.id, velocity: params.objectB.velocity },
          ])
        }
        break

      default:
        console.warn(`Unknown action: ${actionType}`)
    }
  }, [])

  // ============================================================
  // Handle property changes (sliders, dropdowns)
  // ============================================================
  const handlePropertyChange = useCallback((targetId, property, value) => {
    if (!engineRef.current || !targetId) return
    engineRef.current.setProperty(targetId, property, value)
  }, [])

  // ============================================================
  // Handle prediction selection from PedagogyManager
  // ============================================================
  const handlePrediction = useCallback((choice) => {
    // Send prediction to AI tutor automatically
    const message = choice.isCorrect
      ? `I predicted: "${choice.label}" — I think this is correct because...`
      : `I predicted: "${choice.label}"`

    // Optional: auto-send to AI tutor
    // sendMessage(message)
  }, [])

  // ============================================================
  // Render
  // ============================================================

  // Find the first dynamic object for the data display
  const dynamicIds = (config.physics?.dynamics || []).map(d => d.id)
  const primaryId = dynamicIds[0]
  const primaryState = primaryId ? physicsState[primaryId] : null

  return (
    <SimulationLayout
      title={config.scenario?.title || 'Physics Simulation'}
      description={config.scenario?.narrative || config.education?.concept || ''}
      simulation={
        <div>
          {/* Physics Canvas */}
          <SimulationEngine
            ref={engineRef}
            config={config}
            onStateUpdate={handleStateUpdate}
          />

          {/* Real-Time Data Panel */}
          <div style={{
            background: '#e8f5e9',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '16px',
          }}>
            <h3 style={{
              fontSize: '14px',
              color: '#2e7d32',
              marginBottom: '10px',
              fontWeight: '600'
            }}>
              📊 Real-Time Data
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '8px',
              fontSize: '13px',
            }}>
              {/* Show data for each dynamic object */}
              {dynamicIds.map(id => {
                const state = physicsState[id]
                if (!state) return null
                const objConfig = config.physics.dynamics.find(d => d.id === id)
                return (
                  <div key={id} style={{
                    background: 'rgba(255,255,255,0.7)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                  }}>
                    <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '4px', fontSize: '12px' }}>
                      {objConfig?.label || id}
                    </div>
                    <div>
                      <span style={{ color: '#555' }}>Speed: </span>
                      <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                        {state.speed?.toFixed(2) || '0.00'} m/s
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: '#555' }}>Friction: </span>
                      <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                        {state.friction?.toFixed(2) || '—'}
                      </strong>
                    </div>
                  </div>
                )
              })}

              {/* Force count */}
              <div style={{
                background: 'rgba(255,255,255,0.7)',
                padding: '8px 12px',
                borderRadius: '6px',
              }}>
                <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '4px', fontSize: '12px' }}>
                  Interaction
                </div>
                <div>
                  <span style={{ color: '#555' }}>Forces: </span>
                  <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                    {forceCount}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      controls={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Dynamic Controls from Config */}
          <ControlFactory
            controls={config.controls}
            onPropertyChange={handlePropertyChange}
            onAction={handleAction}
          />

          {/* Pedagogy Guide (POE Flow) */}
          <PedagogyManager
            pedagogy={config.pedagogy}
            onPredictionSelect={handlePrediction}
          />
        </div>
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      }
    />
  )
}
