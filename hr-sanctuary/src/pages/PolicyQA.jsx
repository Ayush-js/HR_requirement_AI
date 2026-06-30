import { useState, useRef, useEffect } from 'react'
import SectionTag from '../components/ui/SectionTag.jsx'
import FadeIn from '../components/ui/FadeIn.jsx'

const initialMessages = [
  {
    id: 1,
    type: 'ai',
    text: "Hello Sarah! I'm your dedicated HR policy assistant. I have access to the latest employee handbook and corporate guidelines. How can I help you today?",
    time: 'Just now',
    citations: null,
  },
  {
    id: 2,
    type: 'user',
    text: "What is the current policy for remote work stipends? I'm looking to upgrade my home office chair.",
    time: '2 mins ago',
  },
  {
    id: 3,
    type: 'ai',
    text: null,
    time: '1 min ago',
    citations: ['Employee Handbook 2024, Sec. 4.2', 'IT Equipment Policy v2'],
    parts: [
      "According to the 2024 Policy Update, full-time employees are eligible for a one-time remote work equipment stipend of up to <strong>$500</strong>. This covers ergonomic chairs, desks, and monitors.",
      "To claim this, you'll need to submit your receipts through the Offer Center portal under 'Equipment Reimbursement'.",
    ],
  },
]

export default function PolicyQA() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = () => {
    const text = inputValue.trim()
    if (!text) return

    const userMsg = { id: Date.now(), type: 'user', text, time: 'Just now' }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: "That's a great question, Sarah. I'm currently scanning the ZenBenefits 2024 module to provide the most accurate update. Please hold for a moment...",
        time: 'Just now',
        citations: null,
      }
      setMessages((prev) => [...prev, aiMsg])
    }, 2500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 7rem)' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 max-w-4xl mx-auto w-full space-y-10">
        <FadeIn>
          <header className="text-center py-8 md:py-12">
            <SectionTag className="mb-4 justify-center">Policy Q&A</SectionTag>
            <h2 className="display-section text-primary mb-3">Everything You Need to Know</h2>
            <p className="text-on-surface-variant max-w-md mx-auto font-body">
              Ask anything about Zenith Corporate policies, benefits, or procedures.
            </p>
          </header>
        </FadeIn>

        <div className="space-y-8">
          {messages.map((msg) => (
            msg.type === 'ai' ? (
              <div key={msg.id} className="flex flex-col items-start chat-bubble-in">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                    <span className="material-symbols-outlined text-sm">assistant</span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider font-body">
                    Policy Assistant • {msg.time}
                  </span>
                </div>
                <div className="glass-card p-6 md:p-8 rounded-2xl rounded-tl-sm max-w-[85%]">
                  {msg.parts ? (
                    <div className="space-y-4">
                      {msg.parts.map((part, i) => (
                        <p key={i} className="text-on-surface leading-relaxed font-body" dangerouslySetInnerHTML={{ __html: part }} />
                      ))}
                      {msg.citations && (
                        <div className="pt-4 mt-2 border-t border-outline-variant/20">
                          <div className="flex items-center gap-2 text-secondary font-semibold text-[10px] uppercase tracking-widest mb-3 font-body">
                            <span className="material-symbols-outlined text-sm">menu_book</span>
                            Citations
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {msg.citations.map((c, i) => (
                              <span key={i} className="status-badge cursor-pointer hover:bg-secondary/15 transition-colors">{c}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-on-surface leading-relaxed font-body">{msg.text}</p>
                  )}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-end chat-bubble-in">
                <div className="flex items-center gap-3 mb-2 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full border border-outline-variant/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm text-secondary">person</span>
                  </div>
                  <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider font-body">You • {msg.time}</span>
                </div>
                <div className="bg-primary text-on-primary p-6 md:p-8 rounded-2xl rounded-tr-sm max-w-[85%]">
                  <p className="leading-relaxed font-body">{msg.text}</p>
                </div>
              </div>
            )
          ))}

          {isTyping && (
            <div className="flex flex-col items-start chat-bubble-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-sm">assistant</span>
                </div>
              </div>
              <div className="glass-card px-6 py-5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="p-6 md:p-8 bg-gradient-to-t from-surface via-surface to-transparent z-30">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-secondary/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
          <div className="relative glass-pill rounded-full flex items-center px-6 py-2 border border-outline-variant/25 shadow-[0_8px_40px_rgba(28,27,25,0.08)]">
            <span className="material-symbols-outlined text-secondary mr-3">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface py-4 text-sm placeholder:text-on-surface-variant/50 font-body"
              placeholder="Ask about maternity leave, PTO, or health benefits..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex items-center gap-2">
              <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <button
                onClick={sendMessage}
                className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:bg-secondary hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span className="material-symbols-outlined">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
