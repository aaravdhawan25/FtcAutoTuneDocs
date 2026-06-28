import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, Plus, X, Loader2, MessageSquare, Bug, Lightbulb, HelpCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AnnouncementBanner } from '../components/AnnouncementBanner'
import { useNav } from '../context'

/* ─── helpers ─────────────────────────────────────────────────────── */
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

/* ─── category badge ──────────────────────────────────────────────── */
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

/* ─── new post form ───────────────────────────────────────────────── */
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

/* ─── post card ───────────────────────────────────────────────────── */
function PostCard({ post, onUpvote }) {
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
      {/* Upvote column */}
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <CategoryBadge category={post.category} />
          <span className="text-[14px] font-semibold text-slate-900 dark:text-white leading-snug">{post.title}</span>
        </div>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-2">
          {post.body}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-slate-600">
          {post.author} · {timeAgo(post.created_at)}
        </p>
      </div>
    </motion.div>
  )
}

/* ─── empty state ─────────────────────────────────────────────────── */
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

/* ─── main page ───────────────────────────────────────────────────── */
export function ForumPage() {
  const { navigate } = useNav()
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase
      .from('forum_posts')
      .select('*')
      .order('upvotes', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  const handleCreated = useCallback(post => {
    setPosts(prev => [post, ...prev])
  }, [])

  const visible = filter === 'All' ? posts : posts.filter(p => p.category === filter)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AnnouncementBanner />

      {/* Sticky top bar */}
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

      {/* Content */}
      <div className="pt-[92px] max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-label mb-2">Community</p>
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight mb-2">Forum</h1>
            <p className="text-[14px] text-slate-500 dark:text-slate-400">Post bugs, questions, and tuning tips. Upvote helpful posts.</p>
          </div>
          <button
            onClick={() => setFormOpen(f => !f)}
            className="flex-shrink-0 h-9 px-4 rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-[13px] font-semibold flex items-center gap-2 transition-colors shadow-sm shadow-blue-500/20 mt-1"
          >
            {formOpen ? <X size={14} /> : <Plus size={14} />}
            {formOpen ? 'Cancel' : 'New post'}
          </button>
        </div>

        {/* New post form */}
        <AnimatePresence>
          {formOpen && (
            <NewPostForm
              onClose={() => setFormOpen(false)}
              onCreated={handleCreated}
            />
          )}
        </AnimatePresence>

        {/* Filter pills */}
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

        {/* Posts list */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="animate-spin text-slate-400" />
            </div>
          ) : visible.length === 0 ? (
            <EmptyState filter={filter} onNew={() => setFormOpen(true)} />
          ) : (
            <AnimatePresence initial={false}>
              {visible.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </AnimatePresence>
          )}
        </div>

        {!supabase && (
          <p className="text-center text-[13px] text-slate-400 mt-8">
            Forum requires Supabase env vars to be configured.
          </p>
        )}
      </div>
    </div>
  )
}
