/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        12.5: '50px'
      },
      colors: {
        primary: '#0655E3',
        secondary: '#F0F6FF',
        danger: '#FF5454',
        warning: '#FFC107',
        borderGray: '#E1E1E1',
        darkBlue: '#2470F9',
        lightBlue: '#F0F6FF',
        lightBlue2: '#E0EBFF',
        darkPink: '#C24278',
        lightPink: '#FFF0F6',
        darkGreen: '#0E7C68',
        lightGreen: '#EFFFFC',
        darkOrange: '#F35D38',
        lightOrange: '#FFF6F3',
        dark: '#292929'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' }
        }
      },
      animation: {
        marquee: 'marquee 10s linear infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        fadeOut: 'fadeOut 0.3s ease-in'
      }
    }
  },
  plugins: []
}
