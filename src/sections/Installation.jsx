import { motion } from 'framer-motion'
import { CodeBlock } from '../components/CodeBlock'
import { CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'

const REPOS_CODE = `repositories {
    mavenCentral()
    google()
    maven { url = 'https://jitpack.io' }
    maven { url = 'https://maven.brott.dev/' }  // for FTC Dashboard
}`

const DEPS_CODE = `dependencies {
    // FtcAutoTune — relay-feedback PID/PIDF auto tuner
    implementation 'com.github.aaravdhawan25.FtcAutoTune:pidautotuner-core:v0.3.6'
    implementation 'com.github.aaravdhawan25.FtcAutoTune:pidautotuner-ftc:v0.3.6'

    // Optional but recommended: FTC Dashboard for live telemetry
    implementation('com.acmerobotics.dashboard:dashboard:0.4.16') {
        exclude group: 'org.firstinspires.ftc'
    }
}`

const FILES = [
  { name: 'TuningConfig.java', desc: 'The only file you edit — all tuning constants' },
  { name: 'VelocityPIDFTunerOpMode.java', desc: 'Single-motor velocity / flywheels' },
  { name: 'PositionPIDTunerOpMode.java', desc: 'Arms, lifts, run-to-position' },
  { name: 'DualMotorVelocityPIDFTunerOpMode.java', desc: 'Dual-motor shooters' },
]

const STEPS = [
  {
    num: 1,
    title: 'Add Repositories',
    sub: 'build.dependencies.gradle',
    content: <CodeBlock code={REPOS_CODE} language="groovy" />,
  },
  {
    num: 2,
    title: 'Add Dependencies',
    sub: 'build.dependencies.gradle',
    content: <CodeBlock code={DEPS_CODE} language="groovy" />,
  },
  {
    num: 3,
    title: 'Sync Gradle',
    sub: 'Download the library',
    content: (
      <div className="rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
        Gradle sync downloads the library. <code className="ci">PIDMaster</code> and <code className="ci">DualMotorPIDMaster</code> are now available on the classpath.
      </div>
    ),
  },
  {
    num: 4,
    title: 'Copy Files into TeamCode',
    sub: (
      <>
        From <a href="https://github.com/aaravdhawan25/FtcAutoTuneQuickStart" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 hover:text-blue-500 underline underline-offset-2">
          FtcAutoTuneQuickStart<ExternalLink size={10} />
        </a> into your teamcode package
      </>
    ),
    content: (
      <div className="space-y-3">
        <div className="rounded-lg border border-slate-200 dark:border-slate-700/80 overflow-hidden bg-white dark:bg-slate-900">
          {FILES.map(({ name, desc }, i) => (
            <div key={name} className={`flex items-center gap-3 px-4 py-3 text-[13px] ${i < FILES.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}`}>
              <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
              <code className="font-mono text-[12px] text-blue-600 dark:text-blue-400 flex-shrink-0 min-w-0">{name}</code>
              <span className="text-slate-400 hidden sm:inline">—</span>
              <span className="text-slate-500 dark:text-slate-500 hidden sm:inline text-[12.5px]">{desc}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 p-3.5 rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            <code className="ci">PIDMaster</code> and <code className="ci">DualMotorPIDMaster</code> live in the library — do <strong>not</strong> copy them. Only the OpModes and TuningConfig go in TeamCode.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: 5,
    title: 'Sync Again & Deploy',
    sub: 'Push to Robot Controller',
    content: (
      <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/20 px-5 py-4 text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
        Sync Gradle one more time, then deploy to the Robot Controller. The three tuner OpModes will appear under the <strong>FtcAutoTune</strong> group on the Driver Station.
      </div>
    ),
  },
]

export function Installation({ id }) {
  return (
    <section id={id} className="section-outer bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
      <div className="prose-inner">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-14">
          <p className="section-label">Setup</p>
          <h2 className="section-h2">Installation</h2>
          <p className="section-sub">Five steps to get FtcAutoTune running on your robot.</p>
        </motion.div>

        <div className="space-y-10">
          {STEPS.map(({ num, title, sub, content }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="flex gap-5"
            >
              {/* Step indicator */}
              <div className="flex flex-col items-center gap-0 pt-0.5">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0 shadow-md shadow-blue-500/20 z-10">
                  {num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 dark:bg-slate-800 mt-2 mb-0 min-h-[1rem]" />
                )}
              </div>

              <div className="flex-1 pb-2 min-w-0">
                <p className="font-semibold text-[15px] text-slate-900 dark:text-white mb-0.5">{title}</p>
                <p className="text-[12.5px] text-slate-400 dark:text-slate-500 mb-4">{sub}</p>
                {content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
