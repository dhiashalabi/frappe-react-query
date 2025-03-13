import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/lib/index.tsx'),
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', '@tanstack/react-query', 'socket.io-client'],
        },
    },
    plugins: [
        dts({
            include: ['src/lib'],
            outDir: 'dist',
        }),
        react(),
    ],
})
