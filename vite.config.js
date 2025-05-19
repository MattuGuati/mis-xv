import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/mis-xv/", // 👈 el nombre del repo
  plugins: [react()],
});
