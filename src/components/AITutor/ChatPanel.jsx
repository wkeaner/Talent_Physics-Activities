import { useState, useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'

export default function ChatPanel({ messages, onSendMessage, isLoading }) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
          🤖 AI Physics Tutor
        </h3>
        <p style={{ fontSize: '12px', opacity: 0.9 }}>
          I'll guide you through discovering physics concepts!
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        background: '#fafafa'
      }}>
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#666' }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #667eea',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ fontSize: '13px' }}>AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid #ddd',
        padding: '20px',
        background: 'white'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          placeholder="Share your observations, predictions, or questions..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            resize: 'vertical',
            fontSize: '14px',
            fontFamily: 'inherit',
            minHeight: '80px'
          }}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '12px',
            background: isLoading || !input.trim() ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        <p style={{ fontSize: '11px', color: '#999', textAlign: 'center', marginTop: '8px' }}>
          💡 Tip: Press Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
