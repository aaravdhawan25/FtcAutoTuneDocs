function Dot() {
  return <span className="mx-3 text-slate-600 text-[11px] select-none">·</span>
}

function Segment() {
  return (
    <span className="flex items-center flex-shrink-0 pr-16">
      <span className="text-blue-400 text-[13px] mr-2 select-none">⚡</span>
      <span className="text-white font-semibold text-[12.5px] tracking-tight">Newly released</span>
      <span className="mx-3 inline-flex items-center h-[18px] px-2.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[11px] font-bold tracking-wide">
        v0.3.6
      </span>
      <Dot />
      <span className="text-slate-400 text-[12px]">Relay-feedback PID/PIDF auto-tuning for FTC</span>
      <Dot />
      <span className="text-slate-400 text-[12px]">JitPack ready</span>
      <Dot />
      <span className="text-slate-400 text-[12px]">Zero config</span>
      <Dot />
      <span className="text-slate-400 text-[12px]">Three OpModes</span>
      <Dot />
      <span className="text-blue-400 text-[12px] font-medium">FTC-AutoTune</span>
      <Dot />
    </span>
  )
}

export function AnnouncementBanner() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-50 h-9 flex items-center overflow-hidden"
      style={{ background: '#080d1a', borderBottom: '1px solid rgba(59,130,246,0.15)' }}
    >
      <div className="flex whitespace-nowrap" style={{ animation: 'marquee 35s linear infinite' }}>
        <Segment />
        <Segment />
        <Segment />
        <Segment />
      </div>
    </div>
  )
}
