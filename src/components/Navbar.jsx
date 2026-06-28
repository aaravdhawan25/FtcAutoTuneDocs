import { useState, useEffect } from 'react'
import { Menu, Github, Sun, Moon, Cpu } from 'lucide-react'
import { useTheme } from '../context'

const NAV_LINKS = [
  { label: 'Overview', href: 'overview' },
  { label: 'Install', href: 'installation' },
  { label: 'Configure', href: 'configuration' },
  { label: 'Tuning', href: 'tuning-guides' },
  { label: 'API', href: 'library-structure' },
  { label: 'FAQ', href: 'faq' },
]

export function Navbar({ onMenuClick }) {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-9 z-40 h-14 flex items-center transition-all duration-200 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-none'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">

        {/* Left: hamburger + wordmark */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="lg:hidden -ml-1 p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu size={18} />
          </button>

          <button
            onClick={() => scrollTo('overview')}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500">
              <Cpu size={14} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="font-semibold text-[15px] text-slate-900 dark:text-white tracking-tight">
              FTC-AutoTune
            </span>
          </button>

          {/* Version badge */}
          <span className="hidden sm:inline-flex items-center h-5 px-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] font-medium border border-slate-200 dark:border-slate-700 ml-1">
            v0.3.6
          </span>
        </div>

        {/* Center: nav links */}
        <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => scrollTo(href)}
              className="px-3 py-1.5 text-[13.5px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors duration-150"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right: GitHub + theme */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <a
            href="https://github.com/aaravdhawan25/FtcAutoTune"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Github size={17} />
          </a>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          <button
            onClick={toggle}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}
