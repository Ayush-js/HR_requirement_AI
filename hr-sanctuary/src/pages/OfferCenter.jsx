import { useState, useEffect } from 'react'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import AveonButton from '../components/ui/AveonButton.jsx'

export default function OfferCenter() {
  const [candidateName, setCandidateName] = useState('')
  const [role, setRole] = useState('')
  const [salary, setSalary] = useState('')
  const [joiningDate, setJoiningDate] = useState('')
  const [previewDate, setPreviewDate] = useState('Current Date')
  const [previewOpacity, setPreviewOpacity] = useState(1)

  useEffect(() => {
    const now = new Date()
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    setPreviewDate(now.toLocaleDateString('en-US', options))
  }, [])

  const handleGenerate = () => {
    setPreviewOpacity(0.5)
    setTimeout(() => setPreviewOpacity(1), 300)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <FadeIn>
        <section className="mb-12 md:mb-16">
          <SectionTag className="mb-4">Offer Center</SectionTag>
          <h2 className="display-section text-primary mb-4">Create New Offer</h2>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed font-body">
            Craft bespoke offer letters that reflect our sanctuary values. Enter candidate details to generate a preview of the digital onboarding experience.
          </p>
        </section>
      </FadeIn>

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
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body" htmlFor="candidate_name">Candidate Name</label>
                  <input
                    className="aveon-input"
                    id="candidate_name"
                    placeholder="e.g., Alex Rivers"
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body" htmlFor="role">Role</label>
                  <input
                    className="aveon-input"
                    id="role"
                    placeholder="e.g., Senior Experience Designer"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body" htmlFor="salary">Salary (Annual)</label>
                    <input
                      className="aveon-input"
                      id="salary"
                      placeholder="$120,000"
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-on-surface-variant mb-2 font-body" htmlFor="joining_date">Joining Date</label>
                    <input
                      className="aveon-input"
                      id="joining_date"
                      type="date"
                      value={joiningDate}
                      onChange={(e) => setJoiningDate(e.target.value)}
                    />
                  </div>
                </div>
                <AveonButton className="w-full !justify-center mt-2" onClick={handleGenerate}>
                  Generate Draft
                </AveonButton>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-primary text-on-primary rounded-2xl p-6 flex items-start gap-4 animate-breathe relative overflow-hidden">
              <div className="w-11 h-11 rounded-full border border-on-primary/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">info</span>
              </div>
              <p className="text-sm leading-relaxed font-body relative z-10">
                Standard offers include health insurance, wellness stipend, and 25 days of vacation as part of our sanctuary package.
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
                <span className="ml-4 text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest font-body">Preview Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-secondary" title="Copy Email">
                  <span className="material-symbols-outlined">content_copy</span>
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-container-low transition-colors text-secondary" title="Download PDF">
                  <span className="material-symbols-outlined">picture_as_pdf</span>
                </button>
              </div>
            </div>

            <div className="flex-grow bg-surface-container-low mx-4 md:mx-6 mb-4 rounded-xl overflow-hidden flex flex-col">
              <div
                className="flex-grow overflow-y-auto p-8 md:p-12 offer-preview-canvas scroll-smooth transition-opacity duration-300"
                style={{ opacity: previewOpacity }}
              >
                <div className="max-w-2xl mx-auto bg-white p-10 md:p-14 shadow-[0_10px_40px_rgba(28,27,25,0.04)] min-h-full border border-outline-variant/10">
                  <div className="mb-12 flex justify-between items-start">
                    <div>
                      <h4 className="font-headline text-2xl text-primary uppercase tracking-tight">HR Sanctuary</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1 font-body">Human Resources Division</p>
                    </div>
                    <div className="text-right text-xs text-on-surface-variant font-body">
                      <p>{previewDate}</p>
                    </div>
                  </div>
                  <div className="space-y-6 text-on-surface-variant text-sm leading-relaxed font-body">
                    <p className="font-medium text-on-surface text-base">
                      Dear <span className="text-secondary font-headline text-lg">{candidateName || '[Candidate Name]'}</span>,
                    </p>
                    <p>
                      We are absolutely delighted to offer you the position of <span className="font-medium text-on-surface">{role || '[Role Name]'}</span> at HR Sanctuary. Following our recent conversations, we are confident that your unique skills and background will be a profound addition to our culture of tranquility and high-performance.
                    </p>
                    <p>
                      As part of this role, your annual base salary will be <span className="font-medium text-on-surface">{salary || '[Salary Amount]'}</span>, payable in accordance with our standard payroll cycle. We are proposing a start date of <span className="font-medium text-on-surface">{joiningDate || '[Joining Date]'}</span>.
                    </p>
                    <div className="h-px bg-outline-variant/30 my-8" />
                    <h5 className="text-secondary font-semibold uppercase tracking-widest text-[10px] mb-4">Core Benefits</h5>
                    <ul className="space-y-3 list-none pl-0">
                      {[
                        { icon: 'spa', text: '$2,500 Annual Sanctuary Wellness Stipend' },
                        { icon: 'event', text: '25 Days Paid Leave + Floating Sanctuary Days' },
                        { icon: 'verified_user', text: 'Comprehensive Health & Mental Wellness Coverage' },
                      ].map((b) => (
                        <li key={b.text} className="flex gap-3">
                          <span className="material-symbols-outlined text-secondary text-sm">{b.icon}</span>
                          <span>{b.text}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8">We look forward to having you join our sanctuary. Please let us know if you have any questions regarding this offer.</p>
                    <div className="mt-12 pt-8 border-t border-outline-variant/20">
                      <p className="mb-1">Best regards,</p>
                      <p className="font-headline text-xl text-primary">Sarah Jenkins</p>
                      <p className="text-xs">HR Director, HR Sanctuary</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-outline-variant/15">
                <span className="text-xs text-on-surface-variant font-medium font-body">Ready to send?</span>
                <div className="flex gap-3">
                  <button className="aveon-btn aveon-btn-outline !py-2 !px-5 !text-[0.65rem]">
                    <span>Save Record</span>
                  </button>
                  <button className="aveon-btn aveon-btn-primary !py-2 !px-5 !text-[0.65rem]">
                    <span>Send Offer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
