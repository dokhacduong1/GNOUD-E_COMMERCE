/** @type {import('tailwindcss').Config} */
// @font-face{
//   font-family: 'Hiragino Kaku Gothic Pro';
//   src: url('./fonts/HiraginoKakuGothicProN-W3.otf');
//   font-weight: normal;
//   font-style: normal;
// }

module.exports = {
  purge: {
    content: ["./views/**/*.pug"],
    options: {
      safelist: [],
    },
  },

  theme: {
    extend: {
      fontFamily: {
        Hiragino:  ['"Hiragino Kaku Gothic Pro"','Arial','sans-serif'],
        Roboto: ['Roboto'],
       Aria:['Arial','sans-serif'],
      },
      backgroundImage: theme => ({
        'arrow-button-sw': "url('/images/arrow-sw.svg')",
      }),
      colors: {
        "main": {
          DEFAULT: '#3C3C43',
          50: '#8C8C93', // 50% lighter
          100: '#7C7C83', // 40% lighter
          200: '#6C6C73', // 30% lighter
          300: '#5C5C63', // 20% lighter
          400: '#4C4C53', // 10% lighter
          500: '#3C3C43', // base color
          600: '#323237', // 10% darker
          700: '#29292E', // 20% darker
          800: '#202025', // 30% darker
          900: '#17171C', // 40% darker
          950: '#0E0E13', // 50% darker
        }
      },
      keyframes: {
        modalSlideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        modalSlideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(50%)' }
        },
        modalShow: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 }
        },
      },
      animation: {
        modalSlideIn: 'modalSlideIn 0.2s ease-in-out',
        modalSlideOut: 'modalSlideOut 0.5s ease-in-out',
        modalShow: 'modalShow 0.5s ease-in-out'
      }
    },
    screens: {
      'xxs': '320px', // Extra extra small devices (phones, less than 320px)
      'xs-1':'390px',
      'xs': '480px', // Extra small devices (portrait phones, less than 576px)
      'sm': '576px', // Small devices (landscape phones, 576px and up)
      'md': '768px', // Medium devices (tablets, 768px and up)
      'md-1': '800px',
      'lg': '992px', // Large devices (desktops, 992px and up)
      'xl': '1280px', // Extra large devices (large desktops, 1200px and up)
      '2xl': '1536px', // 2 Extra large devices (larger desktops, 1536px and up)
    },
  },
  plugins: [],
}

