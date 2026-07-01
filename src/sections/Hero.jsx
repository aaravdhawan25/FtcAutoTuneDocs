import { motion } from 'framer-motion'
import { MeshGradient, PulsingBorder } from '@paper-design/shaders-react'
import { ArrowRight, Github, Zap, Settings, Layers } from 'lucide-react'

const STATS = [
  { icon: <Layers size={16} />, value: '3 OpModes', sub: 'Position · Velocity · Dual' },
  { icon: <Zap size={16} />, value: 'Easy Configs', sub: 'Works with built-in defaults' },
  { icon: <Settings size={16} />, value: 'JitPack Ready', sub: 'Like Pedro Pathing' },
]

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] } }),
}

export function Hero({ id }) {
  return (
    <div className="relative bg-black" style={{ height: '92vh', minHeight: 540 }}>

      {/* SVG filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="hero-text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>

      {/* Mesh gradient — explicit style dimensions so canvas sizes correctly */}
      <MeshGradient
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        colors={['#000000', '#06b6d4', '#0891b2', '#1e3a5f', '#1d4ed8']}
        speed={0.25}
        backgroundColor="#000000"
      />

      {/* Scroll anchor */}
      <span id={id} className="absolute top-0" aria-hidden="true" />

      {/* Content — bottom-left */}
      <div className="absolute bottom-14 left-8 sm:left-14 z-20" style={{ maxWidth: '38rem' }}>

        {/* Badge */}
        <motion.div
          custom={0.15} variants={fadeUp} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-white/10 bg-white/5 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/85 text-[13px] font-medium tracking-wide">v0.3.7 · Now on JitPack</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          custom={0.3} variants={fadeUp} initial="hidden" animate="visible"
          className="mb-5 leading-none"
        >
          <span
            className="block font-light tracking-widest uppercase"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              background: 'linear-gradient(135deg, #ffffff 0%, #06b6d4 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'url(#hero-text-glow)',
            }}
          >
            FTC
          </span>
          <span
            className="block font-black text-white drop-shadow-2xl tracking-tight"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', lineHeight: 1 }}
          >
            AutoTune
          </span>
          <span
            className="block font-light text-white/55 italic tracking-wider mt-1"
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}
          >
            Automatic PID Tuner
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          custom={0.5} variants={fadeUp} initial="hidden" animate="visible"
          className="text-[15px] sm:text-[16px] font-light text-white/60 mb-8 leading-relaxed"
        >
          Relay-feedback PID/PIDF auto-tuning for FTC.{' '}
          <span className="text-white/90">Drop in four files, press start, get your PID(F) constants.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          custom={0.65} variants={fadeUp} initial="hidden" animate="visible"
          className="flex items-center gap-4 flex-wrap mb-8"
        >
          <motion.button
            onClick={() => scrollTo('installation')}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-[13px] flex items-center gap-2 cursor-pointer"
            style={{ boxShadow: '0 8px 32px rgba(6,182,212,0.3)' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Get Started <ArrowRight size={14} />
          </motion.button>
          <motion.a
            href="https://github.com/aaravdhawan25/FtcAutoTune"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full border-2 border-white/20 text-white/75 font-medium text-[13px] flex items-center gap-2 hover:bg-white/10 hover:text-white transition-colors backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Github size={14} /> GitHub
          </motion.a>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          custom={0.8} variants={fadeUp} initial="hidden" animate="visible"
          className="flex gap-3 flex-wrap"
        >
          {STATS.map(({ icon, value, sub }) => (
            <div
              key={value}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-md"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
              }}
            >
              <span className="text-cyan-400 flex-shrink-0">{icon}</span>
              <div>
                <p className="text-white font-semibold text-[12px] leading-tight">{value}</p>
                <p className="text-white/40 text-[10px]">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pulsing border — bottom right */}
      <div className="absolute bottom-10 right-10 z-20">
        <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
          <PulsingBorder
            colors={['#06b6d4', '#0891b2', '#3b82f6', '#1d4ed8', '#ffffff']}
            colorBack="#00000000"
            speed={1.5}
            roundness={1}
            thickness={0.1}
            softness={0.2}
            intensity={5}
            spotsPerColor={5}
            spotSize={0.1}
            pulse={0.1}
            smoke={0.5}
            smokeSize={4}
            scale={0.65}
            style={{ width: 60, height: 60, borderRadius: '50%' }}
          />
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transform: 'scale(1.6)' }}
          >
            <defs>
              <path id="hero-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <text style={{ fontSize: 7, fill: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
              <textPath href="#hero-circle" startOffset="0%">
                FTC-AutoTune · Relay PID · v0.3.7 · JitPack ·
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>

      {/* Fade to next section */}
      <div
        className="absolute bottom-0 inset-x-0 pointer-events-none z-10"
        style={{ height: 120, background: 'linear-gradient(to bottom, transparent, #0f172a)' }}
      />
    </div>
  )
}
