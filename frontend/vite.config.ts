// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Строка '/api' будет заменена на target
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        // Убираем /api из пути при перенаправлении
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
