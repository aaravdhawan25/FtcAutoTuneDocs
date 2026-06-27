import { motion } from 'framer-motion'
import { ExternalLink, MonitorDot, LayoutDashboard, Info } from 'lucide-react'

function ExtLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[13px] text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors">
      {children}<ExternalLink size={11} className="opacity-60" />
    </a>
  )
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

export function Dashboards({ id }) {
  return (
    <section id={id} className="section-outer bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60">
      <div className="section-inner">

        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="section-label">Step 0</p>
          <h2 className="section-h2">Install a Dashboard <span className="text-slate-400 dark:text-slate-600 font-normal text-2xl">(Recommended)</span></h2>
          <div className="flex items-start gap-2.5 mt-5 p-4 rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 max-w-2xl">
            <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">
              Before tuning, a live dashboard lets you watch velocities, graphs, and tune config values in real time <strong>without redeploying.</strong>
            </p>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} className="grid md:grid-cols-2 gap-5">

          {/* FTC Dashboard */}
          <motion.div variants={fadeUp} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }} className="card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <MonitorDot size={19} className="text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-[15px] text-slate-900 dark:text-white leading-tight">FTC Dashboard</p>
                <p className="text-[12px] text-slate-400 dark:text-slate-500">by acmerobotics</p>
              </div>
            </div>

            <p className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
              The classic FTC telemetry dashboard. Live graphs, field view, and{' '}
              <code className="ci">@Config</code> variable tuning without redeploying.
            </p>

            <div className="rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-950 overflow-hidden">
              <div className="px-3 py-2 border-b border-white/5 bg-[#16162a]">
                <span className="text-[10.5px] font-mono text-slate-500">build.dependencies.gradle</span>
              </div>
              <pre className="text-[12px] font-mono text-slate-300 p-4 overflow-x-auto leading-relaxed">
{`maven { url = 'https://maven.brott.dev/' }

implementation('com.acmerobotics.dashboard:dashboard:0.4.16') {
    exclude group: 'org.firstinspires.ftc'
}`}
              </pre>
            </div>

            <div className="flex flex-wrap gap-4 mt-auto pt-1">
              <ExtLink href="https://github.com/acmerobotics/ftc-dashboard">GitHub</ExtLink>
              <ExtLink href="https://acmerobotics.github.io/ftc-dashboard/gettingstarted.html">Docs</ExtLink>
            </div>
          </motion.div>

          {/* Panels */}
          <motion.div variants={fadeUp} whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 350, damping: 25 }} className="card p-6 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <LayoutDashboard size={19} className="text-violet-500" />
              </div>
              <div>
                <p className="font-semibold text-[15px] text-slate-900 dark:text-white leading-tight">Panels</p>
                <p className="text-[12px] text-slate-400 dark:text-slate-500">by bylazar / FTControl</p>
              </div>
            </div>

            <p className="text-[13.5px] text-slate-600 dark:text-slate-400 leading-relaxed">
              All-in-one dashboard with OpMode control, live graphing, and PWA install. Runs in any browser — phone or laptop.
            </p>

            <div className="flex-1 flex items-center rounded-lg border border-violet-200 dark:border-violet-800/40 bg-violet-50 dark:bg-violet-950/20 p-4">
              <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                No Gradle dependency needed — Panels connects over Wi-Fi using FTControl's companion app on the Robot Controller.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-auto pt-1">
              <ExtLink href="https://panels.bylazar.com/">panels.bylazar.com</ExtLink>
              <ExtLink href="https://ftcontrol.bylazar.com/docs/overview/">Docs</ExtLink>
            </div>
          </motion.div>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-5 text-[13px] text-slate-500 dark:text-slate-500 px-1">
          <strong className="text-slate-700 dark:text-slate-300">Note:</strong>{' '}
          FtcAutoTune's <code className="ci">TuningConfig</code> uses <code className="ci">@Config</code> so all tuning constants are live-editable on FTC Dashboard without redeploying.
        </motion.p>
      </div>
    </section>
  )
}
