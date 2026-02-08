/**
 * ControlFactory.jsx
 * 
 * Generates interactive controls (sliders, buttons, toggles, dropdowns)
 * from a simulation config's "controls" array.
 * 
 * Usage:
 *   <ControlFactory
 *     controls={config.controls}
 *     onAction={(actionType, params) => { ... }}
 *   />
 */
import { useState } from 'react'

// ============================================================
// Individual Control Components
// ============================================================

function SliderControl({ ctrl, onChange }) {
  const [value, setValue] = useState(ctrl.defaultValue ?? ctrl.range.min)

  const handleChange = (e) => {
    const newVal = parseFloat(e.target.value)
    setValue(newVal)
    onChange(ctrl.target, ctrl.property, newVal)
  }

  return (
    <div style={{
      background: 'white',
      padding: '16px 20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <label style={{
        display: 'block',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '10px',
        fontSize: '14px'
      }}>
        🎚️ {ctrl.label}:{' '}
        <span style={{ color: '#667eea', fontFamily: 'monospace' }}>
          {value.toFixed(2)}{ctrl.unit ? ` ${ctrl.unit}` : ''}
        </span>
      </label>
      <input
        type="range"
        min={ctrl.range.min}
        max={ctrl.range.max}
        step={ctrl.range.step}
        value={value}
        onChange={handleChange}
        style={{ width: '100%', height: '8px', cursor: 'pointer' }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#666',
        marginTop: '5px'
      }}>
        <span>{ctrl.range.min}{ctrl.unit ? ` ${ctrl.unit}` : ''}</span>
        <span>{ctrl.range.max}{ctrl.unit ? ` ${ctrl.unit}` : ''}</span>
      </div>
    </div>
  )
}


function ButtonControl({ ctrl, onAction }) {
  const isPrimary = ctrl.action !== 'reset'

  return (
    <button
      onClick={() => onAction(ctrl.action, ctrl.actionParams, ctrl.target)}
      style={{
        padding: '14px 20px',
        background: isPrimary
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'white',
        color: isPrimary ? 'white' : '#667eea',
        border: isPrimary ? 'none' : '2px solid #667eea',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        width: '100%',
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.97)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {ctrl.label}
    </button>
  )
}


function ToggleControl({ ctrl, onChange }) {
  const [active, setActive] = useState(false)

  const handleToggle = () => {
    const newVal = !active
    setActive(newVal)
    onChange(ctrl.target, ctrl.toggleProperty, newVal)
  }

  return (
    <div
      onClick={handleToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'white',
        padding: '14px 20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <span style={{ fontWeight: '600', fontSize: '14px', color: '#2c3e50' }}>
        {ctrl.label}
      </span>
      <div style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: active ? '#667eea' : '#ccc',
        position: 'relative',
        transition: 'background 0.2s',
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          top: '2px',
          left: active ? '22px' : '2px',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  )
}


function DropdownControl({ ctrl, onChange }) {
  const [selected, setSelected] = useState(ctrl.defaultValue ?? '')

  const handleChange = (e) => {
    const val = parseFloat(e.target.value)
    setSelected(val)
    onChange(ctrl.target, ctrl.property, val)
  }

  return (
    <div style={{
      background: 'white',
      padding: '16px 20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <label style={{
        display: 'block',
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: '10px',
        fontSize: '14px'
      }}>
        📋 {ctrl.label}
      </label>
      <select
        value={selected}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'inherit',
          background: 'white',
          cursor: 'pointer',
        }}
      >
        {(ctrl.options || []).map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}


// ============================================================
// Main ControlFactory Component
// ============================================================

export default function ControlFactory({ controls, onPropertyChange, onAction }) {
  if (!controls || controls.length === 0) return null

  // Group controls: sliders & dropdowns first, then buttons, then toggles
  const sliders = controls.filter(c => c.type === 'slider')
  const dropdowns = controls.filter(c => c.type === 'dropdown')
  const buttons = controls.filter(c => c.type === 'button')
  const toggles = controls.filter(c => c.type === 'toggle')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Sliders */}
      {sliders.map(ctrl => (
        <SliderControl
          key={ctrl.id}
          ctrl={ctrl}
          onChange={onPropertyChange}
        />
      ))}

      {/* Dropdowns */}
      {dropdowns.map(ctrl => (
        <DropdownControl
          key={ctrl.id}
          ctrl={ctrl}
          onChange={onPropertyChange}
        />
      ))}

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {buttons.map(ctrl => (
          <ButtonControl
            key={ctrl.id}
            ctrl={ctrl}
            onAction={onAction}
          />
        ))}
      </div>

      {/* Toggles */}
      {toggles.map(ctrl => (
        <ToggleControl
          key={ctrl.id}
          ctrl={ctrl}
          onChange={onPropertyChange}
        />
      ))}
    </div>
  )
}
