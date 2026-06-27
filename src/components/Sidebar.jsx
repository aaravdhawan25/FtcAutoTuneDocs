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

export function Sidebar({ activeSection, isOpen, onNavClick }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    onNavClick?.()
  }

  const content = (
    <nav aria-label="Page sections" className="px-3 py-6">
      <p className="px-3 mb-3 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest">
        Documentation
      </p>
      <ul className="space-y-0.5">
        {SECTIONS.map(({ id, label }) => {
          const isActive = activeSection === id
          return (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isActive
                    ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isActive && (
                    <motion.span
                      layoutId="active-dot"
                      className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"
                    />
                  )}
                  {!isActive && <span className="w-1.5 h-1.5 flex-shrink-0" />}
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto z-20">
        {content}
      </aside>

      {/* Mobile sidebar drawer */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="lg:hidden fixed left-0 top-16 bottom-0 w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto z-40 shadow-2xl"
        aria-hidden={!isOpen}
      >
        {content}
      </motion.aside>
    </>
  )
}
