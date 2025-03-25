import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    // Optional: Add extensions so you don't always need to specify them
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
});
