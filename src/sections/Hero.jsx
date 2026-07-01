import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MeshGradient, PulsingBorder } from '@paper-design/shaders-react'
import { ArrowRight, Github, Zap, Settings, Layers } from 'lucide-react'

const STATS = [
  { icon: <Layers size={16} />, value: '3 OpModes', sub: 'Position · Velocity · Dual' },
  { icon: <Zap size={16} />, value: 'Zero Config', sub: 'Works with built-in defaults' },
  { icon: <Settings size={16} />, value: 'JitPack Ready', sub: 'Like Pedro Pathing' },
]

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export function Hero({ id }) {
  const containerRef = useRef(null)

  return (
    <div ref={containerRef} className="relative min-h-[92vh] overflow-hidden bg-black">

      {/* SVG filters */}
      <svg className="absolute inset-0 w-0 h-0" aria-hidden>
        <defs>
          <filter id="hero-glass" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix type="matrix"
              values="1 0 0 0 0.02  0 1 0 0 0.02  0 0 1 0 0.05  0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="hero-text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="hero-title-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mesh gradient background */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#000000', '#06b6d4', '#0891b2', '#1e3a5f', '#1d4ed8']}
        speed={0.25}
        backgroundColor="#000000"
      />
      {/* Wireframe overlay */}
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-40"
        colors={['#000000', '#ffffff', '#06b6d4', '#3b82f6']}
        speed={0.15}
        wireframe="true"
        backgroundColor="transparent"
      />

      {/* Scroll anchor */}
      <span id={id} className="absolute top-0" aria-hidden="true" />

      {/* Main content — bottom-left */}
      <div className="absolute bottom-16 left-8 sm:left-14 z-20 max-w-2xl">

        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-7 border border-white/10 bg-white/5 backdrop-blur-sm relative"
          style={{ filter: 'url(#hero-glass)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="absolute top-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-full" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white/90 text-[13px] font-medium tracking-wide">v0.3.6 · Now on JitPack</span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-6 leading-none"
        >
          <span
            className="block text-[3rem] sm:text-[4.5rem] font-light tracking-widest uppercase mb-1"
            style={{
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
            className="block text-[4rem] sm:text-[6rem] font-black text-white drop-shadow-2xl leading-none tracking-tight"
          >
            AutoTune
          </span>
          <span className="block text-[1.4rem] sm:text-[1.8rem] font-light text-white/60 italic tracking-wider mt-1">
            Automatic PID Tuner
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-[15px] sm:text-[17px] font-light text-white/65 mb-9 leading-relaxed max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Relay-feedback PID/PIDF auto-tuning for FTC.{' '}
          <span className="text-white/90">Drop in two files, press start, get your gains.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-4 flex-wrap mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <motion.button
            onClick={() => scrollTo('installation')}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-[13px] flex items-center gap-2 shadow-lg hover:shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Get Started <ArrowRight size={14} />
          </motion.button>
          <motion.a
            href="https://github.com/aaravdhawan25/FtcAutoTune"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full border-2 border-white/25 text-white/80 font-medium text-[13px] flex items-center gap-2 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            <Github size={14} /> GitHub
          </motion.a>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          className="flex gap-3 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {STATS.map(({ icon, value, sub }) => (
            <motion.div
              key={value}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-md"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.1)',
              }}
            >
              <span className="text-cyan-400 flex-shrink-0">{icon}</span>
              <div>
                <p className="text-white font-semibold text-[12px] leading-tight">{value}</p>
                <p className="text-white/45 text-[11px]">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Pulsing border decoration — bottom right */}
      <div className="absolute bottom-10 right-10 z-20">
        <div className="relative w-20 h-20 flex items-center justify-center">
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
            style={{ width: '60px', height: '60px', borderRadius: '50%' }}
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
            <text style={{ fontSize: 7, fill: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
              <textPath href="#hero-circle" startOffset="0%">
                FTC-AutoTune · Relay PID · v0.3.6 · JitPack ·
              </textPath>
            </text>
          </motion.svg>
        </div>
      </div>

      {/* Fade to page */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-950 pointer-events-none z-10" />
    </div>
  )
}
