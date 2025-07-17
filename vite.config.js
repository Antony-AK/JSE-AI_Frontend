import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'src/certs/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'src/certs/localhost.pem')),
    },
  },
  optimizeDeps: {
    include: ['latex.js', 'html2pdf.js'],
  },
  css: {
  preprocessorOptions: {
    css: {
      charset: false,
    },
  },
}

});
