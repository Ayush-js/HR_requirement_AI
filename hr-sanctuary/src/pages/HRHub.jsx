import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import FadeIn from '../components/ui/FadeIn.jsx'
import SectionTag from '../components/ui/SectionTag.jsx'
import { getStats, getAllUsers } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function HRHub() {
  const [stats, setStats] = useState(null)
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    Promise.all([getStats(), getAllUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data)
        setEmployees(usersRes.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Candidates', value: stats.totalCandidates, icon: 'group', path: '/screening' },
    { label: 'Appraisals', value: stats.totalAppraisals, icon: 'star', path: '/appraisals' },
    { label: 'Offer Letters', value: stats.totalOffers, icon: 'send', path: '/offers' },
    { label: 'Policy Docs', value: stats.totalPolicies, icon: 'menu_book', path: '/policy-qa' },
  ] : []

  const roleColors = {
    ADMIN: 'bg-red-50 text-red-600',
    HR_MANAGER: 'bg-secondary/10 text-secondary',
    EMPLOYEE: 'bg-primary/10 text-primary',
    REPORTING_MANAGER: 'bg-purple-50 text-purple-600',
  }

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-12">
      <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none z-[-1]" />

      {/* Hero */}
      <FadeIn>
        <section className="mb-12 md:mb-16">
          <SectionTag className="mb-4">Welcome to HR Sanctuary</SectionTag>
          <h2 className="display-section text-primary mb-4">
            workflows that <span className="italic text-secondary">tell a story</span>
          </h2>
          <p className="text-on-surface-variant text-base md:text-lg max-w-xl font-body leading-relaxed">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'there'}.
            Here's your HR dashboard at a glance.
          </p>
        </section>
      </FadeIn>

      {/* Stats */}
      {loading ? (
        <div className="text-center py-8 text-on-surface-variant font-body">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {statCards.map((card, i) => (
            <FadeIn key={card.label} delay={i * 0.1}>
              <NavLink to={card.path}>
                <div className="aveon-card p-6 hover:translate-y-[-4px] transition-all duration-500 cursor-pointer">
                  <div className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-secondary text-lg">{card.icon}</span>
                  </div>
                  <div className="font-headline text-4xl text-primary mb-1">{card.value}</div>
                  <div className="text-xs text-on-surface-variant uppercase tracking-widest font-body">{card.label}</div>
                </div>
              </NavLink>
            </FadeIn>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <FadeIn delay={0.2}>
        <div className="mb-12">
          <SectionTag className="mb-6">Quick Actions</SectionTag>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Screen Resumes', desc: 'Upload and rank candidates with AI', icon: 'filter_list', path: '/screening', color: 'text-secondary' },
              { title: 'Ask Policy Q&A', desc: 'Get instant answers from policy docs', icon: 'assistant', path: '/policy-qa', color: 'text-primary' },
              { title: 'Generate Appraisal', desc: 'Convert notes into structured reviews', icon: 'auto_awesome', path: '/appraisals', color: 'text-secondary' },
              { title: 'Create Offer Letter', desc: 'Draft professional offer letters instantly', icon: 'send', path: '/offers', color: 'text-primary' },
              { title: 'Upload Policy', desc: 'Add new policy documents to the system', icon: 'upload_file', path: '/policy-qa', color: 'text-secondary' },
              { title: 'View Employees', desc: 'Browse all employees and their details', icon: 'people', path: '#employees', color: 'text-primary' },
            ].map((action, i) => (
              <FadeIn key={action.title} delay={i * 0.05}>
                <NavLink to={action.path}>
                  <div className="glass-card p-6 rounded-2xl hover:translate-y-[-4px] transition-all duration-500 cursor-pointer flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center shrink-0">
                      <span className={`material-symbols-outlined text-lg ${action.color}`}>{action.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-headline text-lg text-primary mb-1">{action.title}</h4>
                      <p className="text-xs text-on-surface-variant font-body leading-relaxed">{action.desc}</p>
                    </div>
                  </div>
                </NavLink>
              </FadeIn>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* Employees Section */}
      <FadeIn delay={0.3}>
        <div id="employees" className="mb-12">
          <div className="flex items-end justify-between mb-6 pb-4 border-b border-outline-variant/20">
            <div>
              <SectionTag className="mb-3">Team Directory</SectionTag>
              <h3 className="font-headline text-3xl text-primary">Employees</h3>
              <p className="text-sm text-on-surface-variant font-body mt-1">
                {employees.length} team member(s) in the system
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-on-surface-variant font-body">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant font-body">No employees found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {employees.map((emp, i) => (
                <FadeIn key={emp.id} delay={i * 0.05}>
                  <div className="aveon-card p-6 hover:translate-y-[-2px] transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-secondary text-xl">person</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-headline text-lg text-primary truncate">{emp.name}</h4>
                          <span className="text-[10px] text-on-surface-variant font-body shrink-0">
                            ID: {emp.id}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant font-body truncate mb-3">
                          {emp.email}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-semibold px-2 py-1 rounded-full font-body ${roleColors[emp.role] || 'bg-outline-variant/20 text-on-surface-variant'}`}>
                            {emp.role?.replace('_', ' ')}
                          </span>
                          <span className={`text-[10px] px-2 py-1 rounded-full font-body ${emp.isActive ? 'bg-secondary/10 text-secondary' : 'bg-red-50 text-red-500'}`}>
                            {emp.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  )
}