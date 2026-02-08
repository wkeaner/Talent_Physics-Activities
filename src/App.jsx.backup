import { useState } from 'react'
import FrictionSimulation from './simulations/FrictionSimulation/FrictionSimulation'

function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>
            ⚛️ Physics Simulation Platform
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Interactive simulations with AI tutoring - Based on SPHERE misconception data
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <FrictionSimulation />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #ddd',
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '13px'
      }}>
        <p>Built with Matter.js & React | FCI10 Misconception: 45.3% prevalence in SPHERE dataset</p>
      </footer>
    </div>
  )
}

export default App
