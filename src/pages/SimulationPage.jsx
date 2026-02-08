/**
 * SimulationPage.jsx — SIMPLIFIED
 * 
 * Wires SimulationEngine + ControlFactory + PedagogyManager + ChatPanel.
 * Friction sync is handled inside SimulationEngine.setProperty(),
 * so this file just passes through control events.
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

  const { messages, sendMessage, isLoading } = useAITutor(
    config.pedagogy?.aiTutor?.systemPrompt, config
  )

  const handleStateUpdate = useCallback((state) => {
    setPhysicsState(state)
  }, [])

  // ── Button actions ──
  const handleAction = useCallback((actionType, params, targetId) => {
    if (!engineRef.current) return
    if (actionType === 'applyForce' && targetId && params?.force) {
      engineRef.current.applyForce(targetId, params.force)
      setForceCount(prev => prev + 1)
    } else if (actionType === 'reset') {
      engineRef.current.reset()
      setForceCount(0)
    } else if (actionType === 'launchCollision' && params?.objectA && params?.objectB) {
      engineRef.current.launchCollision([
        { id: params.objectA.id, velocity: params.objectA.velocity },
        { id: params.objectB.id, velocity: params.objectB.velocity },
      ])
    }
  }, [])

  // ── Slider/dropdown property changes ──
  // The engine's setProperty handles friction sync internally
  const handlePropertyChange = useCallback((targetId, property, value) => {
    if (engineRef.current && targetId) {
      engineRef.current.setProperty(targetId, property, value)
    }
  }, [])

  // ── Render ──
  const dynamicIds = (config.physics?.dynamics || []).map(d => d.id)
  const canvasW = config.physics?.world?.bounds?.width || 800

  return (
    <SimulationLayout
      title={config.scenario?.title || 'Physics Simulation'}
      description={config.scenario?.narrative || ''}
      simulation={
        <div>
          <SimulationEngine
            ref={engineRef}
            config={config}
            onStateUpdate={handleStateUpdate}
          />

          {/* ── Real-Time Data Panel ── */}
          <div style={{
            background: '#e8f5e9', padding: '15px',
            borderRadius: '8px', marginTop: '16px',
          }}>
            <h3 style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '10px', fontWeight: '600' }}>
              📊 Real-Time Data
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '8px', fontSize: '13px',
            }}>
              {dynamicIds.map(id => {
                const s = physicsState[id]
                if (!s) return null
                const obj = config.physics.dynamics.find(d => d.id === id)
                const speed = s.speed || 0
                const moving = speed > 0.05
                const offScreen = s.position && (s.position.x > canvasW + 50 || s.position.x < -50)
                const frictionless = (s.effectiveFriction ?? s.friction) < 0.01

                return (
                  <div key={id} style={{
                    background: offScreen && moving ? 'rgba(21,101,192,0.1)' : 'rgba(255,255,255,0.7)',
                    padding: '10px 12px', borderRadius: '6px',
                    border: offScreen && moving ? '2px solid #1565c0' : '2px solid transparent',
                  }}>
                    <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '4px', fontSize: '12px' }}>
                      {obj?.label || id}
                      {offScreen && moving && (
                        <span style={{ color: '#1565c0', fontWeight: '700', marginLeft: '6px' }}>
                          — still moving! →
                        </span>
                      )}
                    </div>

                    <div style={{ marginBottom: '3px' }}>
                      <span style={{ color: '#555' }}>Speed: </span>
                      <strong style={{
                        fontFamily: 'monospace', fontSize: offScreen && moving ? '18px' : '15px',
                        color: moving ? (frictionless ? '#1565c0' : '#2e7d32') : '#999',
                      }}>
                        {speed.toFixed(2)} m/s
                      </strong>
                      {moving && frictionless && !offScreen && (
                        <span style={{ fontSize: '11px', color: '#1565c0', marginLeft: '6px' }}>
                          ← constant!
                        </span>
                      )}
                    </div>

                    {offScreen && moving && (
                      <div style={{ fontSize: '12px', color: '#1565c0', fontWeight: '600', marginTop: '2px' }}>
                        🎯 Box is off-screen but speed is constant — Newton's First Law!
                      </div>
                    )}

                    <div>
                      <span style={{ color: '#555' }}>Friction: </span>
                      <strong style={{
                        fontFamily: 'monospace',
                        color: frictionless ? '#1565c0' : '#2e7d32',
                      }}>
                        {(s.effectiveFriction ?? s.friction)?.toFixed(3)}
                      </strong>
                      {frictionless && (
                        <span style={{ fontSize: '11px', color: '#1565c0', marginLeft: '4px' }}>
                          (frictionless!)
                        </span>
                      )}
                    </div>

                    <div>
                      <span style={{ color: '#555' }}>Air drag: </span>
                      <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                        {s.frictionAir?.toFixed(4)}
                      </strong>
                    </div>
                  </div>
                )
              })}

              <div style={{
                background: 'rgba(255,255,255,0.7)',
                padding: '10px 12px', borderRadius: '6px',
              }}>
                <div style={{ fontWeight: '600', color: '#2e7d32', marginBottom: '4px', fontSize: '12px' }}>
                  Interaction
                </div>
                <div>
                  <span style={{ color: '#555' }}>Pushes: </span>
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
          <ControlFactory
            controls={config.controls}
            onPropertyChange={handlePropertyChange}
            onAction={handleAction}
          />
          <PedagogyManager
            pedagogy={config.pedagogy}
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