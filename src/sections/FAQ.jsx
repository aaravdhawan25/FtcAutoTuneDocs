import { useState } from 'react'
import { motion } from 'framer-motion'
import { AccordionItem } from '../components/AccordionItem'
import { Github, MessageSquare } from 'lucide-react'
import { useNav } from '../context'

const ci = (text) => <code className="ci">{text}</code>

const FAQS = [
  {
    q: '"Tuning TIMED OUT" — what do I do?',
    a: (
      <div className="space-y-2">
        <p>The oscillation never started or didn't complete within RELAY_TEST_TIMEOUT_S. Try these in order:</p>
        <ul className="space-y-1 pl-4">
          {[
            'Increase RELAY_AMPLITUDE (try 0.6–0.8 for flywheels, 0.4–0.5 for arms)',
            'Lower your target velocity/position so the mechanism can reach it',
            'Verify the motor name exactly matches the hardware config in the Driver Station',
            'Check the encoder is plugged in and reading non-zero ticks',
            'Increase RELAY_TEST_TIMEOUT_S if the mechanism is just slow to settle',
          ].map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-slate-400 select-none">·</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    q: 'The velocity tuner was jittering before. Is this fixed?',
    a: <p>Yes, fixed in v0.3.7+. The root cause: PIDMaster was using raw {ci('getVelocity()')} without Math.abs. When the relay applied negative power, velocity briefly went negative, causing a massive error spike. DualMotorPIDMaster was always correct; PIDMaster now uses {ci('Math.abs(getVelocity())')} to match.</p>,
  },
  {
    q: 'Do I need two encoders for the dual motor tuner?',
    a: <p>No. Set {ci('DUAL_ENCODERS=false')} (the default). Motor 1's encoder is used for all velocity measurements; motor 2 is driven with the same power. Only set {ci('DUAL_ENCODERS=true')} if both motors physically have encoders wired.</p>,
  },
  {
    q: 'Why is kI = 0 on all candidates?',
    a: <p>{ci('TUNE_INTEGRAL_TERM')} defaults to false, selecting the PD-only ZN rule family. For flywheels and velocity loops, kF handles steady-state error, making integral unnecessary and prone to windup. Set {ci('TUNE_INTEGRAL_TERM=true')} for PI/PID/Pessen candidates.</p>,
  },
  {
    q: 'Why does the library show "FTC-AutoTune | Velocity PIDF" on the Driver Station?',
    a: <p>The library ships built-in OpModes (prefixed "FTC-AutoTune |") as a standalone fallback. The QuickStart templates use clean names like "Velocity PIDF Tuner". Both are safe — they use different registered names. The QuickStart versions are preferred since they read from your TuningConfig.</p>,
  },
  {
    q: 'Can I use this without FTC Dashboard?',
    a: <p>Yes. The {ci('@Config')} annotation on TuningConfig only activates when FTC Dashboard is installed. Without it the class still works fine — fields are just regular static variables. All telemetry works on the plain Driver Station.</p>,
  },
  {
    q: "For arms/lifts, why don't my gains compensate for gravity?",
    a: <p>The relay test measures combined system dynamics but doesn't separate gravity from inertia. Add a feedforward term {ci('kG * cos(armAngleRadians)')} on top of the tuned PID in your subsystem code. The PID handles dynamic response; the gravity term holds position against gravity.</p>,
  },
  {
    q: 'Which JitPack version should I use?',
    a: (
      <p>Always use the latest release tag — currently <strong>v0.3.7</strong>. Check{' '}
        <a href="https://jitpack.io/#aaravdhawan25/FtcAutoTune" target="_blank" rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-500">
          jitpack.io/#aaravdhawan25/FtcAutoTune
        </a>{' '}
        for the latest green build. Use a specific release tag (not "latest") for reproducible builds.
      </p>
    ),
  },
]

export function FAQ({ id }) {
  const [open, setOpen] = useState(null)
  const { navigate } = useNav()
  return (
    <section id={id} className="section-outer bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
      <div className="prose-inner">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="section-label">Help</p>
          <h2 className="section-h2">FAQ & Troubleshooting</h2>
          <p className="section-sub">Common questions and known issues.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.4 }}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shadow-sm mb-8">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} question={faq.q} answer={faq.a} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div>
            <p className="font-semibold text-[14px] text-slate-800 dark:text-slate-200 mb-0.5">Still stuck?</p>
            <p className="text-[13px] text-slate-500 dark:text-slate-500">Post in the community forum with your TuningConfig values and telemetry output.</p>
          </div>
          <button
            onClick={() => navigate('forum')}
            className="flex-shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-[13px] font-semibold transition-colors shadow-sm shadow-blue-500/20">
            <MessageSquare size={14} /> Open Forum
          </button>
        </motion.div>
      </div>
    </section>
  )
}
