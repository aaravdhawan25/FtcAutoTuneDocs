import { Github, Cpu, ExternalLink } from 'lucide-react'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500">
                <Cpu size={13} className="text-white" strokeWidth={2.5} />
              </span>
              <span className="font-semibold text-[15px] text-slate-900 dark:text-white">FTC-AutoTune</span>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-500 leading-relaxed mb-3">
              Relay-feedback PID/PIDF auto-tuning for FIRST Tech Challenge robotics.
            </p>
            <a href="https://github.com/aaravdhawan25/FtcAutoTune/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Apache License 2.0
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-[0.12em] mb-4">Resources</p>
            <ul className="space-y-2.5">
              {[
                { label: 'FTC-AutoTune on GitHub', href: 'https://github.com/aaravdhawan25/FtcAutoTune' },
                { label: 'QuickStart Repo', href: 'https://github.com/aaravdhawan25/FtcAutoTuneQuickStart' },
                { label: 'JitPack Build Page', href: 'https://jitpack.io/#aaravdhawan25/FtcAutoTune' },
                { label: 'FTC Dashboard', href: 'https://acmerobotics.github.io/ftc-dashboard/' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
                    {label} <ExternalLink size={10} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Author */}
          <div>
            <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-[0.12em] mb-4">Author</p>
            <a href="https://github.com/aaravdhawan25" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Github size={16} className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-[13.5px] font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors leading-tight">Aarav Dhawan</p>
                <p className="text-[11.5px] text-slate-400 dark:text-slate-600">@aaravdhawan25</p>
              </div>
            </a>

            <p className="text-[10.5px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-[0.12em] mb-3">Quick Nav</p>
            <div className="flex flex-col gap-2">
              {['overview', 'installation', 'tuning-guides', 'faq'].map(s => (
                <button key={s} onClick={() => scrollTo(s)}
                  className="text-left text-[13px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors capitalize w-fit">
                  {s.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-slate-400 dark:text-slate-600">
          <p>© 2026 Aarav Dhawan · Apache License 2.0</p>
          <p className="flex items-center gap-1.5">
            Built with React · Vite · Tailwind CSS · Docs by{' '}
            <a
              href="https://github.com/aaravdhawan25"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors font-medium"
            >
              aaravdhawan25
            </a>
            {' '}and{' '}
            <a
              href="https://claude.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors font-medium"
            >
              Claude
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
