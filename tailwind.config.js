/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './*.tsx',
    './*.ts',
    './components/**/*.{tsx,ts}',
    './pages/**/*.{tsx,ts}',
    './lib/**/*.{tsx,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Readability: darken the two mid-slate greys used for body copy site-wide
        // so paragraphs clear a 7:1 contrast on white instead of the old muted
        // ~4.5:1. Backgrounds/borders use slate-50/100/200/700/900 (untouched),
        // so this only affects text. Reserve slate-400 for small captions.
        slate: {
          400: '#94a3b8',
          500: '#475569', // body copy (was #64748b)
          600: '#334155', // emphasized body (was #475569)
        },
        // Override emerald palette to ADH brand green #1a7a3c
        // This means all existing `emerald-*` classes automatically use brand color
        emerald: {
          50:  '#e8f5ee',
          100: '#c8e6d2',
          200: '#a0d1b4',
          300: '#70b990',
          400: '#42a868',
          500: '#1a7a3c',
          600: '#1a7a3c',
          700: '#156332',
          800: '#104d27',
          900: '#0b381c',
          950: '#062110',
        },
      },
      fontFamily: {
        'plus-jakarta': ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
