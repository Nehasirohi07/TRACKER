import { useState, useRef, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { Send, Bot, User, Trash2, Sparkles, Lightbulb, Target, Dumbbell, BookOpen, Zap, AlertCircle, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const quickActions = [
  { icon: Lightbulb, label: 'Get Productivity Tips', prompt: 'Give me 5 productivity tips for students' },
  { icon: Target, label: 'Create Study Plan', prompt: 'Create a 30-day study plan for AI/ML preparation' },
  { icon: Dumbbell, label: 'Fitness Recommendation', prompt: 'Suggest a daily workout routine for beginners' },
  { icon: BookOpen, label: 'Learning Path', prompt: 'What should I learn first for cybersecurity career?' },
  { icon: Zap, label: 'Motivation', prompt: 'Give me a motivational speech to stay focused on my goals' },
]

const domainSuggestions: Record<string, string[]> = {
  coding: ['Best resources to learn Python?', 'How to prepare for coding interviews?', 'Data structures practice tips'],
  aiml: ['How to start with machine learning?', 'Best AI courses for beginners?', 'Projects to build for portfolio'],
  cybersec: ['How to become an ethical hacker?', 'Best cybersecurity certifications?', 'Practice labs for beginners'],
  cds: ['CDS exam preparation strategy', 'Important topics for CDS English', 'CDS physical test tips'],
  ssc: ['SSC CPO exam pattern', 'Best books for SSC preparation', 'Mock test strategy'],
  english: ['How to improve English speaking?', 'Vocabulary building tips', 'English grammar fundamentals'],
  fitness: ['Daily workout routine for students', 'Nutrition tips for focus', 'Weight loss tips'],
}

const API_BASE = '/api'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const addToast = useToastStore((state) => state.addToast)
  const token = useAuthStore((state) => state.token)

  const sendMessage = useCallback(async (message: string) => {
    setIsTyping(true)
    setApiError(null)
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }])
    
    // Add a placeholder for the assistant response
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])
    
    try {
      const response = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: message.trim(),
          session_id: sessionId,
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || `Request failed with status ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response stream available')

      const decoder = new TextDecoder()
      let buffer = ''
      let fullResponse = ''
      let newSessionId = sessionId

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            line.slice(7).trim()
            continue
          }
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            try {
              const parsed = JSON.parse(data)
              if (parsed.session_id) {
                newSessionId = parsed.session_id
                setSessionId(newSessionId)
              }
            } catch {
              // It's a text chunk
              fullResponse += data
              // Update the last assistant message
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: fullResponse }
                return updated
              })
            }
          }
        }
      }

      // Update with complete response
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: fullResponse }
        return updated
      })
      
      setInput('')
    } catch (err: any) {
      console.error('[AI Mentor] Chat API error:', err)
      const msg = err?.message || ''
      let friendlyMsg: string
      if (msg.includes('503') || msg.includes('Service Unavailable') || msg.includes('AI service error')) {
        friendlyMsg = 'AI service is currently unavailable. Please try again later.'
      } else if (msg.includes('401') || msg.includes('Unauthorized')) {
        friendlyMsg = 'Authentication failed. Please log in again.'
      } else if (msg.includes('429') || msg.includes('rate limit')) {
        friendlyMsg = 'Rate limit exceeded. Please wait a moment before sending another message.'
      } else {
        friendlyMsg = msg || 'Failed to send message. Please try again.'
      }
      addToast('error', friendlyMsg)
      setApiError(friendlyMsg)
      
      // Remove the empty assistant message
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsTyping(false)
    }
  }, [sessionId, token, addToast])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(null)
    addToast('success', 'Chat history cleared')
  }, [addToast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isTyping) {
      sendMessage(input)
    }
  }

  const handleQuickAction = (prompt: string) => {
    if (!isTyping) {
      sendMessage(prompt)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: 'var(--accent-primary)' }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Mentor</h1>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">Your personal AI guide</p>
          </div>
        </div>
        <button 
          onClick={clearMessages} 
          className="btn-secondary flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* Domain Quick Actions */}
      <div className="flex gap-2 flex-wrap">
        {Object.keys(domainSuggestions).map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(selectedDomain === domain ? null : domain)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedDomain === domain ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Domain-specific suggestions */}
      <AnimatePresence>
        {selectedDomain && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 flex-wrap"
          >
            {domainSuggestions[selectedDomain]?.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(suggestion)}
                className="px-3 py-1.5 rounded-lg text-sm bg-[var(--bg-hover)] hover:bg-[var(--accent-primary)]/20 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                {getGreeting()}, Operative!
              </h3>
              <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--text-muted)' }}>
                I'm your AI mentor here to help you achieve your goals. Ask me anything about your training, career, or challenges!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-2xl mx-auto">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="p-3 rounded-lg text-left transition-all hover:scale-105"
                    style={{ backgroundColor: 'var(--bg-hover)' }}
                  >
                    <action.icon className="w-5 h-5 mb-1" style={{ color: 'var(--accent-primary)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{action.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 whitespace-pre-wrap ${
                  msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                }`}
                style={{
                  backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : 'var(--bg-hover)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                }}
              >
                {msg.content ? (
                  msg.role === 'assistant' ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )
                ) : (
                  msg.role === 'assistant' && isTyping ? (
                    <div className="flex gap-1">
                      {[0, 0.15, 0.3].map((delay, j) => (
                        <motion.span
                          key={j}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: 'var(--accent-primary)' }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay }}
                        />
                      ))}
                    </div>
                  ) : null
                )}
              </div>
              {msg.role === 'user' && (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'var(--bg-hover)' }}
                >
                  <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Banner */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 px-4 py-3 rounded-lg flex items-start gap-3"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--text-primary)',
            }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#ef4444' }}>Connection Error</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{apiError}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setApiError(null)
                  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
                  if (lastUserMsg) sendMessage(lastUserMsg.content)
                }}
                className="text-xs font-medium px-2 py-1 rounded flex items-center gap-1 hover:opacity-80"
                style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.15)' }}
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
              <button
                onClick={() => setApiError(null)}
                className="text-xs font-medium px-2 py-1 rounded hover:opacity-80"
                style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {/* Input */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI mentor..."
              className="flex-1"
            />
            <button 
              type="submit" 
              className="btn-primary px-4"
              disabled={isTyping || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </Card>
    </div>
  )
}
