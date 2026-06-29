import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Plus, X, Loader2, MessageSquare, Bug, Lightbulb, HelpCircle, ArrowLeft, Star, EyeOff, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { profanityError } from '../lib/profanityFilter'
import { AnnouncementBanner } from '../components/AnnouncementBanner'
import { useNav } from '../context'

function timeAgo(ts) {
  const s = Math.floor((Date.now() - new Date(ts)) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const CATEGORY_META = {
  Bug:      { icon: Bug,        cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
  Question: { icon: HelpCircle, cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  Tip:      { icon: Lightbulb,  cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}
const FILTERS = ['All', 'Bug', 'Question', 'Tip']

function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Question
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 h-[18px] px-2 rounded-full text-[11px] font-semibold border ${meta.cls}`}>
      <Icon size={10} strokeWidth={2.5} />
      {category}
    </span>
  )
}

function StarRating({ postId, avgRating, ratingCount, onRated }) {
  const [hovered, setHovered] = useState(0)
  const [userRating, setUserRating] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ftcat-ratings') || '{}')[postId] ?? 0 }
    catch { return 0 }
  })
  const [busy, setBusy] = useState(false)

  const rated = userRating > 0
  const display = hovered || userRating || Math.round(avgRating) || 0

  const handleRate = async (stars) => {
    if (rated || busy) return
    setBusy(true)
    setUserRating(stars)
    try {
      const prev = JSON.parse(localStorage.getItem('ftcat-ratings') || '{}')
      localStorage.setItem('ftcat-ratings', JSON.stringify({ ...prev, [postId]: stars }))
    } catch {}
    if (supabase) {
      await supabase.from('post_ratings').insert({ post_id: postId, rating: stars })
    }
    setBusy(false)
    onRated?.(postId, stars)
  }

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0">
      <div className="flex items-center gap-0.5" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            disabled={rated || busy}
            onClick={() => handleRate(n)}
            onMouseEnter={() => !rated && setHovered(n)}
            className="disabled:cursor-default focus:outline-none"
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          >
            <Star
              size={13}
              className={`transition-colors ${
                n <= display
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-slate-300 dark:text-slate-700'
              }`}
            />
          </button>
        ))}
      </div>
      {ratingCount > 0 && (
        <span className="text-[11px] text-slate-400 dark:text-slate-600 tabular-nums">
          {avgRating.toFixed(1)} ({ratingCount})
        </span>
      )}
      {ratingCount === 0 && !rated && (
        <span className="text-[11px] text-slate-400 dark:text-slate-600">Rate</span>
      )}
    </div>
  )
}

function NewPostForm({ onClose, onCreated }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('Question')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!title.trim()) { setErr('Title is required.'); return }
    if (!body.trim())  { setErr('Description is required.'); return }
    if (!author.trim()) { setErr('Name is required.'); return }

    const pErr = profanityError({ title: title.trim(), description: body.trim(), name: author.trim() })
    if (pErr) { setErr(pErr); return }

    setBusy(true)
    const { data, error } = await supabase
      .from('forum_posts')
      .insert({ title: title.trim().slice(0, 120), body: body.trim().slice(0, 1000), author: author.trim().slice(0, 50), category })
      .select()
      .single()
    setBusy(false)

    if (error) { setErr('Could not post — please try again.'); return }
    onCreated(data)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm mb-4"
    >
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
        <p className="text-[13px] font-semibold text-slate-900 dark:text-white">New post</p>
        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <X size={14} />
        </button>
      </div>
      <form onSubmit={submit} className="p-5 space-y-3">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title — describe the issue or tip in one line"
          maxLength={120}
          className="w-full h-9 px-3 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        <div className="flex gap-3">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="h-9 px-3 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option>Bug</option>
            <option>Question</option>
            <option>Tip</option>
          </select>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name"
            maxLength={50}
            className="flex-1 h-9 px-3 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Describe the problem or tip. Include TuningConfig values and telemetry output if reporting a bug."
          maxLength={1000}
          rows={4}
          className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors leading-relaxed"
        />
        {err && <p className="text-[12px] text-red-500 dark:text-red-400">{err}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-8 px-4 rounded-lg text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={busy} className="h-8 px-4 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-[12px] font-semibold flex items-center gap-2 transition-colors">
            {busy ? <Loader2 size={12} className="animate-spin" /> : 'Post'}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

function PostCard({ post, avgRating, ratingCount, onRated }) {
  const [upvoted, setUpvoted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ftcat-upvoted') || '{}')[post.id] ?? false }
    catch { return false }
  })
  const [count, setCount] = useState(post.upvotes)

  const handleUpvote = async () => {
    if (upvoted) return
    setUpvoted(true)
    setCount(c => c + 1)
    try {
      const prev = JSON.parse(localStorage.getItem('ftcat-upvoted') || '{}')
      localStorage.setItem('ftcat-upvoted', JSON.stringify({ ...prev, [post.id]: true }))
    } catch {}
    if (supabase) {
      const { data } = await supabase.rpc('upvote_post', { post_id: post.id })
      if (data != null) setCount(Number(data))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
    >
      <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-0.5">
        <button
          onClick={handleUpvote}
          aria-label="Upvote"
          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
            upvoted
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
              : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-blue-400/50 hover:text-blue-400 hover:bg-blue-500/5'
          }`}
        >
          <ChevronUp size={15} strokeWidth={2.5} />
        </button>
        <span className={`text-[12px] font-semibold tabular-nums ${upvoted ? 'text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
          {count}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <CategoryBadge category={post.category} />
          <span className="text-[14px] font-semibold text-slate-900 dark:text-white leading-snug">{post.title}</span>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-2">
          {post.body}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-[11px] text-slate-400 dark:text-slate-600">
            {post.author} · {timeAgo(post.created_at)}
          </p>
          <StarRating
            postId={post.id}
            avgRating={avgRating}
            ratingCount={ratingCount}
            onRated={onRated}
          />
        </div>
      </div>
    </motion.div>
  )
}

function EmptyState({ filter, onNew }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <MessageSquare size={32} className="text-slate-300 dark:text-slate-700 mb-4" />
      <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {filter === 'All' ? 'No posts yet' : `No ${filter} posts yet`}
      </p>
      <p className="text-[13px] text-slate-400 dark:text-slate-500 mb-5">
        Be the first to share a bug, question, or tuning tip.
      </p>
      <button
        onClick={onNew}
        className="h-9 px-5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-[13px] font-semibold flex items-center gap-2 transition-colors"
      >
        <Plus size={14} /> New post
      </button>
    </div>
  )
}

export function ForumPage() {
  const { navigate } = useNav()
  const [posts, setPosts] = useState([])
  const [ratings, setRatings] = useState({})
  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showHidden, setShowHidden] = useState(false)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    Promise.all([
      supabase.from('forum_posts').select('*').order('upvotes', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('post_ratings').select('post_id, rating'),
    ]).then(([{ data: postsData }, { data: ratingsData }]) => {
      setPosts(postsData || [])
      const map = {}
      for (const r of ratingsData || []) {
        if (!map[r.post_id]) map[r.post_id] = { sum: 0, count: 0 }
        map[r.post_id].sum += r.rating
        map[r.post_id].count += 1
      }
      const computed = {}
      for (const [id, { sum, count }] of Object.entries(map)) {
        computed[id] = { avg: sum / count, count }
      }
      setRatings(computed)
      setLoading(false)
    })
  }, [])

  const handleCreated = useCallback(post => {
    setPosts(prev => [post, ...prev])
  }, [])

  const handleRated = useCallback((postId, newRating) => {
    setRatings(prev => {
      const existing = prev[postId] || { avg: 0, count: 0 }
      const newCount = existing.count + 1
      const newAvg = (existing.avg * existing.count + newRating) / newCount
      return { ...prev, [postId]: { avg: newAvg, count: newCount } }
    })
  }, [])

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter)
  const visible = filtered.filter(p => { const r = ratings[p.id]; return !r || r.avg >= 3 })
  const hidden  = filtered.filter(p => { const r = ratings[p.id]; return r && r.avg < 3 })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AnnouncementBanner />

      <div className="fixed inset-x-0 top-9 z-40 h-14 flex items-center border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center gap-4">
          <button
            onClick={() => navigate('docs')}
            className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to docs
          </button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
          <span className="text-[14px] font-semibold text-slate-900 dark:text-white">Community Forum</span>
        </div>
      </div>

      <div className="pt-[92px] max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-label mb-2">Community</p>
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight mb-2">Forum</h1>
            <p className="text-[14px] text-slate-500 dark:text-slate-400">Post bugs, questions, and tuning tips. Rate posts to help surface the best ones.</p>
          </div>
          <button
            onClick={() => setFormOpen(f => !f)}
            className="flex-shrink-0 h-9 px-4 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-[13px] font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/20 mt-1"
          >
            {formOpen ? <X size={14} /> : <Plus size={14} />}
            {formOpen ? 'Cancel' : 'New post'}
          </button>
        </div>

        <AnimatePresence>
          {formOpen && (
            <NewPostForm
              onClose={() => setFormOpen(false)}
              onCreated={handleCreated}
            />
          )}
        </AnimatePresence>

        <div className="flex gap-2 mb-4 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-7 px-3 rounded-full text-[12px] font-medium transition-colors border ${
                filter === f
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto text-[12px] text-slate-400 dark:text-slate-600 self-center">
            {visible.length} {visible.length === 1 ? 'post' : 'posts'}
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          ) : visible.length === 0 && hidden.length === 0 ? (
            <EmptyState filter={filter} onNew={() => setFormOpen(true)} />
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <EyeOff size={28} className="text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-[13px] text-slate-500 dark:text-slate-400">All posts here are hidden due to low ratings.</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {visible.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  avgRating={ratings[post.id]?.avg ?? 0}
                  ratingCount={ratings[post.id]?.count ?? 0}
                  onRated={handleRated}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {hidden.length > 0 && (
          <div className="mt-3">
            <button
              onClick={() => setShowHidden(s => !s)}
              className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
            >
              {showHidden ? <Eye size={13} /> : <EyeOff size={13} />}
              {showHidden ? 'Hide' : 'Show'} {hidden.length} low-rated {hidden.length === 1 ? 'post' : 'posts'} (under 3 stars)
            </button>
            <AnimatePresence>
              {showHidden && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm opacity-60"
                >
                  {hidden.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      avgRating={ratings[post.id]?.avg ?? 0}
                      ratingCount={ratings[post.id]?.count ?? 0}
                      onRated={handleRated}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {!supabase && (
          <p className="text-center text-[13px] text-slate-400 mt-8">
            Forum requires Supabase env vars to be configured.
          </p>
        )}
      </div>
    </div>
  )
}
