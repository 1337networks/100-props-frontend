'use client'

import { useState, useCallback } from 'react'

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

/* ─── Animated Particle Background ──────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 28 }, (_, i) => {
    const size = 2 + Math.random() * 4
    const x = Math.random() * 100
    const y = Math.random() * 100
    const duration = 6 + Math.random() * 10
    const delay = Math.random() * 8
    const opacity = 0.2 + Math.random() * 0.5
    const isRed = i % 7 === 0
    return { size, x, y, duration, delay, opacity, isRed, id: i }
  })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Radial gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(220,38,38,0.04) 0%, transparent 70%)',
        }}
      />
      {/* Red accent glow, off-center */}
      <div
        className="absolute"
        style={{
          width: '600px',
          height: '600px',
          top: '-100px',
          right: '-80px',
          background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute"
        style={{
          width: '400px',
          height: '400px',
          bottom: '0px',
          left: '-60px',
          background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: p.isRed ? 'rgba(220,38,38,0.7)' : 'rgba(255,255,255,0.7)',
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: p.isRed
              ? `0 0 ${p.size * 3}px rgba(220,38,38,0.5)`
              : `0 0 ${p.size * 2}px rgba(255,255,255,0.2)`,
          }}
        />
      ))}

      {/* Horizontal shimmer lines */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '35%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03) 30%, rgba(220,38,38,0.08) 50%, rgba(255,255,255,0.03) 70%, transparent)',
        }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          top: '65%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.02) 40%, rgba(220,38,38,0.06) 50%, rgba(255,255,255,0.02) 60%, transparent)',
        }}
      />
    </div>
  )
}

