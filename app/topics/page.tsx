'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface TopicCount {
  topic: string
  count: number
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicCount[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleTopicClick = (topic: string) => {
    router.push(`/?q=${encodeURIComponent(topic)}`)
  }

  // Compute font size based on count
  const maxCount = Math.max(...topics.map(t => t.count), 1)
  const minCount = Math.min(...topics.map(t => t.count), 0)

  const getSize = (count: number) => {
    const ratio = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount)
    // Returns value 0..1
    return ratio
  }

  // Group topics into tiers
  const topTier = topics.filter(t => getSize(t.count) > 0.6)
  const midTier = topics.filter(t => getSize(t.count) > 0.3 && getSize(t.count) <= 0.6)
  const lowTier = topics.filter(t => getSize(t.count) <= 0.3)

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #0a0a0a 0%, #110508 60%, #0a0a0a 100%)',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,38,38,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="red-rule mx-auto mb-6" />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4" style={{ letterSpacing: '-0.03em' }}>
            Browse by Topic
          </h1>
          <p className="text-gray-400 text-lg">
            Click any topic to find matching props instantly. Larger = more props.
          </p>
        </div>
      </section>

      {/* Topics Cloud */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 py-16">
        {loading ? (
          <div className="flex flex-wrap gap-3 justify-center">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full animate-pulse"
                style={{
                  height: '44px',
                  width: `${60 + Math.random() * 80}px`,
                  background: 'var(--occ-surface)',
                }}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured / Top Topics */}
            {topTier.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="red-rule" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Most Referenced</span>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {topTier.map(({ topic, count }) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      onMouseEnter={() => setHoveredTopic(topic)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      className="card-animate relative overflow-hidden rounded-full font-display font-bold transition-all duration-300"
                      style={{
                        fontSize: `${1.1 + getSize(count) * 0.7}rem`,
                        padding: '12px 28px',
                        background: hoveredTopic === topic
                          ? 'rgba(220,38,38,0.2)'
                          : 'rgba(26,26,26,0.9)',
                        border: hoveredTopic === topic
                          ? '1px solid rgba(220,38,38,0.6)'
                          : '1px solid rgba(42,42,42,0.8)',
                        color: hoveredTopic === topic ? 'white' : '#e5e7eb',
                        boxShadow: hoveredTopic === topic
                          ? '0 0 30px rgba(220,38,38,0.25), 0 8px 32px rgba(0,0,0,0.4)'
                          : '0 4px 16px rgba(0,0,0,0.3)',
                        transform: hoveredTopic === topic ? 'translateY(-3px) scale(1.04)' : 'none',
                      }}
                    >
                      {topic}
                      <span
                        className="ml-2 text-xs font-sans font-normal"
                        style={{ color: hoveredTopic === topic ? 'rgba(252,165,165,0.9)' : 'rgba(107,114,128,0.8)' }}
                      >
                        {count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mid tier */}
            {midTier.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="red-rule" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Frequently Used</span>
                </div>
                <div className="flex flex-wrap gap-2.5 justify-center">
                  {midTier.map(({ topic, count }) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      onMouseEnter={() => setHoveredTopic(topic)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      className="card-animate rounded-full font-semibold transition-all duration-300"
                      style={{
                        fontSize: '0.9rem',
                        padding: '9px 20px',
                        background: hoveredTopic === topic
                          ? 'rgba(220,38,38,0.15)'
                          : 'rgba(20,20,20,0.8)',
                        border: hoveredTopic === topic
                          ? '1px solid rgba(220,38,38,0.5)'
                          : '1px solid rgba(42,42,42,0.6)',
                        color: hoveredTopic === topic ? '#fca5a5' : '#9ca3af',
                        boxShadow: hoveredTopic === topic
                          ? '0 0 20px rgba(220,38,38,0.15)'
                          : 'none',
                        transform: hoveredTopic === topic ? 'translateY(-2px)' : 'none',
                      }}
                    >
                      {topic}
                      <span className="ml-1.5 text-xs opacity-50">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Low tier */}
            {lowTier.length > 0 && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="red-rule" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">All Topics</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {lowTier.map(({ topic, count }) => (
                    <button
                      key={topic}
                      onClick={() => handleTopicClick(topic)}
                      onMouseEnter={() => setHoveredTopic(topic)}
                      onMouseLeave={() => setHoveredTopic(null)}
                      className="card-animate rounded-full text-sm transition-all duration-200"
                      style={{
                        padding: '7px 16px',
                        background: hoveredTopic === topic
                          ? 'rgba(220,38,38,0.1)'
                          : 'rgba(20,20,20,0.5)',
                        border: hoveredTopic === topic
                          ? '1px solid rgba(220,38,38,0.35)'
                          : '1px solid rgba(42,42,42,0.4)',
                        color: hoveredTopic === topic ? '#fca5a5' : '#6b7280',
                      }}
                    >
                      {topic}
                      <span className="ml-1.5 text-xs opacity-40">{count}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div
              className="mt-8 p-8 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(26,26,26,0.6) 100%)',
                border: '1px solid rgba(220,38,38,0.15)',
              }}
            >
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Don't see what you need?
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Use AI search to find props by describing your sermon in your own words.
              </p>
              <a
                href="/"
                className="inline-flex items-center gap-2 bg-occ-red hover:bg-occ-red-dark text-white px-8 py-3 rounded-full font-semibold text-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{display:"block"}}>
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search with AI
              </a>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
