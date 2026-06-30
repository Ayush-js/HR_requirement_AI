import { useState } from 'react'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import AveonButton from '../components/ui/AveonButton.jsx'

export default function SmartScreening() {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-12">
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-[-1] breathe-element" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-[-1] breathe-element" style={{ animationDelay: '-2s' }} />

      <FadeIn>
        <section className="mb-12 md:mb-16">
          <SectionTag className="mb-4">Smart Screening</SectionTag>
          <h2 className="display-section text-primary mb-4">Intelligent Candidate Ranking</h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl font-body leading-relaxed">
            Multi-file resume analysis and AI-driven ranking for your open positions.
          </p>
        </section>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <FadeIn delay={0.1}>
          <div className="aveon-card p-8 flex flex-col justify-between h-full">
            <div>
              <SectionTag className="mb-5 text-[0.55rem]">Target Role</SectionTag>
              <div className="relative group">
                <select className="aveon-input appearance-none cursor-pointer pr-10">
                  <option>Senior UX Designer</option>
                  <option>HR Specialist</option>
                  <option>Technical Architect</option>
                  <option>Marketing Lead</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-8 font-body">
              Selecting a job description calibrates the AI to look for specific keywords, experience levels, and cultural fit markers.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="md:col-span-2">
          <div className={`aveon-card p-1 border-dashed transition-all group relative overflow-hidden h-full ${isDragOver ? '!border-secondary bg-secondary/5' : ''}`}>
            <div
              className="h-full w-full rounded-xl flex flex-col items-center justify-center py-12 px-6 cursor-pointer"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 rounded-full border border-outline-variant/30 flex items-center justify-center mb-5 group-hover:border-secondary/40 group-hover:scale-110 transition-all duration-500">
                <span className="material-symbols-outlined text-secondary text-3xl">upload_file</span>
              </div>
              <h3 className="font-headline text-2xl mb-2 text-primary">Drop Resumes Here</h3>
              <p className="text-on-surface-variant text-center max-w-xs mb-6 text-sm font-body">
                Support for PDF and Word files. You can upload up to 50 files at once for bulk screening.
              </p>
              <AveonButton variant="primary">Select Files</AveonButton>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <FadeIn delay={0.1} className="lg:col-span-4">
          <div className="aveon-card p-6 sticky top-28">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
              <h3 className="font-headline text-xl text-primary">Processing Queue</h3>
              <span className="status-badge">8 Active</span>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="p-4 rounded-xl border border-outline-variant/15 flex items-center gap-3 bg-white/40">
                <div className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-lg">check_circle</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate font-body">cv_alex_rivera.pdf</p>
                  <p className="text-[10px] text-secondary uppercase tracking-wider">Done • 1.2 MB</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-secondary/20 flex items-center gap-3 bg-white/50">
                <div className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-secondary/10 origin-bottom scale-y-[0.6]" />
                  <span className="material-symbols-outlined text-secondary text-lg animate-spin">refresh</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate font-body">resume_jane_doe.docx</p>
                  <div className="w-full bg-surface-container h-0.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-secondary h-full w-[60%] rounded-full transition-all duration-1000" />
                  </div>
                </div>
              </div>
              {['port_sam_lee.pdf', 'marcus_cv_final.pdf'].map((file) => (
                <div key={file} className="p-4 rounded-xl border border-outline-variant/10 flex items-center gap-3 opacity-50">
                  <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">hourglass_empty</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate font-body">{file}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Waiting...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="lg:col-span-8">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-outline-variant/20">
              <div>
                <SectionTag className="mb-3">Results</SectionTag>
                <h3 className="font-headline text-3xl text-primary">Ranked Candidates</h3>
                <p className="text-sm text-on-surface-variant font-body mt-1">Ranked based on 'Senior UX Designer' criteria</p>
              </div>
              <div className="flex gap-3">
                <button className="aveon-btn aveon-btn-outline !py-2.5 !px-5 !text-[0.65rem]">Export Report</button>
                <button className="aveon-btn aveon-btn-primary !py-2.5 !px-5 !text-[0.65rem]">
                  <span>Bulk Action</span>
                </button>
              </div>
            </div>
          </FadeIn>

          <div className="space-y-5">
            {[
              {
                name: 'Alex Rivera',
                role: 'Senior Designer at DesignLabs • 8 years exp.',
                score: 98,
                highlight: true,
                tags: ['Figma Mastery', 'Design Systems', 'User Research'],
                quote: 'Exceptional alignment with design system architecture requirements...',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEeUNJ0HX6OkAYhn4d08lS-ozBYkT0hbU_NPVFohXaCCoqCl8vdV_Yw-wPUAfjcV0BAhNPiEXd64ofhnXgmiLtUV0HTMcmO-zRs0gdvj5zocXasjqDsxDCz-VavTXJF1dFRuz2Yvm1_F0z_M8LAkYWoCKqIA5PO2ShllSFwgWGvmhAsdWV096MVGDPu3tl29zKUaMXbG8NSs1oghIhHwanIlXdI6T1kt9V849kmi-OG38sXm-uRIoeyz9cHOTsGotO6LHl9QGJWEse',
              },
              {
                name: 'Jordan Chen',
                role: 'Lead Product Designer at FinTech Hub • 6 years exp.',
                score: 92,
                highlight: true,
                tags: ['Prototyping', 'Stakeholder Mgmt'],
                quote: 'Strong leadership background, slightly less focus on hands-on visual craft...',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhjPvGzxEao_P5sSku0IsBvlAjHY3ZjhlhtuuKhfm5q4LSZVtNl4IjfNq-HIZ6HlSKYITSD_vGa6P4hNCICqeTlLAdau7EmhjihQ9PxKPupogT3SYaF6egoHZqES1bFLx3Aekpjz_DlyH9sm4FJED82gydcC6XbEkx6gyifzutASzdI9EyzHMJzy9oXaV2N9pvDRIA1kTupMwkZFvxN8EkgNF_xagUN0KLE5lBvwusjhnE2Nc5yXP5CYFlF-ia5elRbB1BJxAQTY_T',
              },
              {
                name: 'Samantha Reed',
                role: 'UX Researcher at Global Insights • 4 years exp.',
                score: 74,
                highlight: false,
                tags: ['Quantitative Research'],
                quote: 'Excellent research skills, but profile lacks direct UI/UX design execution...',
                img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzPTabkdwBk83HL8GjRT4lgCbmSoD8o2UYcRREHqYhzKB5vGlbJZKm3pvuan1VJSRcpm43IdswRWR_XejpNMr8bTppCBuTjOKTAJuoYglbfeVmzV8VgUlRskV0WsD3oEghsZ9ZXhCQ_YNK-hoofwCVSEdSFPQoh53chxCTjqdRFAStCr7Qh8e4xLIZgtL8CV5nZeYfDcZq29aiapZLfunyqMhTiroVtdAgLkK8HOaWHgLR_4bQ-anlmsDWYF9MsQfXIlMku-D0JuzL',
              },
            ].map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.1}>
                <div className={`glass-card p-6 md:p-8 rounded-2xl hover:translate-y-[-4px] transition-all duration-500 ${!c.highlight ? 'opacity-80 hover:opacity-100' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-outline-variant/20">
                        <img className="w-full h-full object-cover" alt={`${c.name} portrait`} src={c.img} />
                      </div>
                      <div>
                        <h4 className="font-headline text-2xl text-primary">{c.name}</h4>
                        <p className="text-sm text-on-surface-variant font-body">{c.role}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {c.tags.map((tag) => (
                            <span key={tag} className="status-badge !text-[0.55rem]">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <div className={`font-headline text-4xl ${c.highlight ? 'text-secondary' : 'text-on-surface-variant'}`}>
                        {c.score}<span className="text-sm opacity-60 ml-0.5">%</span>
                      </div>
                      <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest">AI Score</span>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/15">
                    <p className="text-xs text-on-surface-variant italic font-body">"{c.quote}"</p>
                    <button className="nav-link-aveon text-xs shrink-0 flex items-center gap-1 group">
                      View Full Profile
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
