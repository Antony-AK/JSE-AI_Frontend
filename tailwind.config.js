/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-out': 'fadeInOut 2.5s ease-in-out',
        'toast-in': 'toastIn 0.4s ease-out forwards, toastOut 0.4s ease-in 1.5s forwards',
        'progress': 'progressBar 1.5s linear forwards',
        'scan': 'scan 2s linear infinite',
        typewriter: 'typewriter 2s steps(30) forwards',
        blink: 'blink 0.7s step-end infinite',
        shake: 'shake 0.4s ease-in-out',
        'typewriter-delay-1': 'typewriter 2s steps(30) forwards 0.3s',
        'typewriter-delay-2': 'typewriter 2s steps(30) forwards 1.2s',
        'typewriter-delay-3': 'typewriter 2s steps(30) forwards 2.1s',
        'typewriter-delay-4': 'typewriter 2s steps(30) forwards 3s',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '10%, 90%': { opacity: 1 },
        },
        toastIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        toastOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        progressBar: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
        scan: {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        typing: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 100%': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' },
        },
        shake: {
          '0%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-4px)' },
          '40%': { transform: 'translateX(4px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
          '100%': { transform: 'translateX(0)' },
        },
        spacing: {
          a4w: '794px',
          a4h: '1123px',
        }
      },
    },
  },
  plugins: [],
}