import { useState, useRef, useEffect } from 'react'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import { generateAppraisal, finalizeAppraisal } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function AppraisalGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [notes, setNotes] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [finalizing, setFinalizing] = useState(false)
  const [finalized, setFinalized] = useState(false)
  const resultsRef = useRef(null)
  const { user } = useAuth()

  const handleGenerate = async () => {
    if (!notes.trim()) { setError('Please enter performance notes'); return }
    if (!employeeId.trim()) { setError('Please enter employee ID'); return }

    setIsGenerating(true)
    setError('')
    setResult(null)
    setFinalized(false)

    try {
      const res = await generateAppraisal(Number(employeeId), notes)
      setResult(res.data)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate appraisal. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFinalize = async () => {
    if (!result) return
    setFinalizing(true)
    try {
      await finalizeAppraisal(result.id)
      setFinalized(true)
    } catch (err) {
      setError('Failed to finalize appraisal.')
    } finally {
      setFinalizing(false)
    }
  }

  const getRatingColor = (rating) => {
    if (!rating) return 'text-on-surface-variant'
    if (rating.includes('Outstanding') || rating.includes('Exceeds')) return 'text-secondary'
    if (rating.includes('Meets')) return 'text-primary'
    return 'text-on-surface-variant'
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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 md:mb-16">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <FadeIn delay={0.1}>
            <div className="aveon-card p-6 md:p-8">
              <SectionTag className="mb-5 text-[0.55rem]">Employee Details</SectionTag>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Employee ID
                  </label>
                  <input
                    className="aveon-input"
                    placeholder="e.g. 2"
                    type="number"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                  />
                  <p className="text-xs text-on-surface-variant mt-1 font-body">
                    Enter the employee's user ID from the system
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Employee Name (optional)
                  </label>
                  <input
                    className="aveon-input"
                    placeholder="e.g. Jane Employee"
                    type="text"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="aveon-card p-6 md:p-8 flex-1">
              <SectionTag className="mb-5 text-[0.55rem]">Quick Tips</SectionTag>
              <ul className="text-on-surface-variant text-sm space-y-4 font-body">
                {[
                  'Mention specific project names.',
                  'Include peer feedback quotes.',
                  'Note measurable KPIs reached.',
                  'Add both strengths and areas to improve.',
                ].map((tip) => (
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
            </div>
            <textarea
              className="flex-1 w-full aveon-input resize-none min-h-[300px] leading-relaxed"
              placeholder="Type or paste unstructured notes here... e.g. 'Jane really stepped up during Q3. She handled stakeholder conflicts well but needs to work on documentation. Great team player, always helps juniors.'"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="aveon-btn aveon-btn-primary disabled:opacity-60 disabled:pointer-events-none"
              >
                <span className="material-symbols-outlined text-sm">
                  {isGenerating ? 'hourglass_empty' : 'auto_awesome'}
                </span>
                <span>{isGenerating ? 'Generating...' : 'Generate Summary'}</span>
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      {result && (
        <div ref={resultsRef} className="space-y-8">
          <FadeIn>
            <div className="flex items-end justify-between pb-4 border-b border-outline-variant/20">
              <div>
                <SectionTag className="mb-3">Synthesis Result</SectionTag>
                <h3 className="font-headline text-3xl text-primary">Performance Summary</h3>
                <p className="text-sm text-on-surface-variant font-body mt-1">
                  For: {result.employeeName} • By: {result.managerName}
                </p>
              </div>
              {!finalized ? (
                <button
                  onClick={handleFinalize}
                  disabled={finalizing}
                  className="aveon-btn aveon-btn-primary !py-2.5 !px-5 !text-[0.65rem] disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{finalizing ? 'Finalizing...' : 'Finalize'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-secondary text-sm font-body">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Finalized
                </div>
              )}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FadeIn delay={0.1}>
              <div className="aveon-card p-8">
                <div className="w-11 h-11 rounded-full border border-secondary/30 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-secondary">trending_up</span>
                </div>
                <h4 className="font-headline text-2xl text-primary mb-5">Key Strengths</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                  {result.strengths || 'No strengths data available.'}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="aveon-card p-8">
                <div className="w-11 h-11 rounded-full border border-outline-variant/30 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-on-surface-variant">psychology_alt</span>
                </div>
                <h4 className="font-headline text-2xl text-primary mb-5">Growth Areas</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body">
                  {result.improvements || 'No improvement areas data available.'}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-primary text-on-primary p-8 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                <h4 className="text-xs uppercase tracking-widest opacity-70 mb-6 font-body relative z-10">
                  Suggested Rating
                </h4>
                <div className="relative z-10 mb-4">
                  <span className={`font-headline text-3xl ${result.suggestedRating?.includes('Outstanding') || result.suggestedRating?.includes('Exceeds') ? 'text-secondary-fixed-dim' : 'text-on-primary'}`}>
                    {result.suggestedRating || 'N/A'}
                  </span>
                </div>
                <p className="text-xs opacity-60 relative z-10 font-body">
                  Based on AI analysis of performance notes
                </p>
                <span className={`mt-3 text-xs px-3 py-1 rounded-full relative z-10 ${finalized ? 'bg-secondary/20 text-secondary-fixed-dim' : 'bg-on-primary/10'}`}>
                  {result.status}
                </span>
              </div>
            </FadeIn>
          </div>
        </div>
      )}
    </div>
  )
}