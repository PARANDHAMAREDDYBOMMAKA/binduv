/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8b5cf6',
        'primary-dark': '#7c3aed',
        secondary: '#ec4899',
        accent: '#06b6d4',
        background: '#000011',
        surface: 'rgba(255, 255, 255, 0.05)',
        'surface-light': 'rgba(255, 255, 255, 0.1)',
        'surface-lighter': 'rgba(255, 255, 255, 0.15)',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-light': 'rgba(255, 255, 255, 0.12)',
        'text-primary': '#ffffff',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
        'ocean-gradient': 'linear-gradient(180deg, #000011 0%, #000033 50%, #000055 100%)',
        'noise': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
      },
      animation: {
        'gradient-shift': 'gradient-shift 6s ease-in-out infinite',
        'ocean-primary': 'ocean-primary 8s ease-in-out infinite',
        'ocean-shimmer': 'ocean-shimmer 6s ease-in-out infinite',
        'wave': 'wave 4s ease-in-out infinite',
        'ripple': 'ripple 2s ease-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'ocean-primary': {
          '0%, 100%': {
            'background-position': '0% 50%',
            'box-shadow': '0 8px 32px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
          },
          '50%': {
            'background-position': '100% 50%',
            'box-shadow': '0 12px 40px rgba(6, 182, 212, 0.6), 0 0 30px rgba(139, 92, 246, 0.3)',
          },
        },
        'ocean-shimmer': {
          '0%, 100%': { left: '-100%', opacity: '0' },
          '50%': { left: '100%', opacity: '1' },
        },
        'wave': {
          '0%, 100%': {
            transform: 'translateX(0%)',
            opacity: '0.5',
          },
          '50%': {
            transform: 'translateX(-50%)',
            opacity: '1',
          },
        },
        'ripple': {
          '0%': {
            transform: 'scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(4)',
            opacity: '0',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      fontSize: {
        'hero': 'clamp(3rem, 8vw, 6rem)',
        'large': 'clamp(2rem, 6vw, 3.5rem)',
        'headline': 'clamp(1.5rem, 4vw, 2rem)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'ocean': '0 8px 32px rgba(6, 182, 212, 0.2), 0 0 20px rgba(139, 92, 246, 0.1)',
        'ocean-lg': '0 16px 64px rgba(6, 182, 212, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      transitionTimingFunction: {
        'ocean': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    function({ addUtilities, theme, addComponents }: { addUtilities: any, theme: any, addComponents: any }) {
      // Glass morphism utilities
      addUtilities({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.03)',
          'backdrop-filter': 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          'box-shadow': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        '.glass-strong': {
          background: 'rgba(255, 255, 255, 0.08)',
          'backdrop-filter': 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          'box-shadow': '0 16px 64px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 0 20px rgba(6, 182, 212, 0.1)',
        },
        '.glass-subtle': {
          background: 'rgba(255, 255, 255, 0.02)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 10px rgba(6, 182, 212, 0.05)',
        },
        '.transform-gpu': {
          transform: 'translateZ(0)',
          'backface-visibility': 'hidden',
          perspective: '1000px',
        },
        '.text-gradient': {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #ec4899 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
          'background-size': '200% 100%',
        },
        '.bg-noise': {
          'background-image': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.05\"/%3E%3C/svg%3E')",
        },
      })

      // Button components
      addComponents({
        '.btn': {
          display: 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          padding: '0.75rem 2rem',
          'border-radius': '9999px',
          'font-size': '1rem',
          'font-weight': '500',
          'line-height': '1.5',
          'text-decoration': 'none',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'white-space': 'nowrap',
          'min-height': '3rem',
          position: 'relative',
          overflow: 'hidden',
          'backdrop-filter': 'blur(20px)',
          transform: 'translateZ(0)',
          'will-change': 'transform, opacity',
          'background-size': '200% 100%',
        },
        '.btn-primary': {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 50%, #ec4899 100%)',
          color: 'white',
          'box-shadow': '0 8px 32px rgba(139, 92, 246, 0.4), 0 0 20px rgba(6, 182, 212, 0.2)',
          'background-size': '200% 100%',
          '&:hover': {
            transform: 'translateY(-2px) translateZ(0)',
            'box-shadow': '0 16px 48px rgba(139, 92, 246, 0.6), 0 0 40px rgba(6, 182, 212, 0.4)',
          },
        },
        '.btn-secondary': {
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          'backdrop-filter': 'blur(20px)',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            'border-color': 'rgba(6, 182, 212, 0.3)',
            transform: 'translateY(-1px) translateZ(0)',
            'box-shadow': '0 8px 32px rgba(6, 182, 212, 0.2)',
          },
        },
        '.btn-ghost': {
          background: 'transparent',
          color: '#a1a1aa',
          border: '1px solid transparent',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff',
            'border-color': 'rgba(255, 255, 255, 0.12)',
          },
        },
        '.btn-large': {
          padding: '1rem 2.5rem',
          'font-size': '1.125rem',
          'font-weight': '500',
          'min-height': '3.5rem',
        },
      })
    },
  ],
}