import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { ThemeContext } from './context'
import { useActiveSection } from './hooks/useActiveSection'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
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
import { AnnouncementBanner } from './components/AnnouncementBanner'

const SECTION_IDS = [
  'overview',
  'how-it-works',
  'dashboards',
  'installation',
  'configuration',
  'tuning-guides',
  'candidate-gains',
  'using-gains',
  'library-structure',
  'faq',
]

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved !== 'light'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeSection = useActiveSection(SECTION_IDS)

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  // Close sidebar on route-like navigation
  const handleNavClick = () => setSidebarOpen(false)

  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <Analytics />
        <AnnouncementBanner />
        <Navbar
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex pt-[92px]">
          <Sidebar
            activeSection={activeSection}
            isOpen={sidebarOpen}
            onNavClick={handleNavClick}
          />

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

      {/* Floating comments widget — fixed, bottom-right */}
      <CommentsWidget />
    </ThemeContext.Provider>
  )
}
