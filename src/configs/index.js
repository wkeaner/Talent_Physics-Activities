/**
 * Simulation Config Registry
 * 
 * Import all config JSON files here.
 * This serves as the "catalog" of available simulations.
 */
import frictionConfig from './friction-newton1.json'
// import thirdLawConfig from './third-law-collision.json'    // ← uncomment when ready
// import projectileConfig from './projectile-motion.json'    // ← future
// import freeFallConfig from './free-fall.json'              // ← future

/**
 * All available simulations, keyed by their URL slug.
 * The key becomes the route: /sim/friction, /sim/third-law, etc.
 */
const SIMULATIONS = {
  'friction': {
    config: frictionConfig,
    emoji: '🧊',
    shortDescription: 'Explore how friction affects motion',
  },
  // 'third-law': {
  //   config: thirdLawConfig,
  //   emoji: '💥',
  //   shortDescription: 'Action-reaction forces in collisions',
  // },
}

export default SIMULATIONS
export { frictionConfig }
