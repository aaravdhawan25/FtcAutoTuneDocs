import { useState } from 'react'
import { motion } from 'framer-motion'
import { AccordionItem } from '../components/AccordionItem'

const FAQS = [
  {
    q: '"Tuning TIMED OUT" — what do I do?',
    a: (
      <div className="space-y-2">
        <p>The oscillation never started or didn't complete within RELAY_TEST_TIMEOUT_S. Try these in order:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 pl-1">
          <li>Increase RELAY_AMPLITUDE (try 0.6–0.8 for flywheels, 0.4–0.5 for arms)</li>
          <li>Lower your target velocity/position so the mechanism can actually reach it</li>
          <li>Verify the motor name exactly matches the hardware config in the Driver Station</li>
          <li>Check the encoder is plugged in and reading non-zero ticks</li>
          <li>Increase RELAY_TEST_TIMEOUT_S if the mechanism is just slow to settle</li>
        </ul>
      </div>
    ),
  },
  {
    q: 'The velocity tuner was jittering before. Is this fixed?',
    a: (
      <p>
        Yes, fixed in v0.3.6+. The root cause was that PIDMaster was using raw{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">getVelocity()</code>{' '}
        without Math.abs. When the relay applied negative power, velocity briefly went negative, causing the PID to see a massive
        positive error spike and jitter violently. DualMotorPIDMaster was always correct;
        PIDMaster now uses{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">Math.abs(getVelocity())</code>{' '}
        to match.
      </p>
    ),
  },
  {
    q: 'Do I need two encoders for the dual motor tuner?',
    a: (
      <p>
        No. Set{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">DUAL_ENCODERS=false</code>{' '}
        (the default). Motor 1's encoder is used for all velocity measurements;
        motor 2 is driven with the same power but its encoder isn't read.
        Both motors still receive identical output throughout all phases.
        Only set <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">DUAL_ENCODERS=true</code>{' '}
        if both motors physically have encoders wired — the tuner will then average both readings.
      </p>
    ),
  },
  {
    q: 'Why is kI = 0 on all candidates?',
    a: (
      <p>
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">TUNE_INTEGRAL_TERM</code>{' '}
        defaults to false, which selects the PD-only Ziegler-Nichols rule family.
        For flywheels and velocity loops, the feedforward term kF handles steady-state error,
        making integral unnecessary and prone to windup on setpoint changes.
        Set <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">TUNE_INTEGRAL_TERM=true</code>{' '}
        in TuningConfig if you want PI/PID/Pessen candidates instead.
      </p>
    ),
  },
  {
    q: 'Why does the library show up as "FtcAutoTune | Velocity PIDF" on the Driver Station?',
    a: (
      <p>
        The library ships its own built-in OpModes (prefixed with "FtcAutoTune |") as a standalone fallback —
        useful if you don't copy the QuickStart files. The QuickStart template OpModes use clean names
        like "Velocity PIDF Tuner". Both are safe to have simultaneously since they use different registered names.
        You can use either; the QuickStart versions are preferred since they read from your TuningConfig.
      </p>
    ),
  },
  {
    q: 'Can I use this without FTC Dashboard?',
    a: (
      <p>
        Yes. The{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">@Config</code>{' '}
        annotation on TuningConfig only activates when FTC Dashboard is installed.
        Without it the class still compiles and works fine — fields are just regular static variables.
        All telemetry output (gains, cycle count, phase info) also works on the plain Driver Station.
      </p>
    ),
  },
  {
    q: "For arms/lifts, why don't my gains compensate for gravity?",
    a: (
      <p>
        The relay test measures system dynamics around your test point but doesn't separate gravity from inertia.
        It characterizes the combined behavior. For gravity-affected mechanisms, add a feedforward term{' '}
        <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">kG * cos(armAngleRadians)</code>{' '}
        on top of the tuned PID output in your final subsystem code.
        The PID gains from tuning handle the dynamic response; the gravity feedforward holds position against gravity.
      </p>
    ),
  },
  {
    q: 'Which JitPack version should I use?',
    a: (
      <p>
        Always use the latest release tag. Currently{' '}
        <strong>v0.3.6</strong>. Check{' '}
        <a
          href="https://jitpack.io/#aaravdhawan25/FtcAutoTune"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-400 underline underline-offset-2"
        >
          jitpack.io/#aaravdhawan25/FtcAutoTune
        </a>{' '}
        for the latest green build. Using a specific release tag (e.g. v0.3.6) rather than "latest" is recommended
        for reproducible builds — JitPack rebuilds on-demand and "latest" resolves to the HEAD commit.
      </p>
    ),
  },
]

export function FAQ({ id }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i))

  return (
    <section id={id} className="py-24 px-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Help</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            FAQ & Troubleshooting
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Common questions and known issues.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              index={i}
              question={faq.q}
              answer={faq.a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </motion.div>

        {/* Still stuck? */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8"
        >
          <p className="text-slate-700 dark:text-slate-300 font-semibold mb-2">Still stuck?</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mb-5">
            Open an issue on GitHub with your TuningConfig values and the telemetry output.
          </p>
          <a
            href="https://github.com/aaravdhawan25/FtcAutoTune/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-blue-500/20"
          >
            Open an Issue on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  )
}
