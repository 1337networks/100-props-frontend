'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface Prop {
  id: number
  day_number: number
  prop_name: string
  message_connection: string
  scriptures: string[]
  topics: string[]
  image_url?: string
  video_link?: string
  video_timestamp?: string
  sermon_name?: string
}

const QUICK_TOPICS = ['faith', 'parenting', 'marriage', 'forgiveness', 'identity', 'sin', 'hope', 'prayer']

/* ─── YouTube embed helper ───────────────────────────────────────── */
function getYouTubeEmbedUrl(url: string, timestamp?: string): string | null {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/)
  if (!match) return null
  let embed = `https://www.youtube.com/embed/${match[1]}?rel=0`
  if (timestamp) {
    // convert "1:23:45" or "1:23" to seconds
    const parts = timestamp.split(':').map(Number).reverse()
    const secs = (parts[0] || 0) + (parts[1] || 0) * 60 + (parts[2] || 0) * 3600
    if (secs > 0) embed += `&start=${secs}`
  }
  return embed
}

/* ─── Particle Background ────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    size: 2 + (i * 1.3) % 4,
    x: (i * 37 + 11) % 100,
    y: (i * 53 + 7) % 100,
    duration: 6 + (i * 2.1) % 8,
    delay: (i * 0.7) % 6,
    opacity: 0.2 + (i * 0.13) % 0.4,
    isRed: i % 6 === 0,
    id: i,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(220,38,38,0.04) 0%, transparent 70%)' }} />
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full" style={{
          width: `${p.size}px`, height: `${p.size}px`,
          left: `${p.x}%`, top: `${p.y}%`,
          background: p.isRed ? 'rgba(220,38,38,0.6)' : 'rgba(100,100,100,0.4)',
          opacity: p.opacity,
          animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* ─── Prop Modal ─────────────────────────────────────────────────── */
