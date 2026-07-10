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
  const [previewDate, setPreviewDate] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [finalized, setFinalized] = useState(false)
  const [finalizing, setFinalizing] = useState(false)
  const [error, setError] = useState('')
  const [recentOffers, setRecentOffers] = useState([])

  useEffect(() => {
    const now = new Date()
    setPreviewDate(now.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    }))
    getAllOffers()
      .then(res => setRecentOffers(res.data))
      .catch(() => {})
  }, [])

  const handleGenerate = async () => {
    if (!candidateId || !role || !salary || !joiningDate) {
      setError('Please fill all required fields')
      return
    }
    setGenerating(true)
    setError('')
    setResult(null)
    setFinalized(false)
    try {
      const res = await generateOfferLetter({
        candidateId: Number(candidateId),
        jobRole: role,
        salary: Number(salary),
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
      setResult(prev => ({ ...prev, status: 'FINALIZED' }))
      getAllOffers().then(res => setRecentOffers(res.data)).catch(() => {})
    } catch (err) {
      setError('Failed to finalize offer letter.')
    } finally {
      setFinalizing(false)
    }
  }

  const copyToClipboard = () => {
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
                    Candidate ID *
                  </label>
                  <input
                    className="aveon-input"
                    placeholder="e.g. 3"
                    type="number"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                  />
                  <p className="text-xs text-on-surface-variant mt-1 font-body">
                    Enter the candidate ID from the screening results
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                    Role *
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
                      Salary (Annual) *
                    </label>
                    <input
                      className="aveon-input"
                      placeholder="e.g. 800000"
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body">
                      Joining Date *
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
                  className="aveon-btn aveon-btn-primary w-full !justify-center mt-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm">
                    {generating ? 'hourglass_empty' : 'auto_awesome'}
                  </span>
                  <span>{generating ? 'Generating...' : 'Generate Draft'}</span>
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Recent offers */}
          {recentOffers.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="aveon-card p-6">
                <SectionTag className="mb-4 text-[0.55rem]">Recent Offers</SectionTag>
                <div className="space-y-3">
                  {recentOffers.slice(0, 3).map(offer => (
                    <div key={offer.id} className="flex items-center justify-between p-3 rounded-xl border border-outline-variant/15 bg-white/40">
                      <div>
                        <p className="text-sm font-medium font-body">{offer.candidateName}</p>
                        <p className="text-xs text-on-surface-variant font-body">{offer.jobRole}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-body ${offer.status === 'FINALIZED' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/20 text-on-surface-variant'}`}>
                        {offer.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>

        <FadeIn delay={0.15} className="lg:col-span-7">
          <div className="aveon-card p-1 h-full min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-secondary/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant/40" />
                <span className="ml-4 text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest font-body">
                  {result ? 'AI Generated Preview' : 'Preview Mode'}
                </span>
              </div>
              {result && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-secondary"
                    title="Copy content"
                  >
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-grow bg-surface-container-low mx-4 md:mx-6 mb-4 rounded-xl overflow-hidden flex flex-col">
              <div className="flex-grow overflow-y-auto p-8 md:p-12">
                {result ? (
                  <div className="max-w-2xl mx-auto bg-white p-10 md:p-14 shadow-sm min-h-full border border-outline-variant/10">
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
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">description</span>
                    <p className="text-on-surface-variant font-body">
                      Fill in the details and click Generate Draft to preview the offer letter here.
                    </p>
                  </div>
                )}
              </div>

              {result && (
                <div className="bg-surface-container px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/15">
                  <span className="text-xs text-on-surface-variant font-medium font-body">
                    {finalized ? '✅ Offer finalized' : 'Review and finalize when ready'}
                  </span>
                  <div className="flex gap-3">
                    {!finalized && (
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
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}