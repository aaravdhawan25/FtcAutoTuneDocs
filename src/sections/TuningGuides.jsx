import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckSquare, Square, Info } from 'lucide-react'

// Persisted checkbox state per guide
function useChecklist(key, count) {
  const storageKey = `ftcautotune-checklist-${key}`
  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : new Array(count).fill(false)
    } catch {
      return new Array(count).fill(false)
    }
  })

  const toggle = (i) => {
    setChecked((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
      return next
    })
  }

  return [checked, toggle]
}

function CheckItem({ text, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-start gap-3 text-left w-full py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
    >
      {checked
        ? <CheckSquare size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
        : <Square size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
      }
      <span className={`text-sm leading-relaxed ${checked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
        {text}
      </span>
    </button>
  )
}

function WarnBox({ children }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-slate-700 dark:text-slate-300">{children}</p>
    </div>
  )
}

function InfoBox({ children }) {
  return (
    <div className="flex gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
      <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-slate-700 dark:text-slate-300">{children}</p>
    </div>
  )
}

function RunStep({ num, children }) {
  return (
    <div className="flex gap-3">
      <span className="w-6 h-6 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {num}
      </span>
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{children}</p>
    </div>
  )
}

const VELOCITY_CHECKS = [
  "Set MOTOR_NAME to your shooter/flywheel motor's config name",
  'Set TICKS_PER_REV (check your motor\'s spec sheet: GoBILDA 435 RPM = 384.5, GoBILDA 312 RPM = 537.7, REV HD Hex bare = 28.0)',
  'Set VELOCITY_TARGET_TICKS_PER_SEC to your shooting speed, OR set USE_RPM_TARGET=true and VELOCITY_TARGET_RPM to your target RPM',
  'Set TUNE_INTEGRAL_TERM=false (recommended — kF handles steady state, integral causes windup)',
  'Verify motor can spin freely (flywheel spins, mechanism not jammed)',
]

const POSITION_CHECKS = [
  "Set MOTOR_NAME to your arm/lift motor's config name",
  'Set POSITION_TARGET_TICKS to a safe offset (start small, e.g. 200 ticks)',
  'Set POSITION_HYSTERESIS_TICKS (default 10 is usually fine)',
  'Ensure the mechanism has POSITION_TARGET_TICKS of free travel in BOTH directions from its starting position',
]

const DUAL_CHECKS = [
  'Set MOTOR_NAME + REVERSED for motor 1 (the one WITH the encoder)',
  'Set MOTOR_NAME_2 + REVERSED_2 for motor 2 (usually REVERSED_2=true for opposing-face flywheels)',
  'Set DUAL_ENCODERS=false if only motor 1 has an encoder (most common). Set true only if BOTH have encoders.',
  'Set velocity target same as single-motor tuner',
]

function VelocityTab() {
  const [checked, toggle] = useChecklist('velocity', VELOCITY_CHECKS.length)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 w-fit">
        OpMode: <span className="text-blue-500 ml-1">"Velocity PIDF Tuner"</span>
        <span className="ml-1">in group</span>
        <span className="text-emerald-500 ml-1">FtcAutoTune</span>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Setup Checklist</p>
        <div className="space-y-1">
          {VELOCITY_CHECKS.map((text, i) => (
            <CheckItem key={i} text={text} checked={checked[i]} onToggle={() => toggle(i)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Running the Tuner</p>
        <div className="space-y-3">
          <RunStep num="1">Start OpMode → reads startup telemetry, verify target RPM shown matches intent.</RunStep>
          <RunStep num="2">Press Start → Phase 1 begins automatically.</RunStep>
          <RunStep num="3"><strong>PHASE 1 (Relay Test, ~10–30s):</strong> Motor oscillates velocity around target. Watch "Cycles collected" count up. Do not touch the robot.</RunStep>
          <RunStep num="4"><strong>PHASE 2 (Feedforward Sweep, ~5s):</strong> Motor ramps through {'{'}0.5, 0.75, 1.0{'}'} power automatically. Measures steady-state velocity for kF.</RunStep>
          <RunStep num="5">Results appear. Six candidates shown with kP/kD/kF values.</RunStep>
          <RunStep num="6">Hold <kbd className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">gamepad1.A</kbd> to live-test the "classic ZN" candidate. Watch velocity track the target on telemetry.</RunStep>
          <RunStep num="7">Copy the chosen candidate's gains into your code.</RunStep>
        </div>
      </div>

      <WarnBox>
        <strong>If "Tuning TIMED OUT":</strong> Increase RELAY_AMPLITUDE (try 0.6–0.8 for flywheels), lower VELOCITY_TARGET_TICKS_PER_SEC, or check that the motor name is correct and the motor spins freely.
      </WarnBox>
    </div>
  )
}

function PositionTab() {
  const [checked, toggle] = useChecklist('position', POSITION_CHECKS.length)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 w-fit">
        OpMode: <span className="text-blue-500 ml-1">"Position PIDF Tuner"</span>
        <span className="ml-1">in group</span>
        <span className="text-emerald-500 ml-1">FtcAutoTune</span>
      </div>

      <WarnBox>
        <strong>Safety:</strong> The mechanism WILL oscillate ±POSITION_TARGET_TICKS from its start position repeatedly. Ensure no hard stops are within that range. Start with RELAY_AMPLITUDE=0.3.
      </WarnBox>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Setup Checklist</p>
        <div className="space-y-1">
          {POSITION_CHECKS.map((text, i) => (
            <CheckItem key={i} text={text} checked={checked[i]} onToggle={() => toggle(i)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Running the Tuner</p>
        <div className="space-y-3">
          <RunStep num="1">Start OpMode → verify target ticks and motor name in telemetry.</RunStep>
          <RunStep num="2">Press Start → single relay phase runs automatically (no feedforward sweep for position).</RunStep>
          <RunStep num="3">Watch cycles collect. Mechanism oscillates back and forth around POSITION_TARGET_TICKS.</RunStep>
          <RunStep num="4">Results appear with six candidates.</RunStep>
          <RunStep num="5">Hold <kbd className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">gamepad1.A</kbd> to live-test — holds mechanism at target position using candidate index 2 (no overshoot, safest for arms).</RunStep>
        </div>
      </div>

      <InfoBox>
        For gravity-affected mechanisms (vertical arm, elevator), the relay test won't capture gravity feedforward. Add <code className="font-mono text-xs">kG·cos(angle)</code> on top of the tuned PID gains in your final subsystem code.
      </InfoBox>
    </div>
  )
}

function DualTab() {
  const [checked, toggle] = useChecklist('dual', DUAL_CHECKS.length)
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 w-fit">
        OpMode: <span className="text-blue-500 ml-1">"Dual Velocity PIDF Tuner"</span>
        <span className="ml-1">in group</span>
        <span className="text-emerald-500 ml-1">FtcAutoTune</span>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Setup Checklist</p>
        <div className="space-y-1">
          {DUAL_CHECKS.map((text, i) => (
            <CheckItem key={i} text={text} checked={checked[i]} onToggle={() => toggle(i)} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">How Dual Mode Differs</p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700 text-sm">
          {[
            ['Driving', 'Both motors receive identical power output throughout all phases.'],
            ['Measurement', "Motor 1's encoder is used for all velocity readings when DUAL_ENCODERS=false."],
            ['Gains', 'Resulting kP/kD/kF apply identically to both motors.'],
            ['Feedforward', 'Phase 2 sweep runs both motors simultaneously.'],
          ].map(([label, text]) => (
            <div key={label} className="px-5 py-3 flex gap-3">
              <span className="text-xs font-bold text-blue-500 w-24 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-slate-600 dark:text-slate-400">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <InfoBox>
        Running is identical to the single-motor velocity tuner — same two phases, same live test (hold A). The resulting gains work for both motors.
      </InfoBox>
    </div>
  )
}

const TABS = [
  { key: 'velocity', label: 'Velocity / Flywheel', component: <VelocityTab /> },
  { key: 'position', label: 'Position (Arm / Lift)', component: <PositionTab /> },
  { key: 'dual', label: 'Dual Motor Shooter', component: <DualTab /> },
]

export function TuningGuides({ id }) {
  const [activeTab, setActiveTab] = useState('velocity')

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
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Guides</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Tuning Guides</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Step-by-step instructions for each tuning mode. Checkboxes are saved in your browser.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex-1 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset ${
                  activeTab === key
                    ? 'text-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30'
                }`}
              >
                {label}
                {activeTab === key && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {TABS.find((t) => t.key === activeTab)?.component}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
