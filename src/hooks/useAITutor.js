/**
 * useAITutor.js (Updated)
 * 
 * Now accepts a config's system prompt and simulation context
 * to provide simulation-specific tutoring responses.
 * 
 * CHANGE FROM ORIGINAL:
 * - Accepts optional systemPrompt and config parameters
 * - Initial message is generated from config's pedagogy section
 * - Mock responses are tailored to the specific simulation
 * - When you add a real API later, just replace the mock section
 */
import { useState, useMemo } from 'react'

/**
 * Generate the initial AI message from the config's pedagogy
 */
function generateInitialMessage(config) {
  if (!config?.pedagogy?.predict) {
    return {
      role: 'assistant',
      content: `Hi! 👋 I'm your AI physics tutor. Let's explore this simulation together! What do you observe?`,
      timestamp: new Date().toISOString()
    }
  }

  const { predict } = config.pedagogy
  const concept = config.education?.concept || 'this physics concept'

  let content = `Hi! 👋 I'm your AI physics tutor.\n\n`
  content += `Today we're exploring **${concept}**.\n\n`
  content += `**🔮 Prediction Question:**\n${predict.prompt}\n\n`

  if (predict.choices && predict.choices.length > 0) {
    predict.choices.forEach((choice, i) => {
      content += `${String.fromCharCode(65 + i)}) ${choice.label}\n`
    })
    content += `\nMake your prediction, then try the simulation and tell me what you observe!`
  } else {
    content += `Think about it first, then try the simulation and share what you notice!`
  }

  return {
    role: 'assistant',
    content,
    timestamp: new Date().toISOString()
  }
}


/**
 * Generate mock responses from config's pedagogy section
 * These follow the POE (Predict-Observe-Explain) flow.
 */
function generateMockResponses(config) {
  const pedagogy = config?.pedagogy
  const aiTutor = pedagogy?.aiTutor
  const explain = pedagogy?.explain
  const observe = pedagogy?.observe

  const responses = []

  // Response 1: React to prediction
  if (aiTutor?.suggestedResponses?.ifIncorrectPrediction) {
    responses.push(aiTutor.suggestedResponses.ifIncorrectPrediction)
  } else {
    responses.push("Interesting prediction! Let's test it with the simulation. Try it out and tell me what you see.")
  }

  // Response 2: Guide observation
  if (observe?.keyMoment) {
    responses.push(
      `Great observation! Pay special attention to this: **${observe.keyMoment}**\n\nWhat did you notice?`
    )
  } else {
    responses.push("Good thinking! What exactly did you observe? Describe the motion you saw.")
  }

  // Response 3: Ask probing question
  if (explain?.scaffoldingQuestions?.[0]) {
    responses.push(
      `You're making great progress! Let me ask you this:\n\n${explain.scaffoldingQuestions[0]}`
    )
  } else {
    responses.push("Interesting! Can you explain WHY you think that happened? What forces were at work?")
  }

  // Response 4: More scaffolding
  if (explain?.scaffoldingQuestions?.[1]) {
    responses.push(
      `Good reasoning! Now think about this:\n\n${explain.scaffoldingQuestions[1]}`
    )
  } else {
    responses.push("You're getting close! Think about what happens when you change the variables. What stays the same?")
  }

  // Response 5: If stuck
  if (aiTutor?.suggestedResponses?.ifStuck) {
    responses.push(aiTutor.suggestedResponses.ifStuck)
  } else {
    responses.push("Let me give you a hint: Try changing one variable at a time and observe the effect. What pattern do you see?")
  }

  // Response 6: More scaffolding
  if (explain?.scaffoldingQuestions?.[2]) {
    responses.push(
      `Almost there! One more thing to consider:\n\n${explain.scaffoldingQuestions[2]}`
    )
  } else {
    responses.push("You're making excellent connections! How would you summarize what you've learned?")
  }

  // Response 7: Reveal correct explanation
  if (explain?.correctExplanation) {
    responses.push(
      `🎉 Excellent discovery work!\n\nHere's the key insight:\n\n**${explain.correctExplanation}**\n\nYou figured this out through your own observations — that's real physics thinking!`
    )
  } else {
    responses.push("Great work exploring this concept! You've made some wonderful discoveries. 🎉")
  }

  // Response 8+: Extension
  if (pedagogy?.extend?.challenge) {
    responses.push(
      `Now that you understand the concept, here's a challenge:\n\n🏆 **${pedagogy.extend.challenge}**\n\nGive it a try!`
    )
  }

  if (pedagogy?.extend?.transferQuestion) {
    responses.push(
      `Great job! Here's a transfer question to test your understanding:\n\n🌍 **${pedagogy.extend.transferQuestion}**\n\nHow does what you learned apply here?`
    )
  }

  // Fallback responses (if conversation continues)
  responses.push(
    "That's a great question! Try experimenting with the simulation to find out. Change one variable and observe the effect.",
    "Excellent thinking! You're really developing your physics intuition. What else would you like to explore?",
    "I love your curiosity! Feel free to try different settings and see what happens. Science is all about experimentation! 🧪"
  )

  return responses
}


/**
 * Main hook
 */
export function useAITutor(systemPrompt, config) {
  const initialMessage = useMemo(
    () => generateInitialMessage(config),
    [config]
  )

  const mockResponses = useMemo(
    () => generateMockResponses(config),
    [config]
  )

  const [messages, setMessages] = useState([initialMessage])
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

    // ─── Replace this section with real API call later ───
    // For now, use config-driven mock responses
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800))

    const response = {
      role: 'assistant',
      content: mockResponses[responseIndex % mockResponses.length],
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, response])
    setResponseIndex(prev => prev + 1)
    setIsLoading(false)
    // ─── End of mock section ──────────────────────────────

    /*
    // ─── REAL API VERSION (uncomment when ready) ───
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: systemPrompt || config?.pedagogy?.aiTutor?.systemPrompt,
          context: {
            concept: config?.education?.concept,
            misconception: config?.education?.misconception,
          }
        })
      })
      const data = await response.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I had trouble responding. Please try again!",
        timestamp: new Date().toISOString()
      }])
    }
    setIsLoading(false)
    // ─── End of real API section ──────────────────────
    */
  }

  return {
    messages,
    sendMessage,
    isLoading,
  }
}
