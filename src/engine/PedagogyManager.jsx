/**
 * PedagogyManager.jsx
 * 
 * Manages the POE (Predict-Observe-Explain) pedagogical flow
 * based on the config's "pedagogy" section.
 * 
 * Displays as a collapsible guide panel above or below the controls.
 */
import { useState } from 'react'

const STAGE_ICONS = {
  predict: '🔮',
  observe: '👀',
  explain: '💡',
  extend: '🚀'
}

const STAGE_COLORS = {
  predict: { bg: '#e8f5e9', border: '#4caf50', text: '#2e7d32' },
  observe: { bg: '#e3f2fd', border: '#2196f3', text: '#1565c0' },
  explain: { bg: '#fff3e0', border: '#ff9800', text: '#e65100' },
  extend:  { bg: '#f3e5f5', border: '#9c27b0', text: '#6a1b9a' },
}


function StageCard({ stage, title, children, isActive, onClick }) {
  const colors = STAGE_COLORS[stage] || STAGE_COLORS.predict
  const icon = STAGE_ICONS[stage] || '📝'

  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? colors.bg : '#f8f9fa',
        border: `2px solid ${isActive ? colors.border : '#e0e0e0'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontWeight: '600',
          fontSize: '14px',
          color: isActive ? colors.text : '#666',
        }}>
          {icon} {title}
        </span>
        <span style={{
          fontSize: '12px',
          color: '#999',
          transform: isActive ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s',
        }}>
          ▼
        </span>
      </div>

      {/* Content */}
      {isActive && (
        <div style={{
          padding: '0 16px 16px 16px',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#333',
        }}>
          {children}
        </div>
      )}
    </div>
  )
}


export default function PedagogyManager({ pedagogy, onPredictionSelect }) {
  const [activeStage, setActiveStage] = useState('predict')
  const [selectedPrediction, setSelectedPrediction] = useState(null)

  if (!pedagogy) return null

  const handlePrediction = (choice, index) => {
    setSelectedPrediction(index)
    if (onPredictionSelect) {
      onPredictionSelect(choice)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Stage Progress */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '4px',
      }}>
        {['predict', 'observe', 'explain', 'extend'].map(stage => {
          if (stage === 'extend' && !pedagogy.extend?.challenge) return null
          return (
            <div
              key={stage}
              onClick={() => setActiveStage(stage)}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: activeStage === stage
                  ? STAGE_COLORS[stage].border
                  : '#e0e0e0',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            />
          )
        })}
      </div>

      {/* PREDICT Stage */}
      <StageCard
        stage="predict"
        title="Step 1: Predict"
        isActive={activeStage === 'predict'}
        onClick={() => setActiveStage(activeStage === 'predict' ? null : 'predict')}
      >
        <p style={{ marginBottom: '12px' }}>{pedagogy.predict?.prompt}</p>

        {/* Multiple choice predictions */}
        {pedagogy.predict?.choices && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {pedagogy.predict.choices.map((choice, i) => (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrediction(choice, i)
                }}
                style={{
                  padding: '10px 14px',
                  background: selectedPrediction === i
                    ? (choice.isCorrect ? '#c8e6c9' : '#ffcdd2')
                    : 'white',
                  border: `2px solid ${selectedPrediction === i
                    ? (choice.isCorrect ? '#4caf50' : '#f44336')
                    : '#e0e0e0'
                  }`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontWeight: '500' }}>
                  {String.fromCharCode(65 + i)}) {choice.label}
                </span>
                {selectedPrediction === i && !choice.isCorrect && choice.misconception && (
                  <div style={{
                    marginTop: '6px',
                    fontSize: '12px',
                    color: '#c62828',
                    fontStyle: 'italic',
                  }}>
                    💭 Common thinking: "{choice.misconception}"
                  </div>
                )}
                {selectedPrediction === i && choice.isCorrect && (
                  <div style={{
                    marginTop: '6px',
                    fontSize: '12px',
                    color: '#2e7d32',
                    fontWeight: '600',
                  }}>
                    ✅ Let's test this with the simulation!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedPrediction !== null && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setActiveStage('observe')
            }}
            style={{
              marginTop: '12px',
              padding: '10px 16px',
              background: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              width: '100%',
            }}
          >
            Now let's observe! →
          </button>
        )}
      </StageCard>

      {/* OBSERVE Stage */}
      <StageCard
        stage="observe"
        title="Step 2: Observe"
        isActive={activeStage === 'observe'}
        onClick={() => setActiveStage(activeStage === 'observe' ? null : 'observe')}
      >
        <div style={{ whiteSpace: 'pre-line', marginBottom: '12px' }}>
          {pedagogy.observe?.instructions}
        </div>

        {pedagogy.observe?.focusPoints && (
          <div style={{
            background: 'rgba(33,150,243,0.08)',
            padding: '10px 14px',
            borderRadius: '6px',
          }}>
            <strong style={{ fontSize: '12px', color: '#1565c0' }}>
              🎯 Focus on:
            </strong>
            <ul style={{ margin: '6px 0 0 16px', paddingLeft: '0' }}>
              {pedagogy.observe.focusPoints.map((point, i) => (
                <li key={i} style={{ marginBottom: '4px', fontSize: '12px' }}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pedagogy.observe?.keyMoment && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            background: '#fff9c4',
            borderRadius: '6px',
            fontSize: '12px',
          }}>
            <strong>⭐ Key moment:</strong> {pedagogy.observe.keyMoment}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            setActiveStage('explain')
          }}
          style={{
            marginTop: '12px',
            padding: '10px 16px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            width: '100%',
          }}
        >
          Ready to explain! →
        </button>
      </StageCard>

      {/* EXPLAIN Stage */}
      <StageCard
        stage="explain"
        title="Step 3: Explain"
        isActive={activeStage === 'explain'}
        onClick={() => setActiveStage(activeStage === 'explain' ? null : 'explain')}
      >
        <p style={{ marginBottom: '12px', fontWeight: '500' }}>
          {pedagogy.explain?.prompt}
        </p>

        {pedagogy.explain?.scaffoldingQuestions && (
          <ScaffoldingHints questions={pedagogy.explain.scaffoldingQuestions} />
        )}

        <details style={{ marginTop: '12px' }}>
          <summary style={{
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
            color: '#e65100',
          }}>
            🔑 Reveal the explanation
          </summary>
          <div style={{
            marginTop: '8px',
            padding: '12px',
            background: '#fff3e0',
            borderRadius: '6px',
            fontSize: '13px',
            lineHeight: '1.7',
          }}>
            {pedagogy.explain?.correctExplanation}
          </div>
        </details>
      </StageCard>

      {/* EXTEND Stage (optional) */}
      {pedagogy.extend?.challenge && (
        <StageCard
          stage="extend"
          title="Step 4: Challenge"
          isActive={activeStage === 'extend'}
          onClick={() => setActiveStage(activeStage === 'extend' ? null : 'extend')}
        >
          <p style={{ marginBottom: '8px' }}>
            <strong>🏆 Challenge:</strong> {pedagogy.extend.challenge}
          </p>
          {pedagogy.extend.transferQuestion && (
            <p style={{
              marginTop: '12px',
              padding: '10px',
              background: 'rgba(156,39,176,0.08)',
              borderRadius: '6px',
            }}>
              <strong>🌍 Transfer:</strong> {pedagogy.extend.transferQuestion}
            </p>
          )}
        </StageCard>
      )}
    </div>
  )
}


/**
 * Progressive hint reveal component
 */
function ScaffoldingHints({ questions }) {
  const [revealedCount, setRevealedCount] = useState(0)

  return (
    <div>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
        Need hints? Reveal them one at a time:
      </p>
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: '6px' }}>
          {i < revealedCount ? (
            <div style={{
              padding: '8px 12px',
              background: '#fff8e1',
              border: '1px solid #ffcc02',
              borderRadius: '6px',
              fontSize: '13px',
            }}>
              💡 {q}
            </div>
          ) : i === revealedCount ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setRevealedCount(prev => prev + 1)
              }}
              style={{
                padding: '6px 12px',
                background: 'none',
                border: '1px dashed #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#666',
                width: '100%',
                textAlign: 'left',
              }}
            >
              🔍 Reveal hint {i + 1} of {questions.length}
            </button>
          ) : null}
        </div>
      ))}
    </div>
  )
}
