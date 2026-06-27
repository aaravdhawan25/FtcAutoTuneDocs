import { Github, Cpu, ExternalLink } from 'lucide-react'

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {/* Left: brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={20} className="text-blue-500" />
              <span className="font-bold text-white text-lg">FtcAutoTune</span>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              Relay-feedback PID/PIDF auto-tuning for FIRST Tech Challenge robotics.
            </p>
            <p className="text-xs">
              Released under the{' '}
              <a
                href="https://github.com/aaravdhawan25/FtcAutoTune/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                MIT License
              </a>
            </p>
            <p className="text-xs mt-1.5 text-slate-500">Built for FTC teams</p>
          </div>

          {/* Center: quick links */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              {[
                {
                  label: 'GitHub — FtcAutoTune',
                  href: 'https://github.com/aaravdhawan25/FtcAutoTune',
                  external: true,
                },
                {
                  label: 'QuickStart Repo',
                  href: 'https://github.com/aaravdhawan25/FtcAutoTuneQuickStart',
                  external: true,
                },
                {
                  label: 'JitPack Build Page',
                  href: 'https://jitpack.io/#aaravdhawan25/FtcAutoTune',
                  external: true,
                },
                {
                  label: 'FTC Dashboard',
                  href: 'https://acmerobotics.github.io/ftc-dashboard/',
                  external: true,
                },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 hover:text-slate-200 transition-colors duration-150"
                  >
                    {label}
                    {external && <ExternalLink size={11} className="opacity-50" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: author */}
          <div>
            <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest mb-4">Author</p>
            <a
              href="https://github.com/aaravdhawan25"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Github size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-slate-200 font-medium text-sm group-hover:text-white transition-colors">
                  Aarav Dhawan
                </p>
                <p className="text-xs text-slate-500">@aaravdhawan25</p>
              </div>
            </a>

            <div className="space-y-2.5 text-sm">
              <button
                onClick={() => scrollTo('overview')}
                className="block hover:text-slate-200 transition-colors duration-150 text-left"
              >
                Overview
              </button>
              <button
                onClick={() => scrollTo('installation')}
                className="block hover:text-slate-200 transition-colors duration-150 text-left"
              >
                Installation
              </button>
              <button
                onClick={() => scrollTo('faq')}
                className="block hover:text-slate-200 transition-colors duration-150 text-left"
              >
                FAQ
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© 2024–2025 Aarav Dhawan. MIT License.</p>
          <p>
            Documentation built with React + Vite + Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
