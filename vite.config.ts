import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import TailwindCss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlusResolver from 'unplugin-element-plus/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
      TailwindCss(),
      // AutoImport({
      //   resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'audio-visual': fileURLToPath(new URL('./src/plugins/audio-visual', import.meta.url)),
    },
  },
  worker: {
    // This is crucial for `transformers.js` as it uses ES modules for its workers.
    format: 'es',
  },
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "'@huggingface/transformers'"],
    // Include `@xenova/transformers` in `optimizeDeps` to ensure it's pre-bundled
    // and avoids potential issues with CJS/ESM interop during development.
    // exclude: ['@huggingface/transformers'] // Prevent optimization of transformers.js
  },
  build: {
    rollupOptions: {
      external: [], // Ensure axios is not externalized
    },
    target: 'esnext'
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // https: false,
    // hotOnly: true,
    // disableHostCheck: true,
    hot: true,
    open: false,
    proxy: {
      '/qa_zocket_com': {
        target: 'https://prod.zocket.com/',//prod.zocket.com
        changeOrigin: true,
        secure: true,
        rewrite: (path) => {
          const newPath = path.replace(/^\/qa_zocket_com/, '');
          console.log(path, newPath);
          return newPath
        },
      },
    },
  },
})

