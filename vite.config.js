import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/App.vue',
      name: 'VueChatWidget',
      fileName: (format) => `vue-chat-widget.${format}.js`
    },
    rollupOptions: {
      output: {
        // Asegúrate de que los estilos se extraigan correctamente
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'vue-chat-widget.css';
          return assetInfo.name;
        },
      }
    },
    cssCodeSplit: false
  }
})
