'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    // Default: light mode unless user explicitly chose dark
    if (stored === 'dark') {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  // Avoid hydration mismatch
  if (!mounted) return <div className="w-14 h-7" />

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative inline-flex items-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
      style={{
        background: dark
          ? 'linear-gradient(135deg, #1e1b4b, #312e81)'
          : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        boxShadow: dark
          ? '0 0 12px rgba(99,102,241,0.4), inset 0 1px 2px rgba(0,0,0,0.3)'
          : '0 0 12px rgba(251,191,36,0.5), inset 0 1px 2px rgba(0,0,0,0.1)',
      }}
    >
      {/* Track icons */}
      <span
        className="absolute left-1.5 text-[10px] transition-opacity duration-300"
        style={{ opacity: dark ? 0 : 1 }}
        aria-hidden="true"
      >
        ☀️
      </span>
      <span
        className="absolute right-1.5 text-[10px] transition-opacity duration-300"
        style={{ opacity: dark ? 1 : 0 }}
        aria-hidden="true"
      >
        🌙
      </span>

      {/* Thumb */}
      <span
        className="absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center"
        style={{
          left: dark ? 'calc(100% - 1.625rem)' : '0.125rem',
          background: dark ? '#e0e7ff' : '#fffbeb',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      >
        <span className="text-[11px] leading-none" aria-hidden="true">
          {dark ? '🌙' : '☀️'}
        </span>
      </span>
    </button>
  )
}
