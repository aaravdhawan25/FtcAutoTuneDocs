import { motion } from 'framer-motion'
import { Info } from 'lucide-react'

const CANDIDATES = [
  { name: 'P only', ki: '0', for: 'Quick sanity check', notes: 'Steady-state error expected', pos: false, vel: false },
  { name: 'PD (very gentle)', ki: '0', for: 'Ultra-sensitive mechanisms', notes: '', pos: false, vel: false },
  { name: 'PD (no overshoot)', ki: '0', for: 'Arms, lifts with hard stops', notes: '', pos: true, vel: false },
  { name: 'PD (some overshoot)', ki: '0', for: 'Most position mechanisms', notes: '', pos: false, vel: false },
  { name: 'PD (classic ZN)', ki: '0', for: 'Flywheels, fast velocity loops', notes: '', pos: false, vel: true },
  { name: 'PD (aggressive)', ki: '0', for: 'Use with caution', notes: 'Verify on live test first', pos: false, vel: false },
]

export function CandidateGains({ id }) {
  return (
    <section id={id} className="section-outer bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60">
      <div className="section-inner">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="section-label">Selection</p>
          <h2 className="section-h2">Which Candidate Should I Use?</h2>
          <p className="section-sub max-w-xl">The tuner outputs six candidates from conservative to aggressive. Pick based on mechanism type.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden bg-white dark:bg-slate-900 shadow-sm mb-5">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">Candidate</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell bg-slate-50 dark:bg-slate-800/60">kI</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">Recommended for</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell bg-slate-50 dark:bg-slate-800/60">Notes</th>
              </tr>
            </thead>
            <tbody>
              {CANDIDATES.map(({ name, ki, for: f, notes, pos, vel }, i) => {
                const hl = pos || vel
                return (
                  <tr key={name} className={`border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/20 ${hl ? 'bg-blue-50/40 dark:bg-blue-900/5' : ''}`}>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${hl ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>{name}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pos && <span className="inline-block px-1.5 py-px rounded text-[10.5px] font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">← Position default</span>}
                        {vel && <span className="inline-block px-1.5 py-px rounded text-[10.5px] font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">← Velocity default</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-[12px] text-slate-400 dark:text-slate-500 hidden sm:table-cell">{ki}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{f}</td>
                    <td className="px-4 py-3 text-slate-400 dark:text-slate-500 hidden md:table-cell">{notes || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
          className="flex gap-3 p-4 rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 text-[13px]">
          <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            <code className="ci">TUNE_INTEGRAL_TERM=false</code> (the default) uses the <strong>PD-only Ziegler-Nichols rule family</strong>, keeping kI = 0.
            Right for velocity/flywheel loops where kF handles steady-state error and integral causes windup.
            Set <code className="ci">TUNE_INTEGRAL_TERM=true</code> to switch to full PID-family rules (PI, PID, Pessen variants).
          </p>
        </motion.div>
      </div>
    </section>
  )
}
