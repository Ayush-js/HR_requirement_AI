import { useState, useEffect } from 'react'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import { generateOfferLetter, finalizeOfferLetter, getAllOffers } from '../api/api'

export default function OfferCenter() {
  const [candidateId, setCandidateId] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [companyName, setCompanyName] = useState('HR Sanctuary')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [finalizing, setFinalizing] = useState(false)
  const [finalized, setFinalized] = useState(false)
  const [previewDate, setPreviewDate] = useState('')

  useEffect(() => {
    const now = new Date()
    setPreviewDate(now.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }))
  }, [])

  const handleGenerate = async () => {
    if (!candidateId) { setError('Please enter a candidate ID'); return }
    if (!role.trim()) { setError('Please enter a job role'); return }
    if (!salary.trim()) { setError('Please enter salary'); return }
    if (!joiningDate) { setError('Please select a joining date'); return }

    setGenerating(true)
    setError('')
    setResult(null)
    setFinalized(false)

    try {
      const res = await generateOfferLetter({
        candidateId: Number(candidateId),
        jobRole: role,
        salary: Number(salary.replace(/[^0-9.]/g, '')),
        joiningDate,
        companyName,
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate offer letter.')
    } finally {
      setGenerating(false)
    }
  }

  const handleFinalize = async () => {
    if (!result) return
    setFinalizing(true)
    try {
      await finalizeOfferLetter(result.id)
      setFinalized(true)
    } catch (err) {
      setError('Failed to finalize offer letter.')
    } finally {
      setFinalizing(false)
    }
  }

  const handleCopy = () => {
    if (result?.generatedContent) {
      navigator.clipboard.writeText(result.generatedContent)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <FadeIn>
        <section className="mb-12 md:mb-16">
          <SectionTag className="mb-4">Offer Center</SectionTag>
          <h2 className="display-section text-primary mb-4">Create New Offer</h2>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed font-body">
            Generate professional offer letters instantly. Enter candidate details and let AI craft the perfect offer.
          </p>
        </section>
      </FadeIn>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <FadeIn delay={0.1}>
            <div className="aveon-card p-8">
              <div className="flex items-center gap-2 mb-8 pb-4 border-b border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary">edit_note</span>
                <h3 className="font-headline text-2xl text-primary">Details</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Candidate ID
                  </label>
                  <input
                    className="aveon-input"
                    placeholder="e.g. 3"
                    type="number"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                  />
                  <p className="text-xs text-on-surface-variant mt-1 font-body">
                    Enter the candidate ID from Smart Screening
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Job Role
                  </label>
                  <input
                    className="aveon-input"
                    placeholder="e.g. Java Backend Developer"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Company Name
                  </label>
                  <input
                    className="aveon-input"
                    placeholder="e.g. HR Sanctuary"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                      Salary (Annual)
                    </label>
                    <input
                      className="aveon-input"
                      placeholder="800000"
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                      Joining Date
                    </label>
                    <input
                      className="aveon-input"
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="aveon-btn aveon-btn-primary w-full !justify-center disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm">
                    {generating ? 'hourglass_empty' : 'auto_awesome'}
                  </span>
                  <span>{generating ? 'Generating...' : 'Generate Draft'}</span>
                </button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-primary text-on-primary rounded-2xl p-6 flex items-start gap-4 relative overflow-hidden">
              <div className="w-11 h-11 rounded-full border border-on-primary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">info</span>
              </div>
              <p className="text-sm leading-relaxed font-body relative z-10">
                The AI will generate a complete professional offer letter based on your inputs. You can copy or finalize it after review.
              </p>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl pointer-events-none" />
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15} className="lg:col-span-7">
          <div className="aveon-card p-1 h-full min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-secondary/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant/40" />
                <span className="ml-4 text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest font-body">
                  Preview Mode
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!result}
                  className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-secondary disabled:opacity-30"
                  title="Copy content"
                >
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </div>

            <div className="flex-grow bg-surface-container-low mx-4 md:mx-6 mb-4 mt-4 rounded-xl overflow-hidden flex flex-col">
              <div className="flex-grow overflow-y-auto p-8 md:p-12">
                {!result ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">description</span>
                    <p className="text-on-surface-variant font-body text-sm">
                      Fill in the details and click Generate Draft to create an offer letter
                    </p>
                  </div>
                ) : (
                  <div className="max-w-2xl mx-auto bg-white p-10 md:p-14 shadow-sm border border-outline-variant/10 rounded">
                    <div className="mb-12 flex justify-between items-start">
                      <div>
                        <h4 className="font-headline text-2xl text-primary uppercase tracking-tight">
                          {companyName}
                        </h4>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-body">
                          Human Resources Division
                        </p>
                      </div>
                      <div className="text-right text-xs text-on-surface-variant font-body">
                        <p>{previewDate}</p>
                      </div>
                    </div>
                    <div className="text-on-surface-variant text-sm leading-relaxed font-body whitespace-pre-wrap">
                      {result.generatedContent}
                    </div>
                    {finalized && (
                      <div className="mt-8 pt-6 border-t border-outline-variant/20 flex items-center gap-2 text-secondary text-sm font-body">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        This offer letter has been finalized
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-surface-container px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/15">
                <span className="text-xs text-on-surface-variant font-medium font-body">
                  {result ? (finalized ? 'Finalized ✓' : 'Ready to finalize') : 'Awaiting generation...'}
                </span>
                <div className="flex gap-3">
                  {result && !finalized && (
                    <button
                      onClick={handleFinalize}
                      disabled={finalizing}
                      className="aveon-btn aveon-btn-primary !py-2 !px-5 !text-[0.65rem] disabled:opacity-60"
                    >
                      <span>{finalizing ? 'Finalizing...' : 'Finalize Offer'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}