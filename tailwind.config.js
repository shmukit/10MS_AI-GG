/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        anek: ['Anek Bangla', 'sans-serif'],
      },
      colors: {
        // ── Tailwind CSS-var bridge (Shadcn/ui compatibility) ──
        border:      'var(--border)',
        input:       'var(--input)',
        ring:        'var(--ring)',
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        primary: {
          DEFAULT:    'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT:    'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT:    'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT:    'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT:    'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT:    'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT:    'var(--card)',
          foreground: 'var(--card-foreground)',
        },

        // ── 10MS Design Token Palette (named utilities) ──
        // Usage: bg-10ms-primary, text-10ms-link, border-10ms-outline, etc.
        '10ms': {
          primary:         '#1CAB55', // active states, focus rings, progress
          'primary-deep':  '#17994B', // hover/pressed on primary
          container:       '#D0FAD0', // selected states, success fills, tag backgrounds
          'on-container':  '#086347', // text on container surfaces
          link:            '#149353', // text links, nav labels — darker green
          cta:             '#37C25C', // filled CTA button surfaces — lighter green
          error:           '#DC2626', // in-app errors, alerts, badges ONLY
          'alert-surface': '#FEF2F2', // background for error/warning cards
          'header-dark':   '#050B14', // mobile top bar — always dark
          surface:         '#FFFFFF',
          subtle:          '#F3F4F6', // secondary backgrounds, inactive tab containers
          tinted:          '#EAFEF2', // active states within cards, nav active tint
          'surface-blue':  '#EFF6FF', // product-tier feature sections (SuperPrep)
          inverse:         '#111827', // primary text, inverse chip backgrounds
          text:            '#111827',
          text2:           '#374151', // secondary text, subheadings
          text3:           '#6B7280', // tertiary, timestamps, captions
          'text-dis':      '#D1D5DB', // disabled text
          'icon-off':      '#CDD1D7', // nav icons inactive ONLY — not body text
          outline:         '#E5E7EB', // dividers, card borders, input borders
          'outline-v':     '#D1D5DB', // variant outline
        },

        // ── 10MS Dark Mode Surface Tokens ──
        'dark-surface': {
          base:   '#0F172A',
          card:   '#1E293B',
          subtle: '#334155',
          tinted: '#142019',
          border: '#475569',
        },
      },
      borderRadius: {
        'pill': '999px', // 10MS button & chip radius
        'sm':   '4px',
        'md':   '8px',
        'lg':   '10px',
        'xl':   '12px',
        '2xl':  '16px',
        '3xl':  '24px',
      },
      boxShadow: {
        // 10MS elevation vocabulary — flat by default, shadow only on hover/modal
        'nav':      '0 1px 3px rgba(0,0,0,0.08)',   // top nav structural
        'hover':    '0 4px 16px rgba(0,0,0,0.10)',  // card hover + translateY(-2px)
        'modal':    '0 8px 40px rgba(0,0,0,0.14)',  // modals, sheets, dropdowns
        'tab-bar':  '0 -4px 20px rgba(0,0,0,0.05)',// mobile bottom nav (upward)
        'btn-hover':'0 4px 16px rgba(0,0,0,0.12)',  // primary button hover
      },
      maxWidth: {
        'content': '1200px', // 10MS desktop max content width
      },
      spacing: {
        // 10MS spacing tokens
        'xs':  '6px',
        'sm2': '14px',
      },
      transitionDuration: {
        '180': '180ms',
      },
    },
  },
  plugins: [],
};
