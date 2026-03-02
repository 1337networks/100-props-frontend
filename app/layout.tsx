import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import ThemeToggle from '../components/ThemeToggle'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '100 Props | One Community Church',
  description: 'AI-powered sermon prop discovery tool. Find the perfect prop for your message.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      {/* Inline script: apply saved theme BEFORE paint to avoid flash */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
        {/* OCC Red top accent bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] z-50" style={{ background: '#dc2626' }} />

        {/* Nav */}
        <nav className="glass-nav fixed top-[2px] left-0 right-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              {/* Light mode logo */}
              <img
                src="/occ-logo-light.jpg"
                alt="One Community Church"
                className="h-9 w-auto object-contain block dark:hidden"
              />
              {/* Dark mode logo */}
              <img
                src="/occ-logo-white.jpg"
                alt="One Community Church"
                className="h-9 w-auto object-contain hidden dark:block"
              />
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-lg tracking-tight" style={{ color: 'var(--text)' }}>
                  100 Props
                </span>
                <span className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>
                  One Community Church
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/"
                className="text-sm font-medium transition-colors duration-200 hover:text-red-600"
                style={{ color: 'var(--text-muted)' }}>
                Search
              </a>
              <a href="/browse"
                className="text-sm font-medium transition-colors duration-200 hover:text-red-600"
                style={{ color: 'var(--text-muted)' }}>
                Browse All
              </a>
              <a href="/topics"
                className="text-sm font-medium transition-colors duration-200 hover:text-red-600"
                style={{ color: 'var(--text-muted)' }}>
                Topics
              </a>
              <ThemeToggle />
            </div>

            {/* Mobile: toggle + hamburger */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <div className="flex flex-col gap-[5px] cursor-pointer">
                <span className="w-6 h-[2px] rounded" style={{ background: 'var(--text-muted)' }} />
                <span className="w-4 h-[2px] rounded" style={{ background: 'var(--text-muted)' }} />
                <span className="w-6 h-[2px] rounded" style={{ background: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="/" className="text-sm font-medium transition-colors hover:text-red-600" style={{ color: 'var(--text-muted)' }}>Search</a>
              <a href="/browse" className="text-sm font-medium transition-colors hover:text-red-600" style={{ color: 'var(--text-muted)' }}>Browse All</a>
              <a href="/topics" className="text-sm font-medium transition-colors hover:text-red-600" style={{ color: 'var(--text-muted)' }}>Topics</a>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main className="pt-[72px] relative">{children}</main>

        {/* Footer */}
        <footer className="border-t mt-24" style={{ borderColor: 'var(--border)' }}>
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>100 Props</span>
                <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-faint)' }}>One Community Church</span>
              </div>
              <div className="flex gap-8">
                <a href="/" className="text-sm transition-colors hover:text-red-600" style={{ color: 'var(--text-faint)' }}>Search</a>
                <a href="/browse" className="text-sm transition-colors hover:text-red-600" style={{ color: 'var(--text-faint)' }}>Browse All</a>
                <a href="/topics" className="text-sm transition-colors hover:text-red-600" style={{ color: 'var(--text-faint)' }}>Topics</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center" style={{ borderColor: 'var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>© 2026 One Community Church. All rights reserved.</p>
              <a href="https://www.6leversconsulting.com" target="_blank" rel="noopener noreferrer"
                className="text-xs mt-2 block transition-colors hover:text-red-600"
                style={{ color: 'var(--text-faint)', opacity: 0.6 }}>
                Powered by AI · Built by 6 Levers AI
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
