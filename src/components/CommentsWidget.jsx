import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

/* ─── helpers ────────────────────────────────────────────────────── */
let _bubbleId = 0
const nextId = () => ++_bubbleId

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ─── star rating ─────────────────────────────────────────────────── */
function Stars({ value, onChange, size = 18 }) {
  const [hover, setHover] = useState(0)
  const interactive = !!onChange
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={!interactive}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange(n)}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none' : 'cursor-default'}
        >
          <Star
            size={size}
            className={
              n <= (hover || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }
          />
        </button>
      ))}
    </div>
  )
}

/* ─── single floating bubble ─────────────────────────────────────── */
function Bubble({ comment, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.88 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -90, -270, -380],
        scale: [0.88, 1, 1, 0.92],
      }}
      transition={{ duration: 11, times: [0, 0.08, 0.82, 1], ease: 'easeInOut' }}
      onAnimationComplete={onDone}
      style={{ position: 'absolute', bottom: 0, right: 0, width: '17rem', pointerEvents: 'none' }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.96))',
          backdropFilter: 'blur(12px) saturate(120%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14), inset 0 0 0 1px rgba(255,255,255,0.6)',
          borderRadius: '1rem',
          padding: '0.75rem',
        }}
        className="dark:[background:linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.95))!important]"
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
            {comment.name}
          </span>
          <Stars value={comment.rating} size={11} />
        </div>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {comment.message}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── submit form ────────────────────────────────────────────────── */
function CommentForm({ onClose, onNewComment }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!rating) { setErr('Please pick a star rating.'); return }
    if (!name.trim()) { setErr('Name is required.'); return }
    if (!message.trim()) { setErr('Message is required.'); return }

    // Per-device cooldown (30 min) to reduce spam
    const last = localStorage.getItem('ftcat-comment-ts')
    if (last && Date.now() - parseInt(last, 10) < 1_800_000) {
      setErr('You already left a review recently — thank you!')
      return
    }

    setBusy(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({ name: name.trim().slice(0, 50), message: message.trim().slice(0, 300), rating })
      .select()
      .single()
    setBusy(false)

    if (error) { setErr('Could not save your comment. Please try again.'); return }

    localStorage.setItem('ftcat-comment-ts', String(Date.now()))
    onNewComment(data)
    setDone(true)
    setTimeout(() => { setDone(false); onClose() }, 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="w-72 rounded-2xl overflow-hidden shadow-2xl mb-3"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight">Leave a review</p>
            <p className="text-[11px] text-slate-400 mt-0.5">How helpful was this documentation?</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {done ? (
          <div className="px-4 py-10 text-center">
            <div className="text-3xl mb-3">🎉</div>
            <p className="text-[13.5px] font-semibold text-slate-800 dark:text-slate-200">Thanks for the review!</p>
            <p className="text-[12px] text-slate-400 mt-1">Your comment will float up for others to see.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="p-4 space-y-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              className="w-full h-9 px-3 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />

            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Rating
              </label>
              <Stars value={rating} onChange={setRating} size={22} />
            </div>

            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="What did you think of the docs?"
              maxLength={300}
              rows={3}
              className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors leading-relaxed"
            />

            {err && (
              <p className="text-[12px] text-red-500 dark:text-red-400">{err}</p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full h-9 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20"
            >
              {busy
                ? <Loader2 size={14} className="animate-spin" />
                : <><Send size={13} /> Post Review</>
              }
            </button>
          </form>
        )}
      </div>
    </motion.div>
  )
}

/* ─── main widget ─────────────────────────────────────────────────── */
export function CommentsWidget() {
  const [comments, setComments] = useState([])
  const [queue, setQueue] = useState([])
  const [activeBubbles, setActiveBubbles] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const queueIdxRef = useRef(0)

  // Fetch on mount
  useEffect(() => {
    if (!supabase) return
    supabase
      .from('comments')
      .select('id, name, message, rating, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (data?.length) {
          setComments(data)
          setQueue(shuffle(data))
        }
      })
  }, [])

  // Spawn a bubble every 5 s; each comment shown once; stop after 10 s
  useEffect(() => {
    if (!queue.length) return

    const spawn = () => {
      setActiveBubbles(prev => {
        if (prev.length >= 3) return prev
        const idx = queueIdxRef.current
        if (idx >= queue.length) return prev // all shown, stop
        queueIdxRef.current++
        return [...prev, { id: nextId(), comment: queue[idx] }]
      })
    }

    spawn() // immediate first bubble
    const interval = setInterval(spawn, 5000)
    const cutoff = setTimeout(() => clearInterval(interval), 10_000)

    return () => { clearInterval(interval); clearTimeout(cutoff) }
  }, [queue])

  const removeBubble = useCallback(id => {
    setActiveBubbles(prev => prev.filter(b => b.id !== id))
  }, [])

  const handleNewComment = useCallback(comment => {
    setComments(prev => [comment, ...prev])
    setQueue(prev => [comment, ...prev])
  }, [])

  if (!supabase) return null

  return (
    <>
      {/* Floating bubbles — pointer-events none so nothing is blocked */}
      <div
        className="fixed z-40 pointer-events-none"
        style={{ bottom: '5rem', right: '1.5rem' }}
      >
        <div className="relative">
          <AnimatePresence>
            {activeBubbles.map(b => (
              <Bubble key={b.id} comment={b.comment} onDone={() => removeBubble(b.id)} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* UI layer — form + toggle button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {formOpen && (
            <CommentForm
              onClose={() => setFormOpen(false)}
              onNewComment={handleNewComment}
            />
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setFormOpen(f => !f)}
          className="relative h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-colors"
        >
          <AnimatePresence mode="wait">
            {formOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={18} />
                </motion.span>
              : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <MessageCircle size={18} />
                </motion.span>
            }
          </AnimatePresence>

          {/* Comment count badge */}
          {comments.length > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-[10px] font-bold text-slate-900 flex items-center justify-center leading-none">
              {comments.length > 99 ? '99+' : comments.length}
            </span>
          )}
        </motion.button>
      </div>
    </>
  )
}
