import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: process.env.VITE_BASE || '/edunem/',
  resolve: {
    alias: {
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, 'src/lib/codegenNativeComponentMock.js'),
      'react-native': path.resolve(__dirname, 'src/lib/reactNativeWebWrapper.js')
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'EduApp - Control Escolar Inteligente',
        short_name: 'EduApp',
        description: 'Plataforma mobile-first para docentes',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Las rutas de API NUNCA deben ser cacheadas por el SW.
        // Sin esto el SW devuelve 200 falso en modo offline y db.js
        // nunca detecta que no hay red -> el item queda SYNCED inmediatamente.
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.includes('/api/') || url.pathname.endsWith('/health'),
            handler: 'NetworkOnly',
          },
        ],
        navigateFallbackDenylist: [/\/api\//],
      },
    })
  ],
})
