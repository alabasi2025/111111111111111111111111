/** @type {import('tailwindcss').Config} */
module.exports = {
  // تحديد مسارات الملفات التي تحتوي على فئات Tailwind CSS
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // إعدادات الوضع الداكن (Dark Mode)
  darkMode: 'class', // أو 'media'
  
  theme: {
    // تمديد الثيم الافتراضي لإضافة تخصيصات
    extend: {
      // تخصيص الألوان
      colors: {
        'primary': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // اللون الأساسي
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        'secondary': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // لون ثانوي
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        'accent': '#f97316', // لون مميز
        'danger': '#ef4444', // لون الخطر
        'success': '#22c55e', // لون النجاح
        'warning': '#f59e0b', // لون التحذير
      },
      // تخصيص الخطوط
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // خط افتراضي حديث
        serif: ['Merriweather', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      // تخصيص التباعد (Spacing)
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // تخصيص أحجام الشاشات (Breakpoints)
      screens: {
        '3xl': '1600px',
      },
      // تخصيص الظلال (Box Shadow)
      boxShadow: {
        'custom': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  // إضافة المكونات الإضافية (Plugins)
  plugins: [
    require('@tailwindcss/forms'), // لإعادة تعيين أنماط النماذج الأساسية
    require('@tailwindcss/typography'), // لإضافة أنماط جميلة لمحتوى HTML
    require('@tailwindcss/aspect-ratio'), // لإضافة فئات لنسبة العرض إلى الارتفاع
  ],
}
