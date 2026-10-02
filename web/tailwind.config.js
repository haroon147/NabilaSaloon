/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:      '#C9967F',
        'primary-lt': '#E8C4B0',
        'primary-dk': '#8B5E52',
        rose:         '#F5EBE6',
        bg:           '#FDF8F6',
        surface:      '#FFFFFF',
        tx1:          '#2D2D2D',
        tx2:          '#757575',
        hint:         '#B0ACA8',
        border:       '#E8E0DB',
        success:      '#388E3C',
        warning:      '#F57C00',
        danger:       '#D32F2F',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:       '0 4px 24px -4px rgba(201,150,127,0.18), 0 1px 6px rgba(0,0,0,0.04)',
        'card-hover':'0 12px 40px -6px rgba(201,150,127,0.28), 0 4px 12px rgba(0,0,0,0.07)',
        soft:       '0 2px 16px rgba(201,150,127,0.14)',
        glow:       '0 0 40px rgba(201,150,127,0.35)',
        inner:      'inset 0 2px 8px rgba(201,150,127,0.12)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero':   'linear-gradient(135deg, #C9967F 0%, #8B5E52 100%)',
        'gradient-card':   'linear-gradient(135deg, rgba(201,150,127,0.22) 0%, #F5EBE6 100%)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        float:       'float 3s ease-in-out infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
