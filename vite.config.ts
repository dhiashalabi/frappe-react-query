import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.tsx'),
            name: 'Frappe React Query',
            fileName: (format) => `frappe-react-query.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
    },
    plugins: [
        dts({
            insertTypesEntry: true,
        }),
        react(),
    ],
})
