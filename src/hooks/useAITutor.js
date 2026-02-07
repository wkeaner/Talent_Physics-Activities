import { useState, useEffect } from 'react'

const INITIAL_MESSAGE = {
  role: 'assistant',
  content: `Hi! 👋 I'm your AI physics tutor.

I see you have a simulation with a red box that you can push on a surface. Before you start experimenting, I have a question for you:

**Prediction Question:**
If you set the friction to ZERO (imagine the box is on perfectly smooth ice) and give it a push, what do you think will happen AFTER you stop pushing?

A) The box will stop immediately
B) The box will slow down gradually  
C) The box will keep moving at the same speed

Make your prediction, then try it in the simulation and tell me what you observe!`,
  timestamp: new Date().toISOString()
}

// Mock AI responses for demo (when no API key)
const MOCK_RESPONSES = [
  "That's an interesting observation! Can you explain WHY you think that happened? What forces were acting on the box when it was moving?",
  
  "Good thinking! Now let me ask you this: When you removed the pushing force (it became zero), did the box stop IMMEDIATELY or did it take some time? Pay close attention to this detail!",
  
  "Excellent observation! You noticed it kept moving even after the force was removed. Now here's the key question: If there's NO force acting horizontally on the box, what makes it keep moving? 🤔",
  
  "I see you're thinking carefully about this. Let's do an experiment: Set friction to exactly 0, push the box once, and watch how long it moves. Then try friction = 1.0 and compare. What's different between the two cases?",
  
  "Great question! The key insight is about the ROLE of force in physics. Does force KEEP things moving, or does force CHANGE the motion? Think about what you observed when friction was zero versus when it was 1.0...",
  
  "You're discovering something really important! In the zero-friction case, the box kept going even though there was no force acting on it. What does this tell you about whether objects NEED a continuous force to maintain constant velocity? 🎯",
  
  "Exactly! You've discovered Newton's First Law of Motion: Objects in motion stay in motion at constant velocity UNLESS a net force acts on them. Force doesn't 'keep' objects moving - force CHANGES motion (speeds up, slows down, or changes direction). Excellent discovery work! 🎉"
]

export function useAITutor() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)

  const sendMessage = async (content) => {
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Use mock responses (you can replace with real API later)
    const response = {
      role: 'assistant',
      content: MOCK_RESPONSES[responseIndex % MOCK_RESPONSES.length],
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, response])
    setResponseIndex(prev => prev + 1)
    setIsLoading(false)
  }

  return {
    messages,
    sendMessage,
    isLoading
  }
}
