import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckSquare, Square, Info } from 'lucide-react'

function useChecklist(key, count) {
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`ftcat-${key}`) || 'null') || new Array(count).fill(false) }
    catch { return new Array(count).fill(false) }
  })
  const toggle = (i) => setChecked(prev => {
    const next = [...prev]; next[i] = !next[i]
    try { localStorage.setItem(`ftcat-${key}`, JSON.stringify(next)) } catch {}
    return next
  })
  return [checked, toggle]
}

function CheckItem({ text, checked, onToggle }) {
  return (
    <button onClick={onToggle} className="flex items-start gap-2.5 text-left w-full py-1.5 group focus-visible:outline-none rounded-sm">
      {checked
        ? <CheckSquare size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
        : <Square size={15} className="text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5 group-hover:text-slate-400 dark:group-hover:text-slate-500 transition-colors" />
      }
      <span className={`text-[13px] leading-relaxed transition-colors ${checked ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-700 dark:text-slate-300'}`}>{text}</span>
    </button>
  )
}

function Warn({ children }) {
  return (
    <div className="flex gap-2.5 p-3.5 rounded-lg border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 text-[13px]">
      <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{children}</span>
    </div>
  )
}

function Inf({ children }) {
  return (
    <div className="flex gap-2.5 p-3.5 rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 text-[13px]">
      <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{children}</span>
    </div>
  )
}

function OpModeTag({ name }) {
  return (
    <div className="inline-flex items-center gap-2 h-7 px-3 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[12px] font-mono text-slate-600 dark:text-slate-400 mb-5">
      OpMode: <span className="text-blue-600 dark:text-blue-400">{name}</span>
      <span className="text-slate-400">· group</span>
      <span className="text-emerald-600 dark:text-emerald-400">FTC-AutoTune</span>
    </div>
  )
}

