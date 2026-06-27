import { motion } from 'framer-motion'
import { CodeBlock } from '../components/CodeBlock'
import { CheckCircle, AlertCircle } from 'lucide-react'

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
    num: '1',
    title: 'Add Repositories',
    subtitle: 'In build.dependencies.gradle',
    content: <CodeBlock code={REPOS_CODE} language="groovy" />,
  },
  {
    num: '2',
    title: 'Add Dependencies',
    subtitle: 'In build.dependencies.gradle',
    content: <CodeBlock code={DEPS_CODE} language="groovy" />,
  },
  {
    num: '3',
    title: 'Sync Gradle',
    subtitle: 'Download the library',
    content: (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5 text-sm text-slate-600 dark:text-slate-400">
        Gradle sync downloads the library.{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">PIDMaster</code> and{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">DualMotorPIDMaster</code>{' '}
        are now available on the classpath.
      </div>
    ),
  },
  {
    num: '4',
    title: 'Copy 2 Files into Your TeamCode',
    subtitle: (
      <>
        From{' '}
        <a
          href="https://github.com/aaravdhawan25/FtcAutoTuneQuickStart"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
        >
          FtcAutoTuneQuickStart
        </a>{' '}
        into TeamCode/src/main/java/org/firstinspires/ftc/teamcode/
      </>
    ),
    content: (
      <div className="space-y-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
          {FILES.map(({ name, desc }, i) => (
            <div
              key={name}
              className={`flex items-center gap-3 px-5 py-3 text-sm ${
                i < FILES.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''
              }`}
            >
              <CheckCircle size={15} className="text-emerald-500 flex-shrink-0" />
              <code className="font-mono text-xs text-blue-600 dark:text-blue-400 flex-shrink-0">{name}</code>
              <span className="text-slate-500 dark:text-slate-500 hidden sm:inline">—</span>
              <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">{desc}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Important: </span>
            <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">PIDMaster</code> and{' '}
            <code className="font-mono text-xs bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">DualMotorPIDMaster</code>{' '}
            live in the library — do <strong>NOT</strong> copy them. Only the OpModes and TuningConfig go in your TeamCode.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: '5',
    title: 'Sync Again & Deploy',
    subtitle: 'Push to Robot Controller',
    content: (
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-slate-700 dark:text-slate-300">
        Sync Gradle one more time, then deploy to the Robot Controller. The three tuner OpModes will appear in the Driver Station under the{' '}
        <span className="font-semibold">FtcAutoTune</span> group.
      </div>
    ),
  },
]

export function Installation({ id }) {
  return (
    <section id={id} className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Setup</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Installation</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Five steps to get FtcAutoTune running on your robot.
          </p>
        </motion.div>

        <div className="space-y-10">
          {STEPS.map(({ num, title, subtitle, content }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="flex gap-5"
            >
              {/* Step number */}
              <div className="flex flex-col items-center gap-0">
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg shadow-blue-500/25">
                  {num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-2" style={{ minHeight: '1.5rem' }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-0.5">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">{subtitle}</p>
                {content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
