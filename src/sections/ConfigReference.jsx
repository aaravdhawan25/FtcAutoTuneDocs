import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const FIELDS = [
  { field: 'MOTOR_NAME', type: 'String', default: '"motor"', category: 'Hardware', desc: 'Hardware config name of the motor as set in the Driver Station configuration.' },
  { field: 'MOTOR_NAME_2', type: 'String', default: '"motor2"', category: 'Dual Motor', desc: 'Second motor config name for the dual-motor velocity tuner.' },
  { field: 'REVERSED', type: 'boolean', default: 'false', category: 'Hardware', desc: 'Reverse motor 1 direction.' },
  { field: 'REVERSED_2', type: 'boolean', default: 'true', category: 'Dual Motor', desc: 'Reverse motor 2 direction. Usually true for opposing-face flywheel pairs.' },
  { field: 'DUAL_ENCODERS', type: 'boolean', default: 'false', category: 'Dual Motor', desc: 'True = both motors have encoders; false = only motor 1 encoder is read.' },
  { field: 'RELAY_AMPLITUDE', type: 'double', default: '0.5', category: 'Relay Test', desc: 'Bang-bang output magnitude 0–1. Start at 0.3 for arms/lifts, 0.5–0.8 for flywheels.' },
  { field: 'CYCLES_TO_COLLECT', type: 'int', default: '6', category: 'Relay Test', desc: 'Oscillation cycles averaged to compute Ku and Tu.' },
  { field: 'CYCLES_TO_IGNORE', type: 'int', default: '2', category: 'Relay Test', desc: 'Initial settling cycles discarded before averaging starts.' },
  { field: 'RELAY_TEST_TIMEOUT_S', type: 'double', default: '15.0', category: 'Relay Test', desc: 'Safety cutoff (seconds) if sustained oscillation never starts.' },
  { field: 'TUNE_INTEGRAL_TERM', type: 'boolean', default: 'false', category: 'Relay Test', desc: 'False = PD-only ZN rules (kI = 0). Recommended for velocity. Set true for PI/PID candidates.' },
  { field: 'POSITION_TARGET_TICKS', type: 'double', default: '400', category: 'Position', desc: 'Target offset from start position in encoder ticks for relay oscillation.' },
  { field: 'POSITION_HYSTERESIS_TICKS', type: 'double', default: '10', category: 'Position', desc: 'Relay deadband in encoder ticks. Prevents rapid switching near target.' },
  { field: 'TICKS_PER_REV', type: 'double', default: '60.0', category: 'Velocity', desc: 'Encoder ticks per output shaft revolution. GoBILDA 435 RPM = 384.5, GoBILDA 312 RPM = 537.7, REV HD Hex = 28.0.' },
  { field: 'USE_RPM_TARGET', type: 'boolean', default: 'false', category: 'Velocity', desc: 'If true, use VELOCITY_TARGET_RPM instead of VELOCITY_TARGET_TICKS_PER_SEC.' },
  { field: 'VELOCITY_TARGET_RPM', type: 'double', default: '2800', category: 'Velocity', desc: 'Target velocity in RPM. Used when USE_RPM_TARGET = true.' },
  { field: 'VELOCITY_TARGET_TICKS_PER_SEC', type: 'double', default: '1500', category: 'Velocity', desc: 'Target velocity in ticks/sec. Used when USE_RPM_TARGET = false.' },
  { field: 'VELOCITY_HYSTERESIS_TICKS_PER_SEC', type: 'double', default: '30', category: 'Velocity', desc: 'Relay deadband in ticks/sec. Prevents rapid switching near target velocity.' },
  { field: 'FEEDFORWARD_TEST_POWERS', type: 'double[]', default: '{0.5, 0.75, 1.0}', category: 'Velocity', desc: 'Open-loop power levels for kF characterization sweep.' },
  { field: 'FEEDFORWARD_SETTLE_TIME_S', type: 'double', default: '1.5', category: 'Velocity', desc: 'Settle time per power level during feedforward characterization.' },
]

const CATS = ['All', 'Hardware', 'Relay Test', 'Position', 'Velocity', 'Dual Motor']

const CAT_STYLE = {
  Hardware:     'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300',
  'Relay Test': 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Position:     'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Velocity:     'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  'Dual Motor': 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
}

export function ConfigReference({ id }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')

  const visible = FIELDS.filter(f =>
    (cat === 'All' || f.category === cat) &&
    (f.field.toLowerCase().includes(search.toLowerCase()) || f.desc.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <section id={id} className="section-outer bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60">
      <div className="section-inner">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="section-label">Reference</p>
          <h2 className="section-h2">TuningConfig.java Reference</h2>
          <p className="section-sub max-w-xl">Edit only this file — the OpModes read from it automatically via <code className="ci">@Config</code>.</p>
        </motion.div>

        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Search fields…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`h-7 px-3 rounded-md text-[12px] font-medium transition-colors ${cat === c ? 'bg-blue-500 text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap bg-slate-50 dark:bg-slate-800/60">Field</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider hidden sm:table-cell bg-slate-50 dark:bg-slate-800/60">Type</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell bg-slate-50 dark:bg-slate-800/60">Default</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider hidden lg:table-cell bg-slate-50 dark:bg-slate-800/60">Category</th>
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60">Description</th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-[13px]">No fields match.</td></tr>
                )}
                {visible.map(({ field, type, default: def, category, desc }, i) => (
                  <tr key={field} className={`border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors hover:bg-blue-50/30 dark:hover:bg-blue-900/5 ${i % 2 !== 0 ? 'bg-slate-50/50 dark:bg-slate-800/10' : ''}`}>
                    <td className="px-4 py-3 whitespace-nowrap"><code className="font-mono text-[12px] text-blue-600 dark:text-blue-400 font-semibold">{field}</code></td>
                    <td className="px-4 py-3 font-mono text-[12px] text-slate-400 dark:text-slate-500 whitespace-nowrap hidden sm:table-cell">{type}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-emerald-600 dark:text-emerald-400 whitespace-nowrap hidden md:table-cell">{def}</td>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${CAT_STYLE[category]}`}>{category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-[11.5px] text-slate-400">{visible.length} of {FIELDS.length} fields</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
