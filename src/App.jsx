import { useState, useEffect } from 'react'
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
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

        <div className="flex pt-16">
          <Sidebar
            activeSection={activeSection}
            isOpen={sidebarOpen}
            onNavClick={handleNavClick}
          />

          <main className="flex-1 lg:ml-64 min-w-0 overflow-x-hidden">
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
    </ThemeContext.Provider>
  )
}
