import { useState, useRef } from 'react'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
export default function AppraisalGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showHighlight, setShowHighlight] = useState(false)
  const [notes, setNotes] = useState('')
  const resultsRef = useRef(null)

  const handleGenerate = () => {
    if (isGenerating) return
    setIsGenerating(true)
    setShowHighlight(false)

    setTimeout(() => {
      setIsGenerating(false)
      setShowHighlight(true)
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => setShowHighlight(false), 1000)
    }, 1200)
  }

  return (
    <div className="px-6 md:px-12 max-w-6xl mx-auto">
      <FadeIn>
        <section className="mb-12 md:mb-16">
          <SectionTag className="mb-4">Appraisal Generator</SectionTag>
          <h2 className="display-section text-primary mb-4">Transform Observations Into Summaries</h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-2xl font-body leading-relaxed">
            AI-assisted synthesis that turns raw performance notes into professional reviews.
          </p>
        </section>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-16">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <FadeIn delay={0.1}>
            <div className="aveon-card p-6 md:p-8">
              <SectionTag className="mb-5 text-[0.55rem]">Employee Selection</SectionTag>
              <div className="relative group mb-6">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  className="aveon-input pl-12"
                  placeholder="Search team member..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/15 bg-white/40">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-outline-variant/20">
                  <img
                    className="w-full h-full object-cover"
                    alt="Marcus Chen portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPat645ECTuVIIwfJln8nT7otXU6cl_YYdR-VNPSKpBvkrCLBcr-bs4AKAfMjVX4VG7-MTKILl73Jm-PmpkLNiLWyOcQrSbW8_4-ULmUhby0hcKJ1i5Nn8OcuXJ7Xcvvx9dTJWhhhfi2DpsSU-czJd6AMxqgfEVVZcFdDlTRo0nkITeWp1-YKYwI0c6xXuaGYwKJvGhHA6TpfHpH81o6xNQR4W1CL0XAsg72CMIqKfx6AFidHOex9N62DSSQSTXDJVvRCpB4cyGj2K"
                  />
                </div>
                <div>
                  <p className="font-medium text-on-surface font-body">Marcus Chen</p>
                  <p className="text-xs text-on-surface-variant font-body">Senior Product Designer</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="aveon-card p-6 md:p-8 flex-1">
              <SectionTag className="mb-5 text-[0.55rem]">Quick Tips</SectionTag>
              <ul className="text-on-surface-variant text-sm space-y-4 font-body">
                {['Mention specific project names.', 'Include peer feedback quotes.', 'Note measurable KPIs reached.'].map((tip) => (
                  <li key={tip} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-secondary text-sm mt-0.5">check_circle</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="lg:col-span-8">
          <div className="aveon-card p-8 md:p-10 h-full flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <SectionTag className="text-[0.55rem]">Raw Performance Notes</SectionTag>
              <span className="text-outline text-xs uppercase tracking-widest font-body">Voice-to-text enabled</span>
            </div>
            <textarea
              className="flex-1 w-full aveon-input resize-none min-h-[300px] leading-relaxed"
              placeholder="Type or paste unstructured notes here... e.g., 'Marcus really stepped up during the Q3 launch. He handled the stakeholder conflict well but needs to work on documentation speed. Great team player, always helps juniors.'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="aveon-btn aveon-btn-primary disabled:opacity-60 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-sm">{isGenerating ? 'refresh' : 'auto_awesome'}</span>
                <span>{isGenerating ? 'Synthesizing...' : 'Generate Summary'}</span>
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      <div
        ref={resultsRef}
        className={`space-y-8 transition-all duration-500 ${showHighlight ? 'ring-2 ring-secondary/20 rounded-2xl p-2' : ''}`}
      >
        <FadeIn>
          <div className="flex items-end justify-between pb-4 border-b border-outline-variant/20">
            <div>
              <SectionTag className="mb-3">Synthesis Result</SectionTag>
              <h3 className="font-headline text-3xl text-primary">Performance Summary</h3>
            </div>
            <button className="nav-link-aveon text-xs flex items-center gap-1 pb-1">
              <span className="material-symbols-outlined text-sm">edit</span>
              Edit Draft
            </button>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FadeIn delay={0.1}>
            <div className="aveon-card p-8">
              <div className="w-11 h-11 rounded-full border border-secondary/30 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
              </div>
              <h4 className="font-headline text-2xl text-primary mb-5">Key Strengths</h4>
              <ul className="space-y-4 font-body text-sm text-on-surface-variant leading-relaxed">
                <li className="flex gap-3"><span className="text-secondary">•</span>Exceptional conflict resolution skills during high-pressure Q3 launch.</li>
                <li className="flex gap-3"><span className="text-secondary">•</span>Proactive mentorship of junior design staff, improving team cohesion.</li>
                <li className="flex gap-3"><span className="text-secondary">•</span>Strong ownership of end-to-end design processes.</li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="aveon-card p-8">
              <div className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-on-surface-variant">psychology_alt</span>
              </div>
              <h4 className="font-headline text-2xl text-primary mb-5">Growth Areas</h4>
              <ul className="space-y-4 font-body text-sm text-on-surface-variant leading-relaxed">
                <li className="flex gap-3"><span className="text-secondary">•</span>Optimization of documentation turnaround times post-sprint.</li>
                <li className="flex gap-3"><span className="text-secondary">•</span>Increasing visibility of design decisions to non-technical stakeholders.</li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="bg-primary text-on-primary p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-secondary/10 breathe-element pointer-events-none" />
              <h4 className="text-xs uppercase tracking-widest opacity-70 mb-6 font-body relative z-10">Suggested Rating</h4>
              <div className="relative w-32 h-32 flex items-center justify-center mb-4 z-10">
                <svg className="absolute w-full h-full -rotate-90">
                  <circle className="text-on-primary/20" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeWidth="6" />
                  <circle className="text-secondary-fixed-dim" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" strokeDasharray="364.4" strokeDashoffset="72.8" strokeLinecap="round" strokeWidth="6" />
                </svg>
                <span className="text-5xl font-headline italic">4.5</span>
              </div>
              <p className="font-medium text-lg relative z-10 font-body">Exceeds Expectations</p>
              <p className="text-xs opacity-60 mt-2 relative z-10 font-body">Based on current synthesis logic</p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
