import { motion } from 'framer-motion'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'dashboards', label: 'Dashboards' },
  { id: 'installation', label: 'Installation' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'tuning-guides', label: 'Tuning Guides' },
  { id: 'candidate-gains', label: 'Candidate Gains' },
  { id: 'using-gains', label: 'Using Your Gains' },
  { id: 'library-structure', label: 'Library Structure' },
  { id: 'faq', label: 'FAQ & Troubleshooting' },
]

function NavItem({ id, label, isActive, onClick }) {
  return (
    <li>
      <button
        onClick={() => onClick(id)}
        className={`relative w-full text-left text-[13px] px-3 py-[7px] rounded-md transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isActive
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-medium'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-blue-500 rounded-r-full"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className={isActive ? 'pl-1' : ''}>{label}</span>
      </button>
    </li>
  )
}

export function Sidebar({ activeSection, isOpen, onNavClick }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    onNavClick?.()
  }

  const content = (
    <div className="px-4 py-6">
      <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] px-3 mb-2">
        Documentation
      </p>
      <nav aria-label="Page sections">
        <ul className="space-y-0.5">
          {SECTIONS.map(({ id, label }) => (
            <NavItem
              key={id}
              id={id}
              label={label}
              isActive={activeSection === id}
              onClick={scrollTo}
            />
          ))}
        </ul>
      </nav>

      {/* Bottom links */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.12em] px-3 mb-2">
          Resources
        </p>
        <ul className="space-y-0.5">
          {[
            { label: 'GitHub ↗', href: 'https://github.com/aaravdhawan25/FtcAutoTune' },
            { label: 'QuickStart ↗', href: 'https://github.com/aaravdhawan25/FtcAutoTuneQuickStart' },
            { label: 'JitPack ↗', href: 'https://jitpack.io/#aaravdhawan25/FtcAutoTune' },
          ].map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[13px] px-3 py-[7px] rounded-md text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-14 bottom-0 w-60 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto z-20">
        {content}
      </aside>

      {/* Mobile drawer */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 350, damping: 35 }}
        className="lg:hidden fixed left-0 top-14 bottom-0 w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto z-40 shadow-xl"
        aria-hidden={!isOpen}
      >
        {content}
      </motion.aside>
    </>
  )
}
