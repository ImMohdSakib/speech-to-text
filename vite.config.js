import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Local network ke liye server ko expose karna
    port: 3000   // Optional: Port change karne ke liye
  }
})


