import { motion } from 'framer-motion'
import { ArrowRight, Github, Zap, Settings, Layers } from 'lucide-react'
import { ParticleCanvas } from '../components/ParticleCanvas'

const STATS = [
  { icon: <Layers size={18} />, value: '3 OpModes', sub: 'Position · Velocity · Dual' },
  { icon: <Zap size={18} />, value: 'Zero Config', sub: 'Works with built-in defaults' },
  { icon: <Settings size={18} />, value: 'JitPack Ready', sub: 'Like Pedro Pathing' },
]

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const up = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

export function Hero({ id }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden min-h-[88vh] flex flex-col items-center justify-center text-center"
      style={{ background: 'linear-gradient(160deg, #060b18 0%, #0f1f3d 50%, #060b18 100%)' }}
    >
      <ParticleCanvas />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(59,130,246,0.18) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* Badge */}
          <motion.div variants={up} className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full text-[11.5px] font-medium text-blue-300 border border-blue-500/20 bg-blue-500/8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              v0.3.6 · Now on JitPack
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={up} className="text-[3.75rem] sm:text-[5rem] md:text-[6rem] font-extrabold text-white leading-[0.95] tracking-[-0.04em] mb-6">
            FtcAuto<span className="text-blue-400">Tune</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={up} className="text-lg sm:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            Relay-feedback PID/PIDF auto-tuning for FTC.{' '}
            <span className="text-slate-200">Drop in two files, press start, get your gains.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={up} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20">
            <button
              onClick={() => scrollTo('installation')}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-blue-400/25 transition-all duration-200 hover:-translate-y-px"
            >
              Get Started <ArrowRight size={15} />
            </button>
            <a
              href="https://github.com/aaravdhawan25/FtcAutoTune"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 text-sm font-semibold transition-all duration-200 hover:-translate-y-px"
            >
              <Github size={15} /> GitHub
            </a>
          </motion.div>

          {/* Stat cards */}
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {STATS.map(({ icon, value, sub }) => (
              <motion.div
                key={value}
                variants={up}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-white/6 bg-white/3 backdrop-blur-sm"
              >
                <span className="text-blue-400">{icon}</span>
                <p className="text-white font-semibold text-sm">{value}</p>
                <p className="text-slate-500 text-xs">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Fade to page */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950 pointer-events-none" />
    </section>
  )
}
