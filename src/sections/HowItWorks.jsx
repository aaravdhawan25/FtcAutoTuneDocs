import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Radio, BarChart2, Sliders } from 'lucide-react'

const STEPS = [
  {
    icon: Radio,
    num: '01',
    title: 'Relay Test',
    body: 'The tuner drives the motor bang-bang: full power when below target, full reverse when above. Math.abs(getVelocity()) prevents spikes from brief direction reversals during sustained oscillation.',
    accent: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10',
  },
  {
    icon: BarChart2,
    num: '02',
    title: 'Extract Ku / Tu',
    body: 'From the oscillation, ultimate gain Ku = 4d/(π·a) and ultimate period Tu are computed by averaging sustained cycles. Initial settling cycles are automatically discarded.',
    accent: 'text-violet-500 bg-violet-50 dark:bg-violet-500/10',
  },
  {
    icon: Sliders,
    num: '03',
    title: 'Ziegler-Nichols Gains',
    body: 'Six candidate gain sets are computed from Ku/Tu using ZN rules. For velocity/PIDF, a feedforward sweep fits kF = Σ(power·vel) / Σ(vel²) via least squares.',
    accent: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10',
  },
]

const ZN_CANDIDATES = [
  { label: 'P only', formula: 'kP = 0.5·Ku' },
  { label: 'PI', formula: 'kP = 0.45·Ku, kI = 1.2·kP/Tu' },
  { label: 'PD (no overshoot)', formula: 'kP = 0.4·Ku, kD = 0.4·Ku·Tu/3' },
  { label: 'PD (some overshoot)', formula: 'kP = 0.6·Ku, kD = 0.6·Ku·Tu/4' },
  { label: 'PD (classic ZN) ★', formula: 'kP = 0.8·Ku, kD = 0.8·Ku·Tu/8', highlight: true },
  { label: 'PD (aggressive)', formula: 'kP = 1.2·Ku, kD = 1.2·Ku·Tu/8' },
]

function WaveformSVG() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref} className="w-full max-w-sm mx-auto mt-10">
      <p className="text-center text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-2">Relay Oscillation</p>
      <svg viewBox="0 0 300 80" className="w-full h-16" aria-hidden>
        <line x1="0" y1="40" x2="300" y2="40" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.3" />
        <motion.path
          d="M8 40 C20 40 26 14 38 14 C50 14 56 66 68 66 C80 66 86 14 98 14 C110 14 116 66 128 66 C140 66 146 14 158 14 C170 14 176 66 188 66 C200 66 206 14 218 14 C230 14 236 66 248 66 C260 66 266 20 278 40"
          fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={inView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
        />
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
          <line x1="38" y1="50" x2="98" y2="50" stroke="#f59e0b" strokeWidth="0.7" />
          <line x1="38" y1="47" x2="38" y2="53" stroke="#f59e0b" strokeWidth="0.7" />
          <line x1="98" y1="47" x2="98" y2="53" stroke="#f59e0b" strokeWidth="0.7" />
          <text x="62" y="62" fontSize="6" fill="#f59e0b" textAnchor="middle">Tu</text>
          <text x="163" y="12" fontSize="6" fill="#a78bfa">a</text>
        </motion.g>
      </svg>
    </div>
  )
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

export function HowItWorks({ id }) {
  return (
    <section id={id} className="section-outer bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
      <div className="section-inner">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-14">
          <p className="section-label">Under the Hood</p>
          <h2 className="section-h2">How It Works</h2>
          <p className="section-sub max-w-lg">Three automated phases — no manual tweaking required.</p>
        </motion.div>

        {/* Steps */}
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {STEPS.map(({ icon: Icon, num, title, body, accent }) => (
            <motion.div
              key={num}
              variants={fadeUp}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="card p-6 relative overflow-hidden"
            >
              <span className="absolute top-3 right-4 text-6xl font-black text-slate-100 dark:text-white/[0.03] select-none leading-none">{num}</span>
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${accent} mb-4`}>
                <Icon size={17} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white text-[15px] mb-2">{title}</h3>
              <p className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        <WaveformSVG />

        {/* ZN table */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: 0.1 }} className="mt-12">
          <p className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] mb-4">Six Ziegler-Nichols Candidates</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ZN_CANDIDATES.map(({ label, formula, highlight }) => (
              <div
                key={label}
                className={`rounded-lg px-4 py-3 text-[12.5px] font-mono ${
                  highlight
                    ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className={`block text-[10.5px] font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'}`}>{label}</span>
                {formula}
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">★ Default velocity candidate · kI = 0 when TUNE_INTEGRAL_TERM = false</p>
        </motion.div>
      </div>
    </section>
  )
}
