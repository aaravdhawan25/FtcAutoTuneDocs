import { motion } from 'framer-motion'
import { ArrowRight, Github, Zap, Settings, Layers } from 'lucide-react'
import { ParticleCanvas } from '../components/ParticleCanvas'

const STATS = [
  {
    icon: <Layers size={20} />,
    value: '3 OpModes',
    sub: 'Position • Velocity • Dual Velocity',
  },
  {
    icon: <Zap size={20} />,
    value: 'Zero Config Required',
    sub: 'Works with built-in defaults',
  },
  {
    icon: <Settings size={20} />,
    value: 'JitPack Ready',
    sub: 'Like Pedro Pathing',
  },
]

const scrollTo = (id) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero({ id }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center text-center"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F172A 100%)' }}
    >
      <ParticleCanvas />

      {/* Grid dot overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              v0.3.6 — Now on JitPack
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold text-white tracking-tight mb-6"
          >
            FtcAuto<span className="text-blue-400">Tune</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Relay-feedback PID/PIDF auto-tuning for FTC.{' '}
            <span className="text-slate-100 font-medium">
              Drop in two files, press start, get your gains.
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <button
              onClick={() => scrollTo('installation')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-400/30 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Get Started
              <ArrowRight size={18} />
            </button>

            <a
              href="https://github.com/aaravdhawan25/FtcAutoTune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-500 hover:border-slate-300 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Github size={18} />
              GitHub
            </a>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {STATS.map(({ icon, value, sub }) => (
              <motion.div
                key={value}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex flex-col items-center gap-2 p-6 rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  {icon}
                </div>
                <p className="text-white font-bold text-base">{value}</p>
                <p className="text-slate-400 text-xs text-center">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Fade to page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900 pointer-events-none" />
    </section>
  )
}
