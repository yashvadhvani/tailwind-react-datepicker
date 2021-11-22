/* eslint-disable import/no-extraneous-dependencies */
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        azureRadiance: {
          100: '#d1e4fc',
          200: '#a3c9fa',
          300: '#74adf7',
          400: '#4692f5',
          500: '#1877f2',
          600: '#135fc2',
          700: '#0e4791',
          800: '#0a3061',
          900: '#051830',
        },
        selago: {
          DEFAULT: '#ebf1fd',
        },
        concrete: {
          100: '#fcfcfc',
          200: '#fafafa',
          300: '#f7f7f7',
          400: '#f5f5f5',
          500: '#f2f2f2',
          600: '#c2c2c2',
          700: '#919191',
          800: '#616161',
          900: '#303030',
        },
        cyan: colors.cyan,
        fuchsia: colors.fuchsia,
        lime: colors.lime,
        orange: colors.orange,
        'light-blue': colors.sky,
        'litepie-primary': colors.emerald,
        'litepie-secondary': colors.coolGray,
      },
      opacity: {
        85: '0.85',
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  },
};
