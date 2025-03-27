import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Para desarrollo local
if (process.env.NODE_ENV === 'development') {
  const app = createApp(App)
  app.mount('#app')
} else {
  // Mantener la configuración existente para el build
  createApp(App).mount('#app')
}
