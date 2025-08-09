/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000', // Pure black
        'secondary': '#404040', // Dark gray
        'accent': '#C0C0C0', // Silver accent
        'background': '#FFFFFF', // Pure white
        'surface': '#F8F8F8', // Light gray surface
        'text-primary': '#000000', // Black text
        'text-secondary': '#666666', // Medium gray text
        'success': '#000000', // Black for consistency
        'warning': '#666666', // Gray for warnings
        'error': '#000000', // Black for errors
        'border': '#E0E0E0', // Light gray borders
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Source Sans Pro', 'sans-serif'],
        'caption': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'minimal': '4px',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'elevation': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      scale: {
        '102': '1.02',
      },
      zIndex: {
        'background-typography': '0',
        'base': '1',
        'content': '10',
        'card': '15',
        'modal': '40',
        'header': '50',
        'overlay': '60',
        'tooltip': '70',
        'notification': '80',
        'cursor': '9999',
        '100': '100',
        '200': '200',
        '300': '300',
      },
    },
  },
  plugins: [],
}