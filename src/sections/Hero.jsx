import { motion } from 'framer-motion'
import { ArrowRight, Github, Zap, Settings, Layers } from 'lucide-react'
import AetherHero from '../components/ui/aether-hero'

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
    <AetherHero
      height="min-h-[88vh]"
      className="relative"
      overlayGradient="linear-gradient(180deg, #000000bb 0%, #00000055 40%, transparent 80%)"
      ariaLabel="FtcAutoTune hero background"
    >
      {/* Subtle dot grid on top of the shader */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.25]"
        style={{
          backgroundImage: 'radial-gradient(rgba(59,130,246,0.25) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Radial blue glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Scroll-target anchor */}
      <span id={id} className="absolute top-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] text-center max-w-4xl mx-auto px-6 py-24">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full">

          {/* Version badge */}
          <motion.div variants={up} className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 h-7 px-3 rounded-full text-[11.5px] font-medium text-blue-300 border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              v0.3.6 · Now on JitPack
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={up}
            className="text-[3.75rem] sm:text-[5rem] md:text-[6rem] font-extrabold text-white leading-[0.95] tracking-[-0.04em] mb-6"
            style={{ fontFamily: "'Space Grotesk', ui-sans-serif, system-ui, sans-serif" }}
          >
            FtcAuto<span className="text-blue-400">Tune</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={up}
            className="text-lg sm:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed mb-10"
            style={{ textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
          >
            Relay-feedback PID/PIDF auto-tuning for FTC.{' '}
            <span className="text-white">Drop in two files, press start, get your gains.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={up}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
          >
            <button
              onClick={() => scrollTo('installation')}
              style={{
                padding: '12px 22px',
                borderRadius: 12,
                background:
                  'linear-gradient(180deg, rgba(59,130,246,0.9), rgba(37,99,235,0.9))',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow:
                  'inset 0 0 0 1px rgba(255,255,255,.18), 0 10px 30px rgba(59,130,246,.3)',
                backdropFilter: 'blur(6px)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Get Started <ArrowRight size={15} />
            </button>
            <a
              href="https://github.com/aaravdhawan25/FtcAutoTune"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '12px 22px',
                borderRadius: 12,
                background: 'transparent',
                color: '#cbd5e1',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)',
                backdropFilter: 'blur(4px)',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              <Github size={15} /> GitHub
            </a>
          </motion.div>

          {/* Stat cards */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto"
          >
            {STATS.map(({ icon, value, sub }) => (
              <motion.div
                key={value}
                variants={up}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                style={{
                  padding: '1.25rem',
                  borderRadius: 16,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.12)',
                  backdropFilter: 'blur(8px) saturate(120%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span className="text-blue-400">{icon}</span>
                <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
                <p className="text-slate-400 text-xs">{sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Fade to page */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950 pointer-events-none" />
    </AetherHero>
  )
}
