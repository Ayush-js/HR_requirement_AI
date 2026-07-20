import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'HR Hub' },
  { path: '/screening', label: 'Smart Screening' },
  { path: '/policy-qa', label: 'Policy Q&A' },
  { path: '/appraisals', label: 'Appraisals' },
  { path: '/offers', label: 'Offer Center' },
]

const mobileNavItems = [
  { path: '/', label: 'Hub', icon: 'home' },
  { path: '/screening', label: 'Screening', icon: 'filter_list' },
  { path: '/policy-qa', label: 'Q&A', icon: 'assistant' },
  { path: '/appraisals', label: 'Reviews', icon: 'star' },
  { path: '/offers', label: 'Offers', icon: 'send' },
]

export default function Layout() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Avéon-style fixed header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="flex justify-between items-center px-6 md:px-12 w-full max-w-screen-2xl mx-auto">
          <NavLink to="/" className="group flex items-center gap-3">
            <span className="font-headline text-2xl md:text-3xl tracking-tight text-primary group-hover:text-secondary transition-colors duration-400">
              HR Sanctuary
            </span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-link-aveon ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-on-surface-variant tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              AI Online
            </div>
            <button className="p-2.5 rounded-full border border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container-low transition-all duration-400 text-primary">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 md:pt-28 pb-32 min-h-screen">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
        <div className="glass-pill rounded-full shadow-[0_8px_40px_rgba(28,27,25,0.12)] flex justify-between items-center px-3 py-2 border border-outline-variant/20">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={
                  isActive
                    ? 'flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-4 py-2.5 shadow-lg active:scale-95 duration-400'
                    : 'flex flex-col items-center justify-center text-on-surface-variant p-2.5 hover:text-primary active:scale-95 duration-400'
                }
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-label text-[10px] font-medium mt-0.5 tracking-wide">{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
