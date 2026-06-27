import { motion } from 'framer-motion'
import { ExternalLink, MonitorDot, LayoutDashboard } from 'lucide-react'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

function LinkRow({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-400 text-sm underline underline-offset-2 transition-colors"
    >
      {children}
      <ExternalLink size={12} />
    </a>
  )
}

export function Dashboards({ id }) {
  return (
    <section id={id} className="py-24 px-6 bg-white dark:bg-slate-800/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Step 0</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Install a Dashboard{' '}
            <span className="text-slate-400 dark:text-slate-500 font-normal text-2xl">(Recommended)</span>
          </h2>
        </motion.div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 rounded-xl border border-blue-500/20 bg-blue-500/5 px-6 py-4 text-sm text-slate-700 dark:text-slate-300 text-center max-w-2xl mx-auto"
        >
          Before tuning, a live dashboard lets you watch velocities, graphs, and tune config values in real time{' '}
          <span className="font-semibold text-slate-900 dark:text-white">without redeploying.</span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Card A: FTC Dashboard */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <MonitorDot size={22} className="text-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">FTC Dashboard</h3>
                <p className="text-xs text-slate-500 dark:text-slate-500">by acmerobotics</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The classic FTC telemetry dashboard. Live graphs, field view, and{' '}
              <code className="font-mono text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">@Config</code>{' '}
              variable tuning without redeploying.
            </p>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 font-mono">
                build.dependencies.gradle
              </p>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`maven { url = 'https://maven.brott.dev/' }

implementation('com.acmerobotics.dashboard:dashboard:0.4.16') {
    exclude group: 'org.firstinspires.ftc'
}`}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              <LinkRow href="https://github.com/acmerobotics/ftc-dashboard">GitHub</LinkRow>
              <LinkRow href="https://acmerobotics.github.io/ftc-dashboard/gettingstarted.html">Docs</LinkRow>
            </div>
          </motion.div>

          {/* Card B: Panels */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 flex flex-col gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard size={22} className="text-violet-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Panels</h3>
                <p className="text-xs text-slate-500 dark:text-slate-500">by bylazar / FTControl</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              All-in-one dashboard with OpMode control, live graphing, and PWA install. Runs in any browser on your phone or laptop.
            </p>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex-1 flex items-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No Gradle dependency needed — Panels connects over Wi-Fi using FTControl's companion app on the Robot Controller.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-auto">
              <LinkRow href="https://panels.bylazar.com/">panels.bylazar.com</LinkRow>
              <LinkRow href="https://ftcontrol.bylazar.com/docs/overview/">Docs</LinkRow>
            </div>
          </motion.div>
        </motion.div>

        {/* @Config note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-5 py-4 text-sm text-slate-600 dark:text-slate-400"
        >
          <span className="font-semibold text-slate-800 dark:text-slate-200">Note: </span>
          FtcAutoTune's <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">TuningConfig</code> uses{' '}
          <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">@Config</code> so all tuning constants are live-editable
          on FTC Dashboard without redeploying.
        </motion.div>
      </div>
    </section>
  )
}
