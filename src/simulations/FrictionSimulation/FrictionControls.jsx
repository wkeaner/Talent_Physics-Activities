export default function FrictionControls({ friction, onFrictionChange, onPush, onReset }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Friction Slider */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <label style={{ display: 'block', fontWeight: '600', color: '#2c3e50', marginBottom: '10px', fontSize: '14px' }}>
          🎚️ Friction Coefficient: <span style={{ color: '#667eea' }}>{friction.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={friction}
          onChange={(e) => onFrictionChange(parseFloat(e.target.value))}
          style={{ width: '100%', height: '8px', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginTop: '5px' }}>
          <span>0 (Ice)</span>
          <span>0.5 (Normal)</span>
          <span>1.0 (Rough)</span>
        </div>
      </div>

      {/* Buttons */}
      <button
        onClick={onPush}
        style={{
          padding: '15px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
        onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
      >
        ➡️ Apply Force (Push Box)
      </button>
      
      <button
        onClick={onReset}
        style={{
          padding: '15px 20px',
          background: 'white',
          color: '#667eea',
          border: '2px solid #667eea',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        🔄 Reset Simulation
      </button>

      {/* Tips */}
      <div style={{
        background: '#fff3cd',
        border: '2px solid #ffc107',
        padding: '15px',
        borderRadius: '8px'
      }}>
        <h4 style={{ color: '#856404', fontSize: '14px', marginBottom: '10px', fontWeight: '600' }}>
          💡 Try This Experiment:
        </h4>
        <ol style={{ marginLeft: '20px', color: '#856404', fontSize: '13px' }}>
          <li style={{ marginBottom: '5px' }}>Set friction to <strong>0</strong> (like ice)</li>
          <li style={{ marginBottom: '5px' }}>Click "Apply Force"</li>
          <li style={{ marginBottom: '5px' }}>Watch - does the box stop?</li>
          <li style={{ marginBottom: '5px' }}>Now try friction = <strong>1.0</strong></li>
          <li>What's the difference?</li>
        </ol>
      </div>
    </div>
  )
}