function Steps({ items }) {
  return (
    <div className="space-y-3">
      {items.map((text, i) => (
        <div key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-500 flex items-center justify-center mt-0.5">{i + 1}</span>
          <p className="text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  )
}

const V_CHECKS = [
  "Set MOTOR_NAME to your shooter/flywheel motor's config name",
  "Set TICKS_PER_REV (GoBILDA 435 RPM = 384.5, GoBILDA 312 RPM = 537.7, REV HD Hex bare = 28.0)",
  "Set VELOCITY_TARGET_TICKS_PER_SEC to your shooting speed, OR set USE_RPM_TARGET=true and VELOCITY_TARGET_RPM",
  "Set TUNE_INTEGRAL_TERM=false (recommended — kF handles steady state, integral causes windup)",
  "Verify motor can spin freely (flywheel spins, mechanism not jammed)",
]
const P_CHECKS = [
  "Set MOTOR_NAME to your arm/lift motor's config name",
  "Set POSITION_TARGET_TICKS to a safe offset (start small, e.g. 200 ticks)",
  "Set POSITION_HYSTERESIS_TICKS (default 10 is usually fine)",
  "Ensure the mechanism has POSITION_TARGET_TICKS of free travel in BOTH directions from start",
]
const D_CHECKS = [
  "Set MOTOR_NAME + REVERSED for motor 1 (the one WITH the encoder)",
  "Set MOTOR_NAME_2 + REVERSED_2 for motor 2 (usually REVERSED_2=true for opposing-face flywheels)",
  "Set DUAL_ENCODERS=false if only motor 1 has an encoder (most common). Set true only if BOTH have encoders.",
  "Set velocity target same as single-motor tuner",
]

function VelocityTab() {
  const [c, t] = useChecklist('velocity', V_CHECKS.length)
  return (
    <div className="space-y-5">
      <OpModeTag name='"Velocity PIDF Tuner"' />
      <div>
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Setup Checklist</p>
        <div className="space-y-0.5">{V_CHECKS.map((txt, i) => <CheckItem key={i} text={txt} checked={c[i]} onToggle={() => t(i)} />)}</div>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Running the Tuner</p>
        <Steps items={[
          "Start OpMode → read startup telemetry, verify target RPM matches intent.",
          "Press Start → Phase 1 begins automatically.",
          'PHASE 1 (Relay Test, ~10–30s): Motor oscillates velocity around target. Watch “Cycles collected” count up. Do not touch the robot.',
          "PHASE 2 (Feedforward Sweep, ~5s): Motor ramps through {0.5, 0.75, 1.0} power. Measures steady-state velocity for kF.",
          "Results appear. Six candidates shown with kP/kD/kF values.",
          'Hold gamepad1.A to live-test the “classic ZN” candidate. Watch velocity track target on telemetry.',
          "Copy the chosen candidate's gains into your subsystem code.",
        ]} />
      </div>
      <Warn><strong>If "Tuning TIMED OUT":</strong> Increase RELAY_AMPLITUDE (try 0.6–0.8 for flywheels), lower VELOCITY_TARGET_TICKS_PER_SEC, or check that the motor name is correct and the motor spins freely.</Warn>
    </div>
  )
}

function PositionTab() {
  const [c, t] = useChecklist('position', P_CHECKS.length)
  return (
    <div className="space-y-5">
      <OpModeTag name='"Position PIDF Tuner"' />
      <Warn><strong>Safety:</strong> The mechanism WILL oscillate ±POSITION_TARGET_TICKS from start repeatedly. Ensure no hard stops are within that range. Start with RELAY_AMPLITUDE=0.3.</Warn>
      <div>
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Setup Checklist</p>
        <div className="space-y-0.5">{P_CHECKS.map((txt, i) => <CheckItem key={i} text={txt} checked={c[i]} onToggle={() => t(i)} />)}</div>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Running the Tuner</p>
        <Steps items={[
          "Start OpMode → verify target ticks and motor name in telemetry.",
          "Press Start → single relay phase runs (no feedforward sweep for position).",
          "Mechanism oscillates back and forth around POSITION_TARGET_TICKS.",
          "Results appear with six candidates.",
          "Hold gamepad1.A to live-test — holds at target position using candidate 2 (no overshoot, safest for arms).",
        ]} />
      </div>
      <Inf>For gravity-affected mechanisms (vertical arm, elevator), add <code className="ci">kG·cos(angle)</code> on top of the tuned PID in your final subsystem code. The relay test doesn't separate gravity from inertia.</Inf>
    </div>
  )
}

function DualTab() {
  const [c, t] = useChecklist('dual', D_CHECKS.length)
  return (
    <div className="space-y-5">
      <OpModeTag name='"Dual Velocity PIDF Tuner"' />
      <div>
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Setup Checklist</p>
        <div className="space-y-0.5">{D_CHECKS.map((txt, i) => <CheckItem key={i} text={txt} checked={c[i]} onToggle={() => t(i)} />)}</div>
      </div>
      <div>
        <p className="text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">How Dual Mode Differs</p>
        <div className="rounded-lg border border-slate-200 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden bg-white dark:bg-slate-900 text-[13px]">
          {[
            ['Driving', 'Both motors receive identical power output throughout all phases.'],
            ['Measurement', "Motor 1's encoder is used for all velocity readings when DUAL_ENCODERS=false."],
            ['Gains', 'Resulting kP/kD/kF apply identically to both motors.'],
            ['Feedforward', 'Phase 2 sweep runs both motors simultaneously.'],
          ].map(([label, text]) => (
            <div key={label} className="flex gap-3 px-4 py-3">
              <span className="text-[11px] font-bold text-blue-500 uppercase w-20 flex-shrink-0 pt-0.5">{label}</span>
              <span className="text-slate-600 dark:text-slate-400">{text}</span>
            </div>
          ))}
        </div>
      </div>
      <Inf>Running is identical to the single-motor velocity tuner — same two phases, same live test. The resulting gains work for both motors.</Inf>
    </div>
  )
}

const TABS = [
  { key: 'velocity', label: 'Velocity / Flywheel', component: <VelocityTab /> },
  { key: 'position', label: 'Position (Arm / Lift)', component: <PositionTab /> },
  { key: 'dual', label: 'Dual Motor Shooter', component: <DualTab /> },
]

export function TuningGuides({ id }) {
  const [active, setActive] = useState('velocity')
  return (
    <section id={id} className="section-outer bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
      <div className="prose-inner">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="section-label">Guides</p>
          <h2 className="section-h2">Tuning Guides</h2>
          <p className="section-sub">Step-by-step for each tuning mode. Checkboxes are saved in your browser.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">

          {/* Tab bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setActive(key)}
                className={`relative flex-1 min-w-max px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                  active === key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}>
                {label}
                {active === key && (
                  <motion.div layoutId="tg-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="p-6">
              {TABS.find(t => t.key === active)?.component}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
