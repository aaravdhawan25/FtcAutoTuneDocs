import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUp, Plus, X, Loader2, MessageSquare, Bug,
  Lightbulb, HelpCircle, ArrowLeft, Send, ChevronDown, CornerDownRight,
} from 'lucide-react'
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

function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const CATEGORY_META = {
  Bug:      { icon: Bug,        cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
  Question: { icon: HelpCircle, cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  Tip:      { icon: Lightbulb,  cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}
const AVATAR_COLORS = [
  'bg-blue-500/20 text-blue-400',
  'bg-violet-500/20 text-violet-400',
  'bg-emerald-500/20 text-emerald-400',
  'bg-amber-500/20 text-amber-400',
  'bg-rose-500/20 text-rose-400',
]
function avatarColor(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

const FILTERS = ['All', 'Bug', 'Question', 'Tip']

/* ─── avatar ──────────────────────────────────────────────────────── */
function Avatar({ name, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-8 h-8 text-[12px]'
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-semibold flex-shrink-0 ${avatarColor(name)}`}>
      {initials(name)}
    </div>
  )
}

/* ─── category badge ──────────────────────────────────────────────── */
function CategoryBadge({ category }) {
  const meta = CATEGORY_META[category] || CATEGORY_META.Question
  const Icon = meta.icon
  return (
    <span className={`inline-flex items-center gap-1 h-[18px] px-2 rounded-full text-[11px] font-semibold border flex-shrink-0 ${meta.cls}`}>
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

/* ─── reply form ──────────────────────────────────────────────────── */
function ReplyForm({ postId, onReplied }) {
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    if (!author.trim()) { setErr('Name required.'); return }
    if (!body.trim())   { setErr('Reply required.'); return }
    setBusy(true)
    const { data, error } = await supabase
      .from('forum_replies')
      .insert({ post_id: postId, author: author.trim().slice(0, 50), body: body.trim().slice(0, 500) })
      .select()
      .single()
    setBusy(false)
    if (error) { setErr('Could not post reply.'); return }
    onReplied(data)
    setBody('')
  }

  return (
    <form onSubmit={submit} className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
      <div className="flex gap-2">
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Your name"
          maxLength={50}
          className="w-36 h-8 px-3 text-[12px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Write a reply…"
          maxLength={500}
          rows={2}
          className="flex-1 px-3 py-2 text-[12px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors leading-relaxed"
        />
        <button
          type="submit"
          disabled={busy}
          className="self-end h-8 px-3 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors flex-shrink-0"
        >
          {busy ? <Loader2 size={12} className="animate-spin" /> : <><Send size={12} /> Reply</>}
        </button>
      </div>
      {err && <p className="text-[11px] text-red-500 dark:text-red-400">{err}</p>}
    </form>
  )
}

/* ─── thread view (expanded inside post card) ─────────────────────── */
function ThreadView({ post, onClose }) {
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    supabase
      .from('forum_replies')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setReplies(data || [])
        setLoading(false)
      })
  }, [post.id])

  const handleReplied = useCallback(reply => {
    setReplies(prev => [...prev, reply])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ overflow: 'hidden' }}
    >
      <div className="ml-12 mt-3 mb-1">
        {/* Full body */}
        <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap mb-4 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
          {post.body}
        </p>

        {/* Replies */}
        {loading ? (
          <div className="flex items-center gap-2 text-[12px] text-slate-400 py-2">
            <Loader2 size={12} className="animate-spin" /> Loading replies…
          </div>
        ) : replies.length === 0 ? (
          <p className="text-[12px] text-slate-400 dark:text-slate-600 py-1">No replies yet. Be the first to respond.</p>
        ) : (
          <div className="space-y-3 mb-1">
            {replies.map(r => (
              <div key={r.id} className="flex gap-2.5">
                <CornerDownRight size={12} className="text-slate-300 dark:text-slate-700 mt-1 flex-shrink-0" />
                <Avatar name={r.author} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[12px] font-semibold text-slate-800 dark:text-slate-200">{r.author}</span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-600">{timeAgo(r.created_at)}</span>
                  </div>
                  <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <ReplyForm postId={post.id} onReplied={handleReplied} />
        <div ref={bottomRef} />

        <button
          onClick={onClose}
          className="mt-3 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          <ChevronDown size={11} /> Collapse thread
        </button>
      </div>
    </motion.div>
  )
}

/* ─── post card ───────────────────────────────────────────────────── */
function PostCard({ post, replyCount, onReplyCountIncrease }) {
  const [upvoted, setUpvoted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ftcat-upvoted') || '{}')[post.id] ?? false }
    catch { return false }
  })
  const [voteCount, setVoteCount] = useState(post.upvotes)
  const [threadOpen, setThreadOpen] = useState(false)
  const [localReplyCount, setLocalReplyCount] = useState(replyCount)

  const handleUpvote = async (e) => {
    e.stopPropagation()
    if (upvoted) return
    setUpvoted(true)
    setVoteCount(c => c + 1)
    try {
      const prev = JSON.parse(localStorage.getItem('ftcat-upvoted') || '{}')
      localStorage.setItem('ftcat-upvoted', JSON.stringify({ ...prev, [post.id]: true }))
    } catch {}
    if (supabase) {
      const { data } = await supabase.rpc('upvote_post', { post_id: post.id })
      if (data != null) setVoteCount(Number(data))
    }
  }

  const handleReplied = useCallback(() => {
    setLocalReplyCount(c => c + 1)
    onReplyCountIncrease?.(post.id)
  }, [post.id, onReplyCountIncrease])

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
    >
      <div className="flex gap-4">
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
            {voteCount}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <CategoryBadge category={post.category} />
            <span className="text-[14px] font-semibold text-slate-900 dark:text-white leading-snug">{post.title}</span>
          </div>

          {/* Preview body — 3 lines, only shown when thread is collapsed */}
          {!threadOpen && (
            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-2">
              {post.body}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center gap-3 flex-wrap mt-1">
            <div className="flex items-center gap-2">
              <Avatar name={post.author} size="sm" />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{post.author} · {timeAgo(post.created_at)}</span>
            </div>
            <button
              onClick={() => setThreadOpen(o => !o)}
              className={`flex items-center gap-1.5 text-[11.5px] font-medium transition-colors ml-auto ${
                threadOpen
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-slate-400 dark:text-slate-500 hover:text-blue-400'
              }`}
            >
              <MessageSquare size={12} />
              {threadOpen
                ? 'Hide thread'
                : localReplyCount > 0
                  ? `View thread (${localReplyCount} ${localReplyCount === 1 ? 'reply' : 'replies'})`
                  : 'Start a thread'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Inline thread — expands below */}
      <AnimatePresence>
        {threadOpen && (
          <ThreadView
            post={post}
            onClose={() => setThreadOpen(false)}
            onReplied={handleReplied}
          />
        )}
      </AnimatePresence>
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
  const [replyCounts, setReplyCounts] = useState({})
  const [filter, setFilter] = useState('All')
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    Promise.all([
      supabase.from('forum_posts').select('*').order('upvotes', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('forum_replies').select('post_id'),
    ]).then(([{ data: posts }, { data: replies }]) => {
      setPosts(posts || [])
      const counts = {}
      for (const r of replies || []) counts[r.post_id] = (counts[r.post_id] || 0) + 1
      setReplyCounts(counts)
      setLoading(false)
    })
  }, [])

  const handleCreated = useCallback(post => {
    setPosts(prev => [post, ...prev])
  }, [])

  const handleReplyCountIncrease = useCallback(postId => {
    setReplyCounts(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }))
  }, [])

  const visible = filter === 'All' ? posts : posts.filter(p => p.category === filter)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <AnnouncementBanner />

      {/* Top bar */}
      <div className="fixed inset-x-0 top-9 z-40 h-14 flex items-center border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 flex items-center gap-4">
          <button
            onClick={() => navigate('docs')}
            className="flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft size={14} /> Back to docs
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
            <p className="text-[14px] text-slate-500 dark:text-slate-400">Post bugs, questions, and tips. Click any post to start or view its thread.</p>
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
            <NewPostForm onClose={() => setFormOpen(false)} onCreated={handleCreated} />
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
                <PostCard
                  key={post.id}
                  post={post}
                  replyCount={replyCounts[post.id] || 0}
                  onReplyCountIncrease={handleReplyCountIncrease}
                />
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
