module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        emerald: {
          400: '#10b981',
        },
        fuchsia: {
          400: '#d946ef',
        },
      },
      transitionProperty: {
        'opacity': 'opacity',
      },
      transitionDuration: {
        '500': '500ms',
      },
    },
  },
  plugins: [],
};