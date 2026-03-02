const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'occ-red': '#dc2626',
        'occ-red-dark': '#b91c1c',
        'occ-red-glow': 'rgba(220,38,38,0.4)',
        'occ-black': '#0a0a0a',
        'occ-charcoal': '#141414',
        'occ-surface': '#1a1a1a',
        'occ-border': '#2a2a2a',
        'occ-muted': '#3a3a3a',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite 1s',
        'float-fast': 'float 4s ease-in-out infinite 2s',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)', opacity: '0.6' },
          '33%': { transform: 'translateY(-20px) translateX(10px)', opacity: '1' },
          '66%': { transform: 'translateY(10px) translateX(-5px)', opacity: '0.4' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(220,38,38,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(220,38,38,0.6)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
module.exports = config
