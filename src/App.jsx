import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ThemeContext, NavContext } from './context'
import { useActiveSection } from './hooks/useActiveSection'
import { pathToSegment, pushPath } from './lib/router'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { AnnouncementBanner } from './components/AnnouncementBanner'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'
import { Dashboards } from './sections/Dashboards'
import { Installation } from './sections/Installation'
import { ConfigReference } from './sections/ConfigReference'
import { TuningGuides } from './sections/TuningGuides'
import { CandidateGains } from './sections/CandidateGains'
import { UsingGains } from './sections/UsingGains'
import { LibraryStructure } from './sections/LibraryStructure'
import { FAQ } from './sections/FAQ'
import { Footer } from './sections/Footer'
import { CommentsWidget } from './components/CommentsWidget'
import { ForumPage } from './pages/ForumPage'

const SECTION_IDS = [
  'overview', 'how-it-works', 'dashboards', 'installation', 'configuration',
  'tuning-guides', 'candidate-gains', 'using-gains', 'library-structure', 'faq',
]

export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState(() => (pathToSegment(window.location.pathname) === 'forum' ? 'forum' : 'docs'))
  const activeSection = useActiveSection(SECTION_IDS)

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Scroll to the section named in the URL once on first mount (deep link / refresh)
  useEffect(() => {
    const seg = pathToSegment(window.location.pathname)
    if (seg && seg !== 'forum' && SECTION_IDS.includes(seg)) {
      requestAnimationFrame(() => document.getElementById(seg)?.scrollIntoView({ behavior: 'auto' }))
    }
  }, [])

  // Keep state in sync with browser back/forward
  useEffect(() => {
    const onPopState = () => {
      const seg = pathToSegment(window.location.pathname)
      if (seg === 'forum') {
        setPage('forum')
      } else {
        setPage('docs')
        requestAnimationFrame(() => {
          document.getElementById(seg || 'overview')?.scrollIntoView({ behavior: 'auto' })
        })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const navigate = (target) => {
    if (target === 'forum') {
      setPage('forum')
      pushPath('forum')
      window.scrollTo(0, 0)
      return
    }
    if (target === 'docs') {
      setPage('docs')
      pushPath('docs')
      window.scrollTo(0, 0)
      return
    }
    // Section id — jump to docs page (if needed) then scroll to the anchor
    if (page !== 'docs') {
      setPage('docs')
      requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }))
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
    }
    pushPath(target)
  }

  if (page === 'forum') {
    return (
      <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
        <NavContext.Provider value={{ navigate }}>
          <Analytics />
          <SpeedInsights />
          <ForumPage />
        </NavContext.Provider>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      <NavContext.Provider value={{ navigate }}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <Analytics />
          <SpeedInsights />
          <AnnouncementBanner />
          <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
          {sidebarOpen && (
            <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className="flex pt-[92px]">
            <Sidebar activeSection={activeSection} isOpen={sidebarOpen} onNavClick={() => setSidebarOpen(false)} />
            <main className="flex-1 lg:ml-60 min-w-0 overflow-x-hidden">
              <Hero id="overview" />
              <HowItWorks id="how-it-works" />
              <Dashboards id="dashboards" />
              <Installation id="installation" />
              <ConfigReference id="configuration" />
              <TuningGuides id="tuning-guides" />
              <CandidateGains id="candidate-gains" />
              <UsingGains id="using-gains" />
              <LibraryStructure id="library-structure" />
              <FAQ id="faq" />
              <Footer />
            </main>
          </div>
        </div>
        <CommentsWidget />
      </NavContext.Provider>
    </ThemeContext.Provider>
  )
}
