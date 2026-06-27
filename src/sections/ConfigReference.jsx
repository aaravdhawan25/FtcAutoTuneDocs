import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const CONFIG_FIELDS = [
  { field: 'MOTOR_NAME', type: 'String', default: '"motor"', category: 'Hardware', desc: 'Hardware config name of the motor as set in the Driver Station configuration.' },
  { field: 'MOTOR_NAME_2', type: 'String', default: '"motor2"', category: 'Dual Motor', desc: 'Second motor config name for the dual-motor velocity tuner.' },
  { field: 'REVERSED', type: 'boolean', default: 'false', category: 'Hardware', desc: 'Reverse motor 1 direction.' },
  { field: 'REVERSED_2', type: 'boolean', default: 'true', category: 'Dual Motor', desc: 'Reverse motor 2 direction. Usually true for opposing-face flywheel pairs.' },
  { field: 'DUAL_ENCODERS', type: 'boolean', default: 'false', category: 'Dual Motor', desc: 'True = both motors have encoders; false = only motor 1 has encoder (motor 2 still driven with same output).' },
  { field: 'RELAY_AMPLITUDE', type: 'double', default: '0.5', category: 'Relay Test', desc: 'Bang-bang output magnitude 0–1. Start at 0.3 for arms/lifts, 0.5–0.8 for flywheels.' },
  { field: 'CYCLES_TO_COLLECT', type: 'int', default: '6', category: 'Relay Test', desc: 'Number of oscillation cycles averaged to compute Ku and Tu.' },
  { field: 'CYCLES_TO_IGNORE', type: 'int', default: '2', category: 'Relay Test', desc: 'Initial settling cycles discarded before averaging starts.' },
  { field: 'RELAY_TEST_TIMEOUT_S', type: 'double', default: '15.0', category: 'Relay Test', desc: 'Safety cutoff (seconds) if sustained oscillation never starts.' },
  { field: 'TUNE_INTEGRAL_TERM', type: 'boolean', default: 'false', category: 'Relay Test', desc: 'False = use PD-only ZN rule family (kI = 0). Recommended for velocity loops. Set true for PI/PID candidates.' },
  { field: 'POSITION_TARGET_TICKS', type: 'double', default: '400', category: 'Position', desc: 'Target offset from start position in encoder ticks for relay oscillation.' },
  { field: 'POSITION_HYSTERESIS_TICKS', type: 'double', default: '10', category: 'Position', desc: 'Relay deadband in encoder ticks. Prevents rapid switching near the target.' },
  { field: 'TICKS_PER_REV', type: 'double', default: '60.0', category: 'Velocity', desc: 'Encoder ticks per output shaft revolution. GoBILDA 435 RPM = 384.5, REV HD Hex bare = 28.0, GoBILDA 312 RPM = 537.7.' },
  { field: 'USE_RPM_TARGET', type: 'boolean', default: 'false', category: 'Velocity', desc: 'If true, use VELOCITY_TARGET_RPM instead of VELOCITY_TARGET_TICKS_PER_SEC.' },
  { field: 'VELOCITY_TARGET_RPM', type: 'double', default: '2800', category: 'Velocity', desc: 'Target velocity in RPM. Only used when USE_RPM_TARGET = true.' },
  { field: 'VELOCITY_TARGET_TICKS_PER_SEC', type: 'double', default: '1500', category: 'Velocity', desc: 'Target velocity in ticks/sec. Used when USE_RPM_TARGET = false.' },
  { field: 'VELOCITY_HYSTERESIS_TICKS_PER_SEC', type: 'double', default: '30', category: 'Velocity', desc: 'Relay deadband in ticks/sec. Prevents rapid switching near target velocity.' },
  { field: 'FEEDFORWARD_TEST_POWERS', type: 'double[]', default: '{0.5, 0.75, 1.0}', category: 'Velocity', desc: 'Open-loop power levels for kF characterization sweep.' },
  { field: 'FEEDFORWARD_SETTLE_TIME_S', type: 'double', default: '1.5', category: 'Velocity', desc: 'Settle time in seconds per power level during feedforward characterization.' },
]

const CATEGORIES = ['All', 'Hardware', 'Relay Test', 'Position', 'Velocity', 'Dual Motor']

const CATEGORY_COLORS = {
  Hardware: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  'Relay Test': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Position: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  Velocity: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  'Dual Motor': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
}

export function ConfigReference({ id }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = CONFIG_FIELDS.filter((f) => {
    const matchesSearch =
      f.field.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <section id={id} className="py-24 px-6 bg-white dark:bg-slate-800/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Reference</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            TuningConfig.java Reference
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            All fields in TuningConfig.java. Edit only this file — the OpModes read from it automatically.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search fields…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  activeCategory === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-5 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Field</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap hidden sm:table-cell">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap hidden md:table-cell">Default</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap hidden lg:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">Description</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-slate-400">
                      No fields match your filter.
                    </td>
                  </tr>
                )}
                {filtered.map(({ field, type, default: def, category, desc }, i) => (
                  <tr
                    key={field}
                    className={`border-b border-slate-100 dark:border-slate-800 last:border-b-0 ${
                      i % 2 === 0
                        ? 'bg-white dark:bg-slate-900/30'
                        : 'bg-slate-50/50 dark:bg-slate-800/20'
                    } hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-100`}
                  >
                    <td className="px-5 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                      {field}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-500 whitespace-nowrap hidden sm:table-cell">
                      {type}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-emerald-700 dark:text-emerald-400 whitespace-nowrap hidden md:table-cell">
                      {def}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${CATEGORY_COLORS[category]}`}>
                        {category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                      {desc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400">
            {filtered.length} of {CONFIG_FIELDS.length} fields shown
          </div>
        </motion.div>
      </div>
    </section>
  )
}
