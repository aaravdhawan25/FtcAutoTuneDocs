import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { Radio, BarChart2, Sliders, ArrowRight } from 'lucide-react'

const STEPS = [
  {
    icon: <Radio size={24} />,
    step: '01',
    title: 'Relay Test',
    description:
      'The tuner drives the motor bang-bang: full power when below target, full reverse when above. This forces a sustained oscillation. Math.abs(getVelocity()) prevents spikes from brief direction reversals.',
    color: 'from-blue-600/20 to-blue-500/5',
    border: 'border-blue-500/30',
    iconBg: 'bg-blue-500/10 text-blue-400',
  },
  {
    icon: <BarChart2 size={24} />,
    step: '02',
    title: 'Extract Ku / Tu',
    description:
      'From the oscillation, ultimate gain Ku = 4d/(π·a) and ultimate period Tu (average period of sustained cycles) are computed. Initial settling cycles are automatically discarded.',
    color: 'from-violet-600/20 to-violet-500/5',
    border: 'border-violet-500/30',
    iconBg: 'bg-violet-500/10 text-violet-400',
  },
  {
    icon: <Sliders size={24} />,
    step: '03',
    title: 'Ziegler-Nichols Gains',
    description:
      'Six candidate gain sets are computed from Ku/Tu using ZN rules, ranging from P-only to aggressive PD. For velocity/PIDF, a feedforward sweep fits kF = Σ(power·vel) / Σ(vel²).',
    color: 'from-emerald-600/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 text-emerald-400',
  },
]

function OscillationWave() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className="w-full max-w-md mx-auto mt-12">
      <p className="text-center text-xs font-mono text-slate-500 dark:text-slate-500 mb-3 uppercase tracking-wider">
        Relay Oscillation Waveform
      </p>
      <svg viewBox="0 0 320 100" className="w-full h-20" aria-hidden="true">
        {/* Target line */}
        <line x1="0" y1="50" x2="320" y2="50" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="4,3" opacity="0.4" />
        <text x="325" y="53" fontSize="7" fill="#3B82F6" opacity="0.6">target</text>

        {/* Relay output indicator (top/bottom) */}
        <motion.path
          d="M 10 10 L 40 10 L 40 90 L 80 90 L 80 10 L 120 10 L 120 90 L 160 90 L 160 10 L 200 10 L 200 90 L 240 90 L 240 10 L 280 10"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />

        {/* Velocity oscillation */}
        <motion.path
          d="M 10 50 C 22 50 28 18 40 18 C 52 18 58 82 70 82 C 82 82 88 18 100 18 C 112 18 118 82 130 82 C 142 82 148 18 160 18 C 172 18 178 82 190 82 C 202 82 208 18 220 18 C 232 18 238 82 250 82 C 262 82 268 22 280 50"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Ku / Tu labels */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.8, duration: 0.4 }}
        >
          <line x1="40" y1="60" x2="100" y2="60" stroke="#f59e0b" strokeWidth="0.8" />
          <line x1="40" y1="57" x2="40" y2="63" stroke="#f59e0b" strokeWidth="0.8" />
          <line x1="100" y1="57" x2="100" y2="63" stroke="#f59e0b" strokeWidth="0.8" />
          <text x="64" y="73" fontSize="7" fill="#f59e0b" textAnchor="middle">Tu</text>

          <line x1="155" y1="18" x2="155" y2="82" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="2,2" />
          <text x="162" y="22" fontSize="7" fill="#a78bfa">a</text>
        </motion.g>
      </svg>
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export function HowItWorks({ id }) {
  return (
    <section id={id} className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Three automated phases — no manual tweaking required.
          </p>
        </motion.div>

        {/* Step cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        >
          {STEPS.map(({ icon, step, title, description, color, border, iconBg }, i) => (
            <div key={step} className="flex items-stretch gap-0">
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`flex-1 relative rounded-2xl border ${border} bg-gradient-to-b ${color} p-6 backdrop-blur-sm overflow-hidden`}
              >
                {/* Step number */}
                <span className="absolute top-4 right-5 text-5xl font-black text-slate-200/10 dark:text-white/5 select-none">
                  {step}
                </span>

                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-5`}>
                  {icon}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
              </motion.div>

              {/* Arrow between cards */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex items-center px-2 text-slate-400 dark:text-slate-600">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <OscillationWave />

        {/* ZN formula callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6"
        >
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
            Six Ziegler-Nichols Candidates
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { label: 'P only', formula: 'kP = 0.5·Ku' },
              { label: 'PI', formula: 'kP = 0.45·Ku, kI = 1.2·kP/Tu' },
              { label: 'PD (no overshoot)', formula: 'kP = 0.4·Ku, kD = 0.4·Ku·Tu/3' },
              { label: 'PD (some overshoot)', formula: 'kP = 0.6·Ku, kD = 0.6·Ku·Tu/4' },
              { label: 'PD (classic ZN) ★', formula: 'kP = 0.8·Ku, kD = 0.8·Ku·Tu/8', highlight: true },
              { label: 'PD (aggressive)', formula: 'kP = 1.2·Ku, kD = 1.2·Ku·Tu/8' },
            ].map(({ label, formula, highlight }) => (
              <div
                key={label}
                className={`rounded-lg px-4 py-3 text-sm font-mono ${
                  highlight
                    ? 'bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className={`font-semibold text-xs mb-1 ${highlight ? 'text-blue-500' : 'text-slate-500 dark:text-slate-400'}`}>
                  {label}
                </p>
                <p>{formula}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
            ★ Default velocity candidate. kI = 0 when TUNE_INTEGRAL_TERM = false (default).
          </p>
        </motion.div>
      </div>
    </section>
  )
}
