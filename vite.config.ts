import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // إعداد مسارات مستعارة (Aliases) لتسهيل الاستيراد
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@styles': path.resolve(__dirname, './src/styles'),
    },
  },
  server: {
    // إعدادات خادم التطوير
    port: 3000,
    open: true, // فتح المتصفح تلقائيًا
    cors: true, // تفعيل CORS
    proxy: {
      // مثال على إعداد بروكسي لربط الواجهة الأمامية بالخلفية
      '/api': {
        target: 'http://localhost:5000', // افترض أن الخلفية تعمل على المنفذ 5000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    // إعدادات البناء للإنتاج
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // تقسيم الشفرة (Code Splitting) لتحسين الأداء
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});