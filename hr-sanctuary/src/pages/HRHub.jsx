import { Link } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import AveonButton from '../components/ui/AveonButton.jsx'

const modules = [
  {
    to: '/screening',
    tag: '01 / Module',
    title: 'Smart Screening',
    desc: 'AI-driven resume parsing and candidate ranking.',
    cta: 'Explore Module',
    icon: 'filter_alt',
  },
  {
    to: '/policy-qa',
    tag: '02 / Module',
    title: 'Policy Q&A',
    desc: 'Instant answers to internal employee policies.',
    cta: 'Ask Assistant',
    icon: 'assistant',
  },
  {
    to: '/appraisals',
    tag: '03 / Module',
    title: 'Appraisals',
    desc: 'Track performance and schedule reviews.',
    cta: 'Manage Reviews',
    icon: 'star_half',
  },
  {
    to: '/offers',
    tag: '04 / Module',
    title: 'Offer Center',
    desc: 'Generate and manage candidate offer letters.',
    cta: 'View Status',
    icon: 'send',
  },
]

const activities = [
  {
    icon: 'upload_file',
    title: 'New Resume Uploaded',
    desc: <>Senior Product Designer • <span className="text-secondary font-medium">85% Match</span></>,
    time: '2 mins ago',
    badge: 'PARSED',
  },
  {
    icon: 'assignment_turned_in',
    title: 'Appraisal Completed',
    desc: <>Q4 Review for James Miller • <span className="text-secondary font-medium">Exceeds Expectations</span></>,
    time: '1 hour ago',
    badge: 'FINALIZED',
  },
  {
    icon: 'contact_mail',
    title: 'Offer Sent',
    desc: 'Marketing Lead • Pending Signature',
    time: 'Yesterday',
    badge: 'SENT',
  },
]

const marqueeItems = [
  'Smart Screening', 'Policy Q&A', 'Appraisals', 'Offer Center',
  'AI-Powered HR', 'Candidate Ranking', 'Performance Reviews',
]

export default function HRHub() {
  return (
    <div className="px-6 md:px-12 max-w-screen-2xl mx-auto">
      {/* Hero */}
      <FadeIn>
        <section className="mb-16 md:mb-24 relative overflow-hidden rounded-2xl bg-surface-container-low border border-outline-variant/15 p-10 md:p-16 hero-overlay">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] pointer-events-none">
            <div className="display-hero italic text-primary whitespace-nowrap marquee-track">
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span key={i} className="mx-8">{item}</span>
              ))}
            </div>
          </div>
          <div className="relative z-10 max-w-3xl">
            <SectionTag className="mb-6">Welcome to HR Sanctuary</SectionTag>
            <h1 className="display-hero text-primary mb-6">
              workflows that <em className="italic text-secondary">tell a story</em>
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed mb-8 font-body">
              Good morning, Sarah. Today is a great day to nurture your team's growth. There are{' '}
              <span className="font-semibold text-primary">3 candidates</span> awaiting screening.
            </p>
            <div className="flex flex-wrap gap-4">
              <AveonButton as={Link} to="/screening">Explore Services</AveonButton>
              <AveonButton as={Link} to="/policy-qa" variant="outline">Ask Assistant</AveonButton>
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl breathe-element pointer-events-none" />
        </section>
      </FadeIn>

      {/* Modules */}
      <section className="mb-20 md:mb-28">
        <FadeIn className="mb-10">
          <SectionTag className="mb-4">What We Do</SectionTag>
          <h2 className="display-section text-primary">Full-Spectrum HR Excellence</h2>
          <p className="text-on-surface-variant mt-4 max-w-xl font-body">
            From screening to offers, every module elevates how you hire, manage, and support your team.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod, i) => (
            <FadeIn key={mod.to} delay={i * 0.1}>
              <Link to={mod.to} className="aveon-card block p-8 h-full group">
                <span className="section-tag text-[0.55rem] mb-6 block">{mod.tag}</span>
                <div className="w-12 h-12 rounded-full border border-outline-variant/30 flex items-center justify-center mb-6 group-hover:border-secondary/40 group-hover:bg-secondary/5 transition-all duration-500">
                  <span className="material-symbols-outlined text-secondary text-2xl">{mod.icon}</span>
                </div>
                <h3 className="font-headline text-2xl text-primary mb-3">{mod.title}</h3>
                <p className="text-on-surface-variant text-sm mb-8 leading-relaxed font-body">{mod.desc}</p>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary group-hover:text-secondary transition-colors duration-400">
                  {mod.cta}
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-400">arrow_forward</span>
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
        <div className="lg:col-span-2">
          <FadeIn>
            <div className="flex items-end justify-between mb-10 pb-4 border-b border-outline-variant/30">
              <div>
                <SectionTag className="mb-3">Recent Activity</SectionTag>
                <h3 className="display-section text-primary text-3xl">Latest Updates</h3>
              </div>
              <button className="nav-link-aveon text-xs pb-1">View All</button>
            </div>
          </FadeIn>

          <div className="space-y-3">
            {activities.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.08}>
                <div className="aveon-card p-5 md:p-6 flex items-center gap-5 group cursor-default">
                  <div className="w-11 h-11 rounded-full border border-outline-variant/25 flex items-center justify-center shrink-0 group-hover:border-secondary/30 transition-colors duration-400">
                    <span className="material-symbols-outlined text-secondary">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-on-surface font-body">{item.title}</p>
                    <p className="text-sm text-on-surface-variant font-body">{item.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-outline mb-2 font-body">{item.time}</p>
                    <span className="status-badge">{item.badge}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.2}>
          <div className="bg-primary text-on-primary p-8 md:p-10 rounded-2xl flex flex-col justify-between relative overflow-hidden min-h-[320px]">
            <div className="relative z-10">
              <SectionTag className="mb-6 !text-secondary-fixed-dim">
                <span className="!text-secondary-fixed-dim">Manager's Corner</span>
              </SectionTag>
              <p className="font-headline text-2xl md:text-3xl leading-snug mb-6 italic">
                "You've completed 80% of your reviews this week."
              </p>
              <p className="text-sm text-on-primary/70 leading-relaxed mb-8 font-body">
                Take a 5-minute breathing break to maintain your tranquility.
              </p>
              <button className="aveon-btn aveon-btn-outline !border-on-primary/30 !text-on-primary hover:!bg-on-primary/10 hover:!border-on-primary/50">
                <span>Start Mindfulness</span>
                <span className="aveon-btn-arrow material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
