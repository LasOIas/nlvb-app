import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    // This array helps Vite resolve modules without needing to specify extensions explicitly.
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
});
