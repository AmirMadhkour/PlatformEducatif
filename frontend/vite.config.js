import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// L'appel au backend passe desormais par VITE_API_URL (voir src/services/api.js
// et .env.example), avec CORS active cote Spring Security (cors.allowed-origins).
// Ce proxy n'est plus le mecanisme principal, garde uniquement comme filet de
// securite si jamais un appel relatif "/api/..." etait fait sans .env charge.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
