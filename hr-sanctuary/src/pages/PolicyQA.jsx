import { useState, useRef, useEffect } from 'react'
import SectionTag from '../components/ui/SectionTag.jsx'
import FadeIn from '../components/ui/FadeIn.jsx'
import { askPolicyQuestion, uploadPolicy, getAllPolicies } from '../api/api'

export default function PolicyQA() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your HR policy assistant. Upload a policy document or ask me anything about your company policies.",
      time: 'Just now',
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async () => {
    const text = inputValue.trim()
    if (!text) return

    const userMsg = { id: Date.now(), type: 'user', text, time: 'Just now' }
    setMessages((prev) => [...prev, userMsg])
    setInputValue('')
    setIsTyping(true)

    try {
      const res = await askPolicyQuestion(text)
      const { answer, sourceDocument } = res.data
      setIsTyping(false)
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: answer,
        time: 'Just now',
        source: sourceDocument,
      }])
    } catch (err) {
      setIsTyping(false)
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        time: 'Just now',
      }])
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadPolicy(file)
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: 'ai',
        text: `Policy document "${res.data.fileName}" uploaded successfully! You can now ask questions about it.`,
        time: 'Just now',
      }])
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        type: 'ai',
        text: 'Failed to upload policy document. Please try again.',
        time: 'Just now',
      }])
    } finally {
      setUploading(false)
    }
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
              Ask anything about company policies, benefits, or procedures.
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
                  <p className="text-on-surface leading-relaxed font-body">{msg.text}</p>
                  {msg.source && (
                    <div className="pt-4 mt-2 border-t border-outline-variant/20">
                      <span className="status-badge">{msg.source}</span>
                    </div>
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
          <div className="relative glass-pill rounded-full flex items-center px-6 py-2 border border-outline-variant/25 shadow-[0_8px_40px_rgba(28,27,25,0.08)]">
            <span className="material-symbols-outlined text-secondary mr-3">search</span>
            <input
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface py-4 text-sm placeholder:text-on-surface-variant/50 font-body"
              placeholder="Ask about leave policy, reimbursements, or benefits..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="p-2 text-on-surface-variant hover:text-secondary transition-colors"
                title="Upload policy document"
              >
                <span className="material-symbols-outlined">
                  {uploading ? 'hourglass_empty' : 'attach_file'}
                </span>
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