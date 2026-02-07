export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant'
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: isAssistant ? 'flex-start' : 'flex-end',
      marginBottom: '15px'
    }}>
      <div style={{
        maxWidth: '80%',
        padding: '12px 16px',
        borderRadius: '12px',
        background: isAssistant ? 'white' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: isAssistant ? '#333' : 'white',
        border: isAssistant ? '1px solid #e0e0e0' : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '5px',
          opacity: 0.8
        }}>
          {isAssistant ? '🤖 Tutor' : '👤 You'}
        </div>
        <div style={{ fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
          {message.content}
        </div>
      </div>
    </div>
  )
}
