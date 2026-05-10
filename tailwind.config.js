/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: 'var(--bg-primary)',
          sidebar: 'var(--bg-secondary)',
          border: 'var(--border)',
          accent: 'var(--accent)',
          text: 'var(--text-primary)',
          'text-muted': 'var(--text-muted)',
        },
        dracula: {
          current: 'rgba(255, 255, 255, 0.05)', /* Generic subtle background for all themes */
          purple: 'var(--accent)',
          pink: 'var(--accent)',
          cyan: 'var(--callout-tech)',
          green: 'var(--callout-achievement)',
          comment: 'var(--text-muted)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
