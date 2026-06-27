import { motion } from 'framer-motion'
import { Package, FileCode } from 'lucide-react'

const LIBRARY_CLASSES = [
  { name: 'PIDMaster', desc: 'Drives relay test, feedforward sweep, and live test for a single motor.' },
  { name: 'DualMotorPIDMaster', desc: 'Same as PIDMaster for dual-motor setups — shared output, optional single encoder.' },
  { name: 'RelayAutoTuner', desc: 'Pure math: relay switching logic, cycle detection, Ku/Tu computation.' },
  { name: 'ZieglerNicholsCalculator', desc: 'Converts Ku/Tu to 6 candidate gain sets (PD or PID family based on TUNE_INTEGRAL_TERM).' },
  { name: 'PIDFController', desc: 'Generic PIDF controller — the class you use in your final subsystem code.' },
  { name: 'FeedforwardCharacterizer', desc: 'Least-squares kF fit from open-loop power/velocity sample pairs.' },
  { name: 'PIDGains', desc: 'Data class: kP, kI, kD, kF + string label for each candidate.' },
  { name: 'RelayTuningResult', desc: 'Result object: Ku, Tu, amplitude, relay amplitude used during test.' },
]

const QUICKSTART_FILES = [
  { name: 'TuningConfig.java', desc: '@Config annotated class — all your tuning constants in one place.' },
  { name: 'VelocityPIDFTunerOpMode.java', desc: 'Thin TeleOp wrapper — drives PIDMaster for single-motor velocity tuning.' },
  { name: 'PositionPIDTunerOpMode.java', desc: 'Thin TeleOp wrapper — drives PIDMaster for position/arm/lift tuning.' },
  { name: 'DualMotorVelocityPIDFTunerOpMode.java', desc: 'Thin TeleOp wrapper — drives DualMotorPIDMaster for dual-motor shooters.' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

export function LibraryStructure({ id }) {
  return (
    <section id={id} className="py-24 px-6 bg-white dark:bg-slate-800/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Architecture</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What's in the Library?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Two-part design: the JitPack library handles all tuning logic; you only copy four template files.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Library classes */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-blue-500/30 bg-blue-500/5 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-blue-500/20">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Package size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">In the Library</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">JitPack — do not copy these</p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="divide-y divide-blue-500/10"
            >
              {LIBRARY_CLASSES.map(({ name, desc }) => (
                <motion.div
                  key={name}
                  variants={rowVariants}
                  className="px-6 py-3.5 flex gap-3"
                >
                  <code className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold w-48 flex-shrink-0 pt-0.5 leading-relaxed">
                    {name}
                  </code>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* QuickStart files */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-6 py-4 border-b border-emerald-500/20">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FileCode size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">You Copy (from QuickStart)</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Into your TeamCode package</p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="divide-y divide-emerald-500/10"
            >
              {QUICKSTART_FILES.map(({ name, desc }) => (
                <motion.div
                  key={name}
                  variants={rowVariants}
                  className="px-6 py-3.5 flex gap-3"
                >
                  <code className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-semibold w-48 flex-shrink-0 pt-0.5 leading-relaxed">
                    {name}
                  </code>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Extra note */}
            <div className="px-6 py-4 border-t border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs text-slate-500 dark:text-slate-500">
                <a
                  href="https://github.com/aaravdhawan25/FtcAutoTuneQuickStart"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 dark:text-emerald-400 underline underline-offset-2 hover:text-emerald-500"
                >
                  FtcAutoTuneQuickStart
                </a>{' '}
                on GitHub — latest versions of the template files.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Module breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6"
        >
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">JitPack Artifact IDs</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { artifact: 'pidautotuner-core', desc: 'Pure Java — math, algorithms, PIDFController. No FTC SDK dependency.' },
              { artifact: 'pidautotuner-ftc', desc: 'FTC SDK integration — PIDMaster, DualMotorPIDMaster, OpMode wrappers.' },
            ].map(({ artifact, desc }) => (
              <div key={artifact} className="rounded-lg bg-slate-50 dark:bg-slate-700/50 p-4">
                <code className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold block mb-1.5">
                  com.github.aaravdhawan25.FtcAutoTune:{artifact}:v0.3.6
                </code>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
