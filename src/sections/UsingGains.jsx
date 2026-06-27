import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeBlock } from '../components/CodeBlock'
import { Info } from 'lucide-react'

const VELOCITY_CODE = `// In your subsystem — paste in the gains from telemetry
private static final double kP = 0.00312;
private static final double kD = 0.00089;
private static final double kF = 0.000478;

private final PIDFController controller = new PIDFController(kP, 0, kD, kF);

public void setFlywheelVelocity(double targetTicksPerSec) {
    controller.setOutputBounds(0.0, 1.0);
    // Always use Math.abs — velocity goes negative when relay reverses direction
    double measurement = Math.abs(motor.getVelocity());
    double output = controller.calculate(targetTicksPerSec, measurement, timer.seconds());
    motor.setPower(output);
}

// Call when target changes to avoid integral windup on setpoint jump
public void resetController() {
    controller.reset();
}`

const POSITION_CODE = `private static final double kP = 0.0089;
private static final double kD = 0.00041;

private final PIDFController controller = new PIDFController(kP, 0, kD, 0);

public void setArmPosition(int targetTicks) {
    controller.setOutputBounds(-1.0, 1.0);
    double output = controller.calculate(
        targetTicks, motor.getCurrentPosition(), timer.seconds()
    );
    motor.setPower(output);
}`

const IMPORT_CODE = `import com.aaravdhawan25.pidautotuner.PIDFController;`

const TABS = [
  { key: 'velocity', label: 'Velocity / Flywheel' },
  { key: 'position', label: 'Position (Run-To-Position)' },
]

export function UsingGains({ id }) {
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
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Integration</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">Using Your Gains</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Copy the chosen candidate's values into your subsystem code.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden mb-6"
        >
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
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
                    layoutId="gains-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-5"
            >
              <CodeBlock
                code={activeTab === 'velocity' ? VELOCITY_CODE : POSITION_CODE}
                language="java"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Import */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Import</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>
          <CodeBlock code={IMPORT_CODE} language="java" />

          <div className="flex gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 mt-4">
            <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>setOutputBounds:</strong> Use{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">0.0, 1.0</code>{' '}
              for unidirectional mechanisms (flywheels) and{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">-1.0, 1.0</code>{' '}
              for bidirectional (arms, lifts). Always call{' '}
              <code className="font-mono text-xs bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">Math.abs(motor.getVelocity())</code>{' '}
              for velocity measurements — the relay test uses it and your production code should match.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
