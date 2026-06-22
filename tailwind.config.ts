import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        naranja: {
          DEFAULT: '#C4532A',
          papaya: '#E8754A',
          soft: '#FAE8DF',
        },
        selva: {
          DEFAULT: '#2A5240',
          menta: '#C8DDB8',
          soft: '#D2E8D8',
        },
        linho: '#F5F0E8',
        noche: '#1A2E20',
        muted: '#7A7A6E',
        rule: '#E4DDD4',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Jost', 'sans-serif'],
      },
      borderRadius: {
        pill: '40px',
        badge: '20px',
        card: '12px',
      },
      letterSpacing: {
        ui: '3px',
        btn: '2.5px',
        badge: '1.5px',
        wordmark: '5px',
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
