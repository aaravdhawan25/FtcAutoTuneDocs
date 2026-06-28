import { motion } from 'framer-motion'
import { Package, FileCode } from 'lucide-react'

const LIB = [
  { name: 'PIDMaster', desc: 'Relay test, feedforward sweep, and live test for a single motor.' },
  { name: 'DualMotorPIDMaster', desc: 'Same for dual-motor setups — shared output, optional single encoder.' },
  { name: 'RelayAutoTuner', desc: 'Pure math: relay switching logic, cycle detection, Ku/Tu computation.' },
  { name: 'ZieglerNicholsCalculator', desc: 'Converts Ku/Tu to 6 candidate gain sets (PD or PID family).' },
  { name: 'PIDFController', desc: 'Generic PIDF controller — use this in your final subsystem code.' },
  { name: 'FeedforwardCharacterizer', desc: 'Least-squares kF from open-loop power/velocity sample pairs.' },
  { name: 'PIDGains', desc: 'Data class: kP, kI, kD, kF + string label for each candidate.' },
  { name: 'RelayTuningResult', desc: 'Result object: Ku, Tu, amplitude used during the relay test.' },
]

const QS = [
  { name: 'TuningConfig.java', desc: '@Config annotated — all tuning constants in one place.' },
  { name: 'VelocityPIDFTunerOpMode.java', desc: 'TeleOp wrapper for single-motor velocity tuning.' },
  { name: 'PositionPIDTunerOpMode.java', desc: 'TeleOp wrapper for position/arm/lift tuning.' },
  { name: 'DualMotorVelocityPIDFTunerOpMode.java', desc: 'TeleOp wrapper for dual-motor shooters.' },
]

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }
const row = { hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35 } } }

function ClassList({ items, accent }) {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="divide-y divide-slate-100 dark:divide-slate-800">
      {items.map(({ name, desc }) => (
        <motion.div key={name} variants={row} className="flex gap-3 py-3 px-4">
          <code className={`font-mono text-[12px] font-semibold flex-shrink-0 w-52 pt-0.5 leading-relaxed ${accent}`}>{name}</code>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
        </motion.div>
      ))}
    </motion.div>
  )
}

export function LibraryStructure({ id }) {
  return (
    <section id={id} className="section-outer bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60">
      <div className="section-inner">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-14">
          <p className="section-label">Architecture</p>
          <h2 className="section-h2">What's in the Library?</h2>
          <p className="section-sub max-w-xl">Two-part design: JitPack handles all logic; you only copy four template files.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Library */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5 }}
            className="rounded-xl border border-blue-200 dark:border-blue-800/30 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-blue-100 dark:border-blue-800/20 bg-blue-50/50 dark:bg-blue-950/20">
              <Package size={15} className="text-blue-500" />
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">In the Library</p>
              <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-500">JitPack — do not copy</span>
            </div>
            <ClassList items={LIB} accent="text-blue-600 dark:text-blue-400" />
          </motion.div>

          {/* QuickStart */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-xl border border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-emerald-100 dark:border-emerald-800/20 bg-emerald-50/50 dark:bg-emerald-950/20">
              <FileCode size={15} className="text-emerald-500" />
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">You Copy (from QuickStart)</p>
              <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-500">Into TeamCode</span>
            </div>
            <ClassList items={QS} accent="text-emerald-700 dark:text-emerald-400" />
            <div className="px-4 py-3 border-t border-emerald-100 dark:border-emerald-800/20 bg-emerald-50/30 dark:bg-emerald-950/10">
              <a href="https://github.com/aaravdhawan25/FtcAutoTuneQuickStart" target="_blank" rel="noopener noreferrer"
                className="text-[12.5px] text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 underline underline-offset-2">
                FTC-AutoTune QuickStart on GitHub ↗
              </a>
            </div>
          </motion.div>
        </div>

        {/* Artifact IDs */}
        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45, delay: 0.1 }} className="mt-5">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { id: 'pidautotuner-core', desc: 'Pure Java — math, algorithms, PIDFController. No FTC SDK dependency.' },
              { id: 'pidautotuner-ftc', desc: 'FTC SDK integration — PIDMaster, DualMotorPIDMaster, OpMode logic.' },
            ].map(({ id, desc }) => (
              <div key={id} className="rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <code className="block font-mono text-[11.5px] text-blue-600 dark:text-blue-400 mb-2 leading-relaxed break-all">
                  com.github.aaravdhawan25.FtcAutoTune:{id}:v0.3.6
                </code>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
