import { useState, useEffect } from 'react'
import { Menu, X, Github, Sun, Moon, Cpu } from 'lucide-react'
import { useTheme } from '../context'

const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Install', href: '#installation' },
  { label: 'Configure', href: '#configuration' },
  { label: 'Tuning', href: '#tuning-guides' },
  { label: 'API', href: '#library-structure' },
  { label: 'FAQ', href: '#faq' },
]

export function Navbar({ onMenuClick }) {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href) => {
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-16 transition-all duration-200 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6 max-w-screen-2xl mx-auto">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Menu size={20} />
          </button>

          <a
            href="#overview"
            onClick={(e) => { e.preventDefault(); handleNavClick('#overview') }}
            className="flex items-center gap-2 no-underline"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Cpu size={18} className="text-blue-500" />
            </div>
            <span className="font-bold text-blue-500 text-lg tracking-tight">FtcAutoTune</span>
          </a>
        </div>

        {/* Center: nav links (desktop) */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
              className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right: GitHub + theme toggle */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/aaravdhawan25/FtcAutoTune"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Github size={20} />
          </a>

          <button
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}
