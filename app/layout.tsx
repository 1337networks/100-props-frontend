import type { Metadata } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body>
        {/* Top accent border */}
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-occ-red z-50" />

        {/* Glassmorphism Nav */}
        <nav className="fixed top-[2px] left-0 right-0 z-40 glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/occ-logo-white.jpg"
                  alt="One Community Church"
                  className="h-9 opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-white text-lg tracking-tight">100 Props</span>
                <span className="text-[10px] text-gray-500 tracking-widest uppercase">One Community Church</span>
              </div>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="nav-link">Search</a>
              <a href="/browse" className="nav-link">Browse All</a>
              <a href="/topics" className="nav-link">Topics</a>
            </div>

            {/* Mobile Hamburger (pure CSS toggle) */}
            <label className="md:hidden flex flex-col gap-[5px] cursor-pointer group" htmlFor="mobile-menu-toggle">
              <span className="w-6 h-[2px] bg-gray-400 group-hover:bg-white transition-colors" />
              <span className="w-4 h-[2px] bg-gray-400 group-hover:bg-white transition-colors" />
              <span className="w-6 h-[2px] bg-gray-400 group-hover:bg-white transition-colors" />
            </label>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden border-t border-white/5">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Search</a>
              <a href="/browse" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Browse All</a>
              <a href="/topics" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Topics</a>
            </div>
          </div>
        </nav>

        {/* Main content with nav offset */}
        <main className="pt-[72px] relative z-10">{children}</main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-occ-border mt-24">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col items-center md:items-start gap-1">
                <span className="font-display font-bold text-white text-xl">100 Props</span>
                <span className="text-xs text-gray-600 tracking-widest uppercase">One Community Church</span>
              </div>
              <div className="flex gap-8">
                <a href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Search</a>
                <a href="/browse" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Browse All</a>
                <a href="/topics" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">Topics</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-occ-border/50 text-center">
              <p className="text-gray-600 text-sm">© 2026 One Community Church. All rights reserved.</p>
              <p className="text-gray-700 text-xs mt-2">Powered by AI · Built by 6 Levers AI</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
