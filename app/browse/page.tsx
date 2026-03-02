'use client'

import { useEffect, useState, useMemo } from 'react'

interface Prop {
  id: number
  day_number: number
  prop_name: string
  message_connection: string
  scriptures: string[]
  topics: string[]
  image_url?: string
  sermon_name?: string
  video_link?: string
  video_timestamp?: string
  ai_summary?: string
  scripture_texts?: { reference: string; text: string }[]
}

/* ─── Prop Detail Modal ─────────────────────────────────────────── */
function PropModal({ prop, onClose }: { prop: Prop; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{ background: 'var(--occ-surface)', border: '1px solid var(--occ-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{display:"block"}}>
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Image */}
        <div className="aspect-video bg-occ-charcoal overflow-hidden rounded-t-2xl relative flex items-center justify-center">
          {prop.image_url ? (
            <img src={prop.image_url} alt={prop.prop_name} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-8xl opacity-20">🎭</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-occ-surface via-transparent to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="bg-occ-red text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
              Day {prop.day_number}
            </span>
          </div>
        </div>

        <div className="p-8">
          <h2 className="font-display text-3xl font-bold text-white mb-3">{prop.prop_name}</h2>

          {prop.sermon_name && (
            <p className="text-gray-500 text-sm mb-6 italic">{prop.sermon_name}</p>
          )}

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Message Connection</h4>
              <p className="text-gray-300 leading-relaxed">{prop.message_connection}</p>
            </div>

            {prop.scriptures?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Scriptures</h4>
                <div className="flex flex-wrap gap-2">
                  {prop.scriptures.map((s, i) => (
                    <span key={i} className="scripture-ref">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {prop.topics?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {prop.topics.map((t, i) => (
                    <span key={i} className="topic-tag">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {prop.scripture_texts && prop.scripture_texts.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Scripture Text</h4>
                <div className="space-y-3">
                  {prop.scripture_texts.map((st, i) =>
                    st.text ? (
                      <div
                        key={i}
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(220,38,38,0.06)', borderLeft: '3px solid var(--occ-red)' }}
                      >
                        <p className="text-gray-300 italic text-sm leading-relaxed">{st.text}</p>
                        <p className="text-occ-red text-xs mt-2 font-semibold">{st.reference}</p>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {prop.video_link && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Watch the Sermon</h4>
                <a
                  href={prop.video_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-occ-red hover:bg-occ-red-dark text-white px-5 py-3 rounded-full font-semibold text-sm transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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
        </div>
      </div>
    </div>
  )
}

/* ─── Browse Page ───────────────────────────────────────────────── */
export default function BrowsePage() {
  const [props, setProps] = useState<Prop[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProp, setSelectedProp] = useState<Prop | null>(null)
  const [search, setSearch] = useState('')
  const [topicFilter, setTopicFilter] = useState('')

  useEffect(() => {
    fetch('/api/props')
      .then(res => res.json())
      .then(data => {
        setProps(data.props || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Collect all unique topics
  const allTopics = useMemo(() => {
    const set = new Set<string>()
    props.forEach(p => p.topics?.forEach(t => set.add(t)))
    return Array.from(set).sort()
  }, [props])

  // Filter props
  const filtered = useMemo(() => {
    return props.filter(p => {
      const matchSearch = !search || 
        p.prop_name.toLowerCase().includes(search.toLowerCase()) ||
        p.message_connection.toLowerCase().includes(search.toLowerCase())
      const matchTopic = !topicFilter || p.topics?.includes(topicFilter)
      return matchSearch && matchTopic
    })
  }, [props, search, topicFilter])

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0a0a0a 0%, #110508 60%, #0a0a0a 100%)',
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="red-rule mx-auto mb-6" />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Browse All Props
          </h1>
          <p className="text-gray-400 text-lg">
            Two years of practical props for biblical teaching — {props.length > 0 ? props.length : '100'} in total.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-[56px] z-30 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter props..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full text-sm text-white placeholder-gray-500"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                outline: 'none',
              }}
            />
          </div>

          {/* Topic Dropdown */}
          <select
            value={topicFilter}
            onChange={e => setTopicFilter(e.target.value)}
            className="px-4 py-2.5 rounded-full text-sm font-medium text-gray-300 appearance-none cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              outline: 'none',
              minWidth: '160px',
            }}
          >
            <option value="">All Topics</option>
            {allTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Count */}
          <span className="text-gray-500 text-sm whitespace-nowrap">
            {filtered.length} prop{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Props Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'var(--occ-surface)', border: '1px solid var(--occ-border)' }}
              >
                <div className="aspect-video bg-occ-muted animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-occ-muted rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-occ-muted rounded animate-pulse w-full" />
                  <div className="h-3 bg-occ-muted rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 opacity-20">🎭</div>
            <p className="text-gray-500">No props match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((prop, i) => (
              <article
                key={prop.id}
                className="prop-card card-animate cursor-pointer group"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.5)}s` }}
                onClick={() => setSelectedProp(prop)}
              >
                {/* Image */}
                <div className="aspect-video bg-occ-charcoal overflow-hidden relative flex items-center justify-center">
                  {prop.image_url ? (
                    <img
                      src={prop.image_url}
                      alt={prop.prop_name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl opacity-20">🎭</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-occ-surface/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-occ-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase">
                      Day {prop.day_number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-white mb-2 leading-snug">
                    {prop.prop_name}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {prop.message_connection}
                  </p>
                  {prop.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {prop.topics.slice(0, 3).map((t, i) => (
                        <span key={i} className="topic-tag text-[10px]">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProp && (
        <PropModal prop={selectedProp} onClose={() => setSelectedProp(null)} />
      )}
    </div>
  )
}
