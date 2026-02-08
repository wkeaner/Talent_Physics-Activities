/**
 * SimulationEngine.jsx
 * 
 * Config-driven Matter.js physics renderer.
 * Reads a simulation config JSON and creates a playable physics simulation.
 * 
 * Usage:
 *   <SimulationEngine
 *     config={frictionConfig}
 *     onStateUpdate={(state) => { ... }}
 *     ref={engineRef}   // exposes: applyForce, reset, setProperty
 *   />
 */
import { useEffect, useRef, useState, useImperativeHandle, forwardRef, useCallback } from 'react'
import Matter from 'matter-js'

const { Engine, Render, World, Bodies, Runner, Body, Events, Composite } = Matter

/**
 * Create a Matter.js body from a config object spec
 */
function createBodyFromSpec(spec, isStatic = false) {
  const options = {
    isStatic,
    label: spec.label || spec.id,
    friction: spec.physics?.friction ?? 0.1,
    restitution: spec.physics?.restitution ?? 0.5,
    frictionAir: spec.physics?.frictionAir ?? 0.01,
    render: {
      fillStyle: spec.appearance?.fillColor || (isStatic ? '#2c3e50' : '#e74c3c'),
      strokeStyle: spec.appearance?.strokeColor || '#333',
      lineWidth: 2,
      opacity: spec.appearance?.opacity ?? 1,
    }
  }

  // Mass and inertia (dynamic objects only)
  if (!isStatic && spec.physics) {
    if (spec.physics.mass) {
      options.mass = spec.physics.mass
    }
    if (spec.physics.inertia === 'Infinity') {
      options.inertia = Infinity
    } else if (spec.physics.inertia) {
      options.inertia = spec.physics.inertia
    }
  }

  let body
  switch (spec.type) {
    case 'circle':
      body = Bodies.circle(
        spec.position.x,
        spec.position.y,
        spec.radius || 25,
        options
      )
      break
    case 'polygon':
      // For custom polygons, use fromVertices
      if (spec.vertices) {
        body = Bodies.fromVertices(
          spec.position.x,
          spec.position.y,
          spec.vertices,
          options
        )
      } else {
        // Regular polygon with N sides
        body = Bodies.polygon(
          spec.position.x,
          spec.position.y,
          spec.sides || 6,
          spec.radius || 30,
          options
        )
      }
      break
    case 'rectangle':
    default:
      body = Bodies.rectangle(
        spec.position.x,
        spec.position.y,
        spec.dimensions?.width || 80,
        spec.dimensions?.height || 80,
        options
      )
      break
  }

  // Store config ID on the body for later lookups
  body._configId = spec.id
  body._configSpec = spec

  return body
}


