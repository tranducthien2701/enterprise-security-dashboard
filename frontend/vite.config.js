import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Đặt port cố định cho Frontend
    port: 3000, 
    
    // Cấu hình Proxy để tránh lỗi CORS khi gọi API REST
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Trỏ tới FastAPI Backend
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // Cấu hình để khi build ra production file sẽ gọn nhẹ hơn
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 1000
  }
})