function PropModal({ prop, onClose }: { prop: Prop; onClose: () => void }) {
  const embedUrl = prop.video_link ? getYouTubeEmbedUrl(prop.video_link, prop.video_timestamp) : null

  // Close on backdrop click or Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-600 hover:text-white"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Video embed */}
        {embedUrl && (
          <div className="aspect-video w-full rounded-t-2xl overflow-hidden">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={prop.prop_name}
            />
          </div>
        )}

        {/* Image fallback */}
        {!embedUrl && prop.image_url && (
          <div className="aspect-video w-full rounded-t-2xl overflow-hidden flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
            <img src={prop.image_url} alt={prop.prop_name} className="w-full h-full object-contain" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-start gap-4 pr-8">
            <span className="shrink-0 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase mt-1">
              Day {prop.day_number}
            </span>
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight" style={{ color: 'var(--text)' }}>
                {prop.prop_name}
              </h2>
              {prop.sermon_name && (
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--text-muted)' }}>
                  {prop.sermon_name}
                </p>
              )}
            </div>
          </div>

          {/* Message Connection */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="red-rule" />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Message Connection</span>
            </div>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {prop.message_connection}
            </p>
          </div>

          {/* Scriptures */}
          {prop.scriptures?.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="red-rule" />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Scripture References</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prop.scriptures.map((s, i) => (
                  <span key={i} className="scripture-ref">{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {prop.topics?.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="red-rule" />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Topics</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {prop.topics.map((t, i) => (
                  <span key={i} className="topic-tag">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Video link fallback (if not embeddable) */}
          {prop.video_link && !embedUrl && (
            <a
              href={prop.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-semibold text-sm transition-colors self-start"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Watch Sermon{prop.video_timestamp && ` @ ${prop.video_timestamp}`}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Prop Card ──────────────────────────────────────────────────── */
function PropCard({ prop, index, onClick }: { prop: Prop; index: number; onClick: () => void }) {
  return (
    <article
      className="prop-card card-animate flex flex-col cursor-pointer"
      style={{ animationDelay: `${Math.min(index * 0.08, 0.6)}s` }}
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden relative flex items-center justify-center" style={{ background: 'var(--surface-2)' }}>
        {prop.image_url ? (
          <img src={prop.image_url} alt={prop.prop_name} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-5xl opacity-20">🎭</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
            Day {prop.day_number}
          </span>
        </div>
        {/* Click hint */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full">View details</span>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl font-bold leading-snug" style={{ color: 'var(--text)' }}>
          {prop.prop_name}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-muted)' }}>
          {prop.message_connection}
        </p>

        {prop.scriptures?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prop.scriptures.slice(0, 3).map((s, i) => (
              <span key={i} className="scripture-ref">{s}</span>
            ))}
          </div>
        )}

        {prop.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prop.topics.slice(0, 4).map((t, i) => (
              <span key={i} className="topic-tag">{t}</span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 flex items-center gap-2" style={{ color: 'var(--text-faint)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span className="text-xs font-medium">Click to view full details</span>
          {prop.video_link && (
            <span className="ml-auto flex items-center gap-1 text-red-600 text-xs font-semibold">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Video
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

/* ─── How It Works ───────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Describe Your Message',
      desc: 'Tell us your sermon topic, scripture, or theme in plain language. Be as specific or broad as you like.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ display: 'block' }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      ),
    },
    {
      number: '02',
      title: 'AI Finds the Match',
      desc: 'Our semantic search understands context and meaning — not just keywords — to surface the most relevant props.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ display: 'block' }}>
          <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Get Inspired',
      desc: 'See scripture connections, message context, topic tags, and watch the original sermon — all in one place.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ display: 'block' }}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="red-rule mx-auto mb-6" />
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text)' }}>How It Works</h2>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Stop guessing. Start with AI-powered discovery across 100 hand-curated sermon props.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="p-8 rounded-2xl flex flex-col gap-5"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
            <div className="flex items-start justify-between">
              <div style={{ color: 'var(--occ-red)' }}>{step.icon}</div>
              <span className="font-display text-6xl font-bold leading-none" style={{ color: 'var(--border-2)', opacity: 0.5 }}>
                {step.number}
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Main Page ──────────────────────────────────────────────────── */
export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Prop[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [selectedProp, setSelectedProp] = useState<Prop | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setSearched(true)
    setQuery(q)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.props || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-scroll to results after search
  useEffect(() => {
    if (searched && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [searched, loading])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(query)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4"
        style={{ background: 'var(--bg)' }}
      >
        <ParticleField />

        <div className="relative z-10 w-full max-w-4xl mx-auto" style={{ textAlign: 'center' }}>
          <div className="eyebrow-badge mb-8">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse inline-block" />
            <span className="text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>One Community Church</span>
          </div>

          <h1
            className="font-display font-bold mb-6 leading-[0.95]"
            style={{ color: 'var(--text)', fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', letterSpacing: '-0.03em' }}
          >
            Find the{' '}
            <span style={{ color: 'var(--occ-red)', textShadow: '0 0 40px rgba(220,38,38,0.25)' }}>
              Perfect Prop
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            AI-powered discovery across 100 curated sermon props. Describe your message — we&apos;ll find the visual that makes it land.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto w-full">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 'overcoming fear' or 'Galatians 5: freedom'"
                className="search-input"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-lg whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Searching
                  </span>
                ) : 'Search'}
              </button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {QUICK_TOPICS.map((topic) => (
              <button key={topic} onClick={() => runSearch(topic)} className="topic-pill">
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-current to-transparent" style={{ color: 'var(--text-faint)' }} />
        </div>
      </section>

      {/* ── Results ──────────────────────────────────────── */}
      <section ref={resultsRef} className="max-w-7xl mx-auto px-4 md:px-6 py-16" style={{ background: 'var(--bg)' }}>
        {searched && (
          <div className="mb-10">
            <div className="red-rule mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ color: 'var(--text)' }}>
              {loading ? 'Finding matches...' : results.length > 0 ? `${results.length} prop${results.length !== 1 ? 's' : ''} found` : 'No props found'}
            </h2>
            {!loading && results.length > 0 && (
              <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                Showing top matches for &ldquo;{query}&rdquo; — click any card for full details
              </p>
            )}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
                <div className="aspect-video animate-pulse" style={{ background: 'var(--surface-2)' }} />
                <div className="p-6 space-y-3">
                  <div className="h-5 rounded animate-pulse w-3/4" style={{ background: 'var(--surface-2)' }} />
                  <div className="h-4 rounded animate-pulse w-full" style={{ background: 'var(--surface-2)' }} />
                  <div className="h-4 rounded animate-pulse w-5/6" style={{ background: 'var(--surface-2)' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((prop, i) => (
              <PropCard key={prop.id} prop={prop} index={i} onClick={() => setSelectedProp(prop)} />
            ))}
          </div>
        )}

        {searched && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">🎭</div>
            <h3 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--text)' }}>No props found</h3>
            <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Try a different phrase or browse by topic.</p>
            <a href="/topics" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors">
              Browse Topics
            </a>
          </div>
        )}

        {!searched && <HowItWorks />}
      </section>

      {/* ── Modal ────────────────────────────────────────── */}
      {selectedProp && <PropModal prop={selectedProp} onClose={() => setSelectedProp(null)} />}
    </div>
  )
}
