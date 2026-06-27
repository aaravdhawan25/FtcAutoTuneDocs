import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeBlock } from '../components/CodeBlock'
import { Info } from 'lucide-react'

const VEL = `// In your subsystem — paste the gains from telemetry
private static final double kP = 0.00312;
private static final double kD = 0.00089;
private static final double kF = 0.000478;

private final PIDFController controller = new PIDFController(kP, 0, kD, kF);

public void setFlywheelVelocity(double targetTicksPerSec) {
    controller.setOutputBounds(0.0, 1.0);
    // Always use Math.abs — matches the relay test measurement
    double measurement = Math.abs(motor.getVelocity());
    double output = controller.calculate(targetTicksPerSec, measurement, timer.seconds());
    motor.setPower(output);
}

// Call when target changes to avoid windup on setpoint jumps
public void resetController() {
    controller.reset();
}`

const POS = `private static final double kP = 0.0089;
private static final double kD = 0.00041;

private final PIDFController controller = new PIDFController(kP, 0, kD, 0);

public void setArmPosition(int targetTicks) {
    controller.setOutputBounds(-1.0, 1.0);
    double output = controller.calculate(
        targetTicks, motor.getCurrentPosition(), timer.seconds()
    );
    motor.setPower(output);
}`

const IMP = `import com.aaravdhawan25.pidautotuner.PIDFController;`

const TABS = [
  { key: 'v', label: 'Velocity / Flywheel', code: VEL },
  { key: 'p', label: 'Position (Run-To-Position)', code: POS },
]

export function UsingGains({ id }) {
  const [tab, setTab] = useState('v')
  return (
    <section id={id} className="section-outer bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/60">
      <div className="prose-inner">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="section-label">Integration</p>
          <h2 className="section-h2">Using Your Gains</h2>
          <p className="section-sub">Copy the chosen candidate's values into your subsystem.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.45 }}
          className="rounded-xl border border-slate-200 dark:border-slate-700/80 overflow-hidden bg-white dark:bg-slate-900 shadow-sm mb-6">
          <div className="flex border-b border-slate-200 dark:border-slate-800">
            {TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`relative flex-1 px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 ${
                  tab === key ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}>
                {label}
                {tab === key && <motion.div layoutId="ug-tab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.16 }} className="p-5">
              <CodeBlock code={TABS.find(t => t.key === tab)?.code || ''} language="java" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="space-y-4">
          <div className="flex items-center gap-3">
            <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Import</p>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>
          <CodeBlock code={IMP} language="java" />
          <div className="flex gap-3 p-4 rounded-lg border border-blue-200 dark:border-blue-800/40 bg-blue-50 dark:bg-blue-950/20 text-[13px] mt-4">
            <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Use <code className="ci">setOutputBounds(0.0, 1.0)</code> for unidirectional mechanisms (flywheels) and <code className="ci">(-1.0, 1.0)</code> for bidirectional (arms, lifts). Always use <code className="ci">Math.abs(motor.getVelocity())</code> in velocity loops — the relay test uses it and your production code should match.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
