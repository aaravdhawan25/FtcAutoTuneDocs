import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

const CANDIDATES = [
  { name: 'P only', ki: '0', recommendedFor: 'Quick sanity check', notes: 'Steady-state error expected', posDefault: false, velDefault: false },
  { name: 'PD (very gentle)', ki: '0', recommendedFor: 'Ultra-sensitive mechanisms', notes: '', posDefault: false, velDefault: false },
  { name: 'PD (no overshoot)', ki: '0', recommendedFor: 'Arms, lifts with hard stops', notes: '', posDefault: true, velDefault: false },
  { name: 'PD (some overshoot)', ki: '0', recommendedFor: 'Most position mechanisms', notes: '', posDefault: false, velDefault: false },
  { name: 'PD (classic ZN)', ki: '0', recommendedFor: 'Flywheels, fast velocity loops', notes: '', posDefault: false, velDefault: true },
  { name: 'PD (aggressive)', ki: '0', recommendedFor: 'Use with caution', notes: 'Verify on live test first', posDefault: false, velDefault: false },
]

export function CandidateGains({ id }) {
  return (
    <section id={id} className="py-24 px-6 bg-white dark:bg-slate-800/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Selection Guide</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Which Candidate Should I Use?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            The tuner outputs six candidates. Pick based on your mechanism type.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-5 py-3 font-semibold text-slate-700 dark:text-slate-300">Candidate</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 hidden sm:table-cell">kI</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Recommended For</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 hidden md:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map(({ name, ki, recommendedFor, notes, posDefault, velDefault }, i) => {
                const isHighlighted = posDefault || velDefault
                return (
                  <tr
                    key={name}
                    className={`border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition-colors duration-100 ${
                      isHighlighted
                        ? 'bg-blue-50 dark:bg-blue-900/10'
                        : i % 2 === 0
                        ? 'bg-white dark:bg-slate-900/30'
                        : 'bg-slate-50/50 dark:bg-slate-800/20'
                    }`}
                  >
                    <td className="px-5 py-3">
                      <span className={`font-semibold ${isHighlighted ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {name}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {posDefault && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                            ← Position default
                          </span>
                        )}
                        {velDefault && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                            ← Velocity default
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-500 hidden sm:table-cell">{ki}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{recommendedFor}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-500 hidden md:table-cell">{notes || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        {/* kI callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 flex gap-3 p-5 rounded-xl border border-blue-500/20 bg-blue-500/5"
        >
          <Info size={17} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">TUNE_INTEGRAL_TERM=false</code>{' '}
            (the default) uses the <strong>PD-only Ziegler-Nichols rule family</strong> for all candidates, keeping kI = 0.
            This is the right choice for velocity/flywheel loops where kF handles steady-state error and integral mainly causes windup.
            Set <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">TUNE_INTEGRAL_TERM=true</code> to
            switch to full PID-family rules (PI, PID, Pessen variants).
          </div>
        </motion.div>
      </div>
    </section>
  )
}
