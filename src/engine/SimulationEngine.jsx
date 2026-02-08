/**
 * SimulationEngine.jsx — CLEAN REWRITE
 * 
 * Based on the proven-working standalone physics test (PHYSICS_TEST.html).
 * Uses the EXACT same Matter.js parameters verified to work:
 *   - frictionAir defaults to 0 (not 0.01)
 *   - friction sync updates ALL three: friction, frictionAir, frictionStatic
 *   - ground is 8000px wide (no walls, no collision energy loss)
 */
import { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react'
import Matter from 'matter-js'

const { Engine, Render, World, Bodies, Runner, Body, Events } = Matter

const SimulationEngine = forwardRef(function SimulationEngine({ config, onStateUpdate, width, height }, ref) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const runnerRef = useRef(null)
  const bodiesRef = useRef({})

  const W = width || config.physics?.world?.bounds?.width || 800
  const H = height || config.physics?.world?.bounds?.height || 400

  // ──────────────────────────────────────────────
  // Build world — mirrors the working standalone test exactly
  // ──────────────────────────────────────────────
  const buildWorld = useCallback(() => {
    if (!canvasRef.current) return

    // Cleanup previous
    if (renderRef.current) Render.stop(renderRef.current)
    if (runnerRef.current) Runner.stop(runnerRef.current)
    if (engineRef.current) {
      World.clear(engineRef.current.world)
      Engine.clear(engineRef.current)
    }

    const engine = Engine.create()
    engine.world.gravity.x = config.physics?.world?.gravity?.x ?? 0
    engine.world.gravity.y = config.physics?.world?.gravity?.y ?? 1
    if (config.physics?.world?.gravityScale !== undefined) {
      engine.world.gravity.scale = config.physics.world.gravityScale
    }

    const render = Render.create({
      canvas: canvasRef.current,
      engine,
      options: { width: W, height: H, wireframes: false, background: '#ffffff', pixelRatio: 1 }
    })

    const bodies = {}

    // Create statics
    for (const spec of (config.physics?.statics || [])) {
      const body = Bodies.rectangle(
        spec.position.x, spec.position.y,
        spec.dimensions?.width || 800, spec.dimensions?.height || 40,
        {
          isStatic: true,
          friction: spec.physics?.friction ?? 0.5,
          restitution: spec.physics?.restitution ?? 0.1,
          render: {
            fillStyle: spec.appearance?.fillColor || '#2c3e50',
            strokeStyle: spec.appearance?.strokeColor || '#333',
            lineWidth: 2,
            visible: (spec.appearance?.opacity ?? 1) > 0,
          }
        }
      )
      bodies[spec.id] = body
      World.add(engine.world, body)
    }

    // Create dynamics
    for (const spec of (config.physics?.dynamics || [])) {
      const body = (spec.type === 'circle')
        ? Bodies.circle(spec.position.x, spec.position.y, spec.radius || 25, {
          mass: spec.physics?.mass ?? 5,
          friction: spec.physics?.friction ?? 0.5,
          frictionAir: spec.physics?.frictionAir ?? 0,
          frictionStatic: spec.physics?.frictionStatic ?? 0.5,
          restitution: spec.physics?.restitution ?? 0.05,
          inertia: spec.physics?.inertia === 'Infinity' ? Infinity : undefined,
          render: {
            fillStyle: spec.appearance?.fillColor || '#e74c3c',
            strokeStyle: spec.appearance?.strokeColor || '#c0392b',
            lineWidth: 3,
          }
        })
        : Bodies.rectangle(
          spec.position.x, spec.position.y,
          spec.dimensions?.width || 50, spec.dimensions?.height || 50, {
          mass: spec.physics?.mass ?? 5,
          friction: spec.physics?.friction ?? 0.5,
          frictionAir: spec.physics?.frictionAir ?? 0,
          frictionStatic: spec.physics?.frictionStatic ?? 0.5,
          restitution: spec.physics?.restitution ?? 0.05,
          inertia: spec.physics?.inertia === 'Infinity' ? Infinity : undefined,
          render: {
            fillStyle: spec.appearance?.fillColor || '#e74c3c',
            strokeStyle: spec.appearance?.strokeColor || '#c0392b',
            lineWidth: 3,
          }
        })

      bodies[spec.id] = body
      World.add(engine.world, body)
      if (spec.initialVelocity) Body.setVelocity(body, spec.initialVelocity)
    }

    engineRef.current = engine
    renderRef.current = render
    bodiesRef.current = bodies

    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)
    runnerRef.current = runner

    // State reporting
    Events.on(engine, 'afterUpdate', () => {
      if (!onStateUpdate) return
      const state = {}
      const ground = bodies['ground']
      for (const [id, body] of Object.entries(bodies)) {
        if (!body.isStatic) {
          state[id] = {
            speed: Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2),
            velocity: { x: body.velocity.x, y: body.velocity.y },
            position: { x: body.position.x, y: body.position.y },
            friction: body.friction,
            frictionAir: body.frictionAir,
            effectiveFriction: ground ? Math.min(body.friction, ground.friction) : body.friction,
            mass: body.mass,
          }
        }
      }
      onStateUpdate(state)
    })
  }, [config, W, H, onStateUpdate])

  useEffect(() => {
    buildWorld()
    return () => {
      if (renderRef.current) Render.stop(renderRef.current)
      if (runnerRef.current) Runner.stop(runnerRef.current)
      if (engineRef.current) { World.clear(engineRef.current.world); Engine.clear(engineRef.current) }
    }
  }, [buildWorld])

  // ──────────────────────────────────────────────
  // Imperative API — friction sync identical to standalone test
  // ──────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    applyForce(bodyId, force) {
      const body = bodiesRef.current[bodyId]
      if (body) Body.applyForce(body, body.position, force)
    },

    setProperty(bodyId, property, value) {
      const body = bodiesRef.current[bodyId]
      if (!body) return

      if (property === 'friction') {
        body.friction = value
        // ★ CRITICAL SYNC — exact same logic as standalone test's setFriction() ★
        if (body.isStatic) {
          for (const b of Object.values(bodiesRef.current)) {
            if (!b.isStatic) {
              b.friction = value
              b.frictionAir = value * 0.015
              b.frictionStatic = value
            }
          }
        }
      } else if (property === 'mass') {
        Body.setMass(body, value)
      } else if (property === 'frictionAir') {
        body.frictionAir = value
      } else if (property === 'restitution') {
        body.restitution = value
      } else {
        body[property] = value
      }
    },

    setVelocity(bodyId, vel) {
      const body = bodiesRef.current[bodyId]
      if (body) Body.setVelocity(body, vel)
    },

    reset() { buildWorld() },

    launchCollision(launches) {
      for (const { id, velocity } of launches) {
        const body = bodiesRef.current[id]
        if (body) Body.setVelocity(body, velocity)
      }
    },

    getBody(id) { return bodiesRef.current[id] },
    getAllBodies() { return { ...bodiesRef.current } },
  }))

  return (
    <canvas ref={canvasRef} style={{
      border: '3px solid #2c3e50', borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      display: 'block', width: '100%', maxWidth: `${W}px`,
    }} />
  )
})

export default SimulationEngine