/* ─── Prop Card ─────────────────────────────────────────────────── */
function PropCard({ prop, index }: { prop: Prop; index: number }) {
  return (
    <article
      className="prop-card card-animate flex flex-col"
      style={{ animationDelay: `${Math.min(index * 0.08, 0.6)}s` }}
    >
      {/* Image */}
      <div className="aspect-video bg-occ-charcoal overflow-hidden relative">
        {prop.image_url ? (
          <img
            src={prop.image_url}
            alt={prop.prop_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{background:"var(--surface-2)"}}>
            <div className="text-5xl opacity-30">🎭</div>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-occ-surface via-transparent to-transparent opacity-60" />
        {/* Day badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-occ-red text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
            Day {prop.day_number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="font-display text-xl font-bold leading-snug" style={{color:"var(--text)"}}>
          {prop.prop_name}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3" style={{color:"var(--text-muted)"}}>
          {prop.message_connection}
        </p>

        {/* Scriptures */}
        {prop.scriptures?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {prop.scriptures.slice(0, 3).map((s, i) => (
              <span key={i} className="scripture-ref">{s}</span>
            ))}
          </div>
        )}

        {/* Topics */}
        {prop.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {prop.topics.slice(0, 4).map((t, i) => (
              <span key={i} className="topic-tag">{t}</span>
            ))}
          </div>
        )}

        {/* Video Link */}
        {prop.video_link?.startsWith('http') && (
          <div className="mt-auto pt-2">
            <a
              href={prop.video_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-occ-red hover:bg-occ-red-dark text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Video
              {prop.video_timestamp && (
                <span className="opacity-70 font-normal">@ {prop.video_timestamp}</span>
              )}
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

/* ─── How It Works ──────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{display:"block",flexShrink:0}}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      number: '01',
      title: 'Describe Your Message',
      desc: 'Tell us your sermon topic, scripture, or theme in plain language. Be as specific or broad as you like.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{display:"block",flexShrink:0}}>
          <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="3" fill="currentColor" stroke="none" className="text-occ-red"/>
        </svg>
      ),
      number: '02',
      title: 'AI Finds the Match',
      desc: 'Our semantic search understands context and meaning — not just keywords — to surface the most relevant props.',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{display:"block",flexShrink:0}}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ),
      number: '03',
      title: 'Get Inspired',
      desc: 'See scripture connections, message context, topic tags, and watch the original sermon — all in one card.',
    },
  ]

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <div className="red-rule mx-auto mb-6" />
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{color:"var(--text)"}}>How It Works</h2>
        <p className="text-lg max-w-xl mx-auto" style={{color:"var(--text-muted)"}}>
          Stop guessing. Start with AI-powered discovery across 100 hand-curated sermon props.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-px bg-gradient-to-r from-transparent via-occ-border to-transparent" />

        {steps.map((step, i) => (
          <div
            key={i}
            className="relative p-8 rounded-2xl flex flex-col gap-5"
            style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', animationDelay: `${i * 0.15}s` }}
          >
            <div className="flex items-start justify-between">
              <div className="text-occ-red">{step.icon}</div>
              <span
                className="font-display text-6xl font-bold leading-none"
                style={{ color: 'var(--border-2)', opacity: 0.6 }}
              >
                {step.number}
              </span>
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold mb-3" style={{color:"var(--text)"}}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{color:"var(--text-muted)"}}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Prop[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await runSearch(query)
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4"
        style={{ background: 'var(--bg)' }}
      >
        <ParticleField />

        <div className="relative z-10 w-full max-w-4xl mx-auto" style={{textAlign:'center'}}>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass-light">
            <span className="w-2 h-2 rounded-full bg-occ-red animate-pulse" />
            <span className="text-sm tracking-widest uppercase" style={{color:"var(--text-muted)"}}>One Community Church</span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-bold mb-6 leading-[0.95]"
            style={{ color: 'var(--text)', fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', letterSpacing: '-0.03em' }}
          >
            Find the{' '}
            <span
              className="relative"
              style={{
                color: 'var(--occ-red)',
                textShadow: '0 0 60px rgba(220,38,38,0.4)',
              }}
            >
              Perfect Prop
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{color:"var(--text-muted)"}}>
            AI-powered discovery across 100 curated sermon props. Describe your message — we'll find the visual that makes it land.
          </p>

          {/* Search Bar */}
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
                className="absolute right-2 bg-occ-red hover:bg-occ-red-dark disabled:opacity-50 text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-occ-red/20 whitespace-nowrap"
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

          {/* Quick Topic Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => runSearch(topic)}
                className="topic-pill"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <span className="text-xs tracking-widest uppercase" style={{color:"var(--text-faint)"}}>Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
        </div>
      </section>

      {/* ── Results / Empty State ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16" style={{backgroundColor:"var(--bg)"}}>
        {/* Results Header */}
        {searched && (
          <div className="mb-10">
            <div className="red-rule mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold" style={{color:"var(--text)"}}>
              {loading
                ? 'Finding matches...'
                : results.length > 0
                  ? `${results.length} prop${results.length !== 1 ? 's' : ''} found`
                  : 'No props found'}
            </h2>
            {!loading && results.length > 0 && (
              <p className="mt-2 text-sm" style={{color:"var(--text-muted)"}}>
                Showing top matches for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}
              >
                <div className="aspect-video animate-pulse" style={{background:"var(--surface-2)"}} />
                <div className="p-6 space-y-3">
                  <div className="h-5 rounded animate-pulse w-3/4" style={{background:"var(--surface-2)"}} />
                  <div className="h-4 rounded animate-pulse w-full" style={{background:"var(--surface-2)"}} />
                  <div className="h-4 rounded animate-pulse w-5/6" style={{background:"var(--surface-2)"}} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((prop, i) => (
              <PropCard key={prop.id} prop={prop} index={i} />
            ))}
          </div>
        )}

        {/* Empty search result */}
        {searched && !loading && results.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">🎭</div>
            <h3 className="font-display text-2xl font-bold mb-3" style={{color:"var(--text)"}}>No props found</h3>
            <p className="mb-8" style={{color:"var(--text-muted)"}}>Try a different phrase or browse by topic below.</p>
            <a
              href="/topics"
              className="inline-flex items-center gap-2 bg-occ-red hover:bg-occ-red-dark text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors"
            >
              Browse Topics
            </a>
          </div>
        )}

        {/* Initial state — How It Works */}
        {!searched && <HowItWorks />}
      </section>
    </div>
  )
}
