export default function SimulationLayout({ title, description, simulation, controls, chat }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      minHeight: 'calc(100vh - 200px)',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* Left Panel */}
      <div style={{ padding: '30px', background: '#f8f9fa' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '5px' }}>
            {title}
          </h2>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>
            {description}
          </p>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          {simulation}
        </div>
        
        <div>
          {controls}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ borderLeft: '2px solid #ddd', background: 'white' }}>
        {chat}
      </div>
    </div>
  )
}