const SimulationEngine = forwardRef(function SimulationEngine({ config, onStateUpdate, width, height }, ref) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const runnerRef = useRef(null)
  const bodiesMapRef = useRef({})  // id -> Matter.Body lookup

  const canvasWidth = width || config.physics?.world?.bounds?.width || 700
  const canvasHeight = height || config.physics?.world?.bounds?.height || 450

  // ============================================================
  // Initialize Matter.js world from config
  // ============================================================
  const buildWorld = useCallback(() => {
    if (!canvasRef.current) return

    // Clean up previous world if exists
    if (renderRef.current) Render.stop(renderRef.current)
    if (runnerRef.current) Runner.stop(runnerRef.current)
    if (engineRef.current) {
      World.clear(engineRef.current.world)
      Engine.clear(engineRef.current)
    }

    // Create engine
    const engine = Engine.create()
    const world = engine.world

    // Set gravity from config
    const gravityConfig = config.physics?.world?.gravity || { x: 0, y: 1 }
    world.gravity.x = gravityConfig.x
    world.gravity.y = gravityConfig.y
    if (config.physics?.world?.gravityScale !== undefined) {
      world.gravity.scale = config.physics.world.gravityScale
    }

    // Create renderer
    const render = Render.create({
      canvas: canvasRef.current,
      engine: engine,
      options: {
        width: canvasWidth,
        height: canvasHeight,
        wireframes: false,
        background: '#ffffff',
        pixelRatio: 1,
      }
    })

    // Build bodies from config
    const bodiesMap = {}

    // Static objects
    ;(config.physics?.statics || []).forEach(spec => {
      const body = createBodyFromSpec(spec, true)
      bodiesMap[spec.id] = body
      World.add(world, body)
    })

    // Dynamic objects
    ;(config.physics?.dynamics || []).forEach(spec => {
      const body = createBodyFromSpec(spec, false)
      bodiesMap[spec.id] = body
      World.add(world, body)

      // Apply initial velocity if specified
      if (spec.initialVelocity) {
        Body.setVelocity(body, {
          x: spec.initialVelocity.x || 0,
          y: spec.initialVelocity.y || 0,
        })
      }
    })

    // Store refs
    engineRef.current = engine
    renderRef.current = render
    bodiesMapRef.current = bodiesMap

    // Start simulation
    Render.run(render)
    const runner = Runner.create()
    Runner.run(runner, engine)
    runnerRef.current = runner

    // State update callback on each physics tick
    Events.on(engine, 'afterUpdate', () => {
      if (!onStateUpdate) return

      const state = {}
      Object.entries(bodiesMap).forEach(([id, body]) => {
        if (!body.isStatic) {
          state[id] = {
            velocity: { x: body.velocity.x, y: body.velocity.y },
            speed: Math.sqrt(body.velocity.x ** 2 + body.velocity.y ** 2),
            position: { x: body.position.x, y: body.position.y },
            angularVelocity: body.angularVelocity,
            friction: body.friction,
            mass: body.mass,
          }
        }
      })
      onStateUpdate(state)
    })
  }, [config, canvasWidth, canvasHeight, onStateUpdate])

  // Build world on mount
  useEffect(() => {
    buildWorld()

    return () => {
      if (renderRef.current) Render.stop(renderRef.current)
      if (runnerRef.current) Runner.stop(runnerRef.current)
      if (engineRef.current) {
        World.clear(engineRef.current.world)
        Engine.clear(engineRef.current)
      }
    }
  }, [buildWorld])


  // ============================================================
  // Imperative API (exposed via ref)
  // ============================================================
  useImperativeHandle(ref, () => ({
    /**
     * Apply a force to a body by its config ID
     * @param {string} bodyId - e.g., "box"
     * @param {object} force - { x: number, y: number }
     */
    applyForce(bodyId, force) {
      const body = bodiesMapRef.current[bodyId]
      if (body) {
        Body.applyForce(body, body.position, force)
      }
    },

    /**
     * Set a physics property on a body
     * @param {string} bodyId - e.g., "ground"
     * @param {string} property - e.g., "friction", "mass"
     * @param {number} value
     */
    setProperty(bodyId, property, value) {
      const body = bodiesMapRef.current[bodyId]
      if (!body) return

      switch (property) {
        case 'friction':
          body.friction = value
          break
        case 'frictionAir':
          body.frictionAir = value
          break
        case 'mass':
          Body.setMass(body, value)
          break
        case 'restitution':
          body.restitution = value
          break
        case 'density':
          Body.setDensity(body, value)
          break
        default:
          // Try setting directly
          if (body.hasOwnProperty(property)) {
            body[property] = value
          }
      }
    },

    /**
     * Set velocity of a body
     * @param {string} bodyId
     * @param {{ x: number, y: number }} velocity
     */
    setVelocity(bodyId, velocity) {
      const body = bodiesMapRef.current[bodyId]
      if (body) {
        Body.setVelocity(body, velocity)
      }
    },

    /**
     * Reset the entire simulation to initial config state
     */
    reset() {
      buildWorld()
    },

    /**
     * Launch a collision (for third-law type simulations)
     * Sets velocities of multiple objects simultaneously
     * @param {Array} launches - [{ id, velocity: { x, y } }, ...]
     */
    launchCollision(launches) {
      launches.forEach(({ id, velocity }) => {
        const body = bodiesMapRef.current[id]
        if (body) {
          Body.setVelocity(body, velocity)
        }
      })
    },

    /**
     * Get a body reference by its config ID
     */
    getBody(bodyId) {
      return bodiesMapRef.current[bodyId]
    },

    /**
     * Get all bodies
     */
    getAllBodies() {
      return { ...bodiesMapRef.current }
    }
  }))


  // ============================================================
  // Render
  // ============================================================
  return (
    <canvas
      ref={canvasRef}
      style={{
        border: '3px solid #2c3e50',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        display: 'block',
        width: '100%',
        maxWidth: `${canvasWidth}px`,
      }}
    />
  )
})

export default SimulationEngine
