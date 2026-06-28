import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeContext, NavContext } from './context'
import { useActiveSection } from './hooks/useActiveSection'
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
  'overview','how-it-works','dashboards','installation','configuration',
  'tuning-guides','candidate-gains','using-gains','library-structure','faq',
]

export default function App() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState('docs')
  const activeSection = useActiveSection(SECTION_IDS)

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const navigate = (p) => { setPage(p); window.scrollTo(0, 0) }

  if (page === 'forum') {
    return (
      <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
        <NavContext.Provider value={{ navigate }}>
          <Analytics />
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
