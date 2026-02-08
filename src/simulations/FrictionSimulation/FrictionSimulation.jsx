//FrictionSimulation.jsx
import { useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import SimulationLayout from '../../components/Layout/SimulationLayout'
import FrictionControls from './FrictionControls'
import ChatPanel from '../../components/AITutor/ChatPanel'
import { useAITutor } from '../../hooks/useAITutor'

export default function FrictionSimulation() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const boxRef = useRef(null)

  const [friction, setFriction] = useState(0.5)
  const [velocity, setVelocity] = useState(0)
  const [forceCount, setForceCount] = useState(0)

  const { messages, sendMessage, isLoading } = useAITutor()

  // Initialize Matter.js
  useEffect(() => {
    const { Engine, Render, World, Bodies, Runner, Body, Events } = Matter

    const engine = Engine.create()
    const world = engine.world
    world.gravity.y = 1

    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: 700,
        height: 450,
        wireframes: false,
        background: '#ffffff'
      }
    })

    const ground = Bodies.rectangle(350, 430, 700, 40, {
      isStatic: true,
      render: { fillStyle: '#2c3e50' }
    })

    const box = Bodies.rectangle(150, 350, 80, 80, {
      friction: friction,
      restitution: 0.1,
      render: {
        fillStyle: '#e74c3c',
        strokeStyle: '#c0392b',
        lineWidth: 3
      }
    })

    World.add(world, [ground, box])
    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)

    engineRef.current = engine
    boxRef.current = box

    Events.on(engine, 'afterUpdate', () => {
      setVelocity(Math.abs(box.velocity.x))
    })

    return () => {
      Render.stop(render)
      Runner.stop(runner)
      World.clear(world)
      Engine.clear(engine)
    }
  }, [])

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.friction = friction
    }
  }, [friction])

  const pushBox = () => {
    if (boxRef.current) {
      Matter.Body.applyForce(boxRef.current, boxRef.current.position, {
        x: 0.05,
        y: 0
      })
      setForceCount(prev => prev + 1)
    }
  }

  const resetSimulation = () => {
    if (engineRef.current && boxRef.current) {
      const { World, Bodies } = Matter
      World.remove(engineRef.current.world, boxRef.current)

      const newBox = Bodies.rectangle(150, 350, 80, 80, {
        friction: friction,
        restitution: 0.1,
        render: {
          fillStyle: '#e74c3c',
          strokeStyle: '#c0392b',
          lineWidth: 3
        }
      })

      World.add(engineRef.current.world, newBox)
      boxRef.current = newBox
      setForceCount(0)
      setVelocity(0)
    }
  }

  return (
    <SimulationLayout
      title="Friction & Motion"
      description="Explore how friction affects motion. What happens when friction is zero?"
      simulation={
        <div>
          <canvas ref={canvasRef} style={{
            border: '3px solid #2c3e50',
            borderRadius: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            display: 'block'
          }} />

          <div style={{
            background: '#e8f5e9',
            padding: '15px',
            borderRadius: '8px',
            marginTop: '20px'
          }}>
            <h3 style={{ fontSize: '14px', color: '#2e7d32', marginBottom: '10px', fontWeight: '600' }}>
              📊 Real-Time Data:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#555' }}>Velocity: </span>
                <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                  {velocity.toFixed(2)} m/s
                </strong>
              </div>
              <div>
                <span style={{ color: '#555' }}>Friction: </span>
                <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                  {friction.toFixed(2)}
                </strong>
              </div>
              <div>
                <span style={{ color: '#555' }}>Forces Applied: </span>
                <strong style={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                  {forceCount}
                </strong>
              </div>
            </div>
          </div>
        </div>
      }
      controls={
        <FrictionControls
          friction={friction}
          onFrictionChange={setFriction}
          onPush={pushBox}
          onReset={resetSimulation}
        />
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
