import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tests/**/*.{test,spec}.{ts,tsx}'],
        setupFiles: ['tests/setup.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**'],
            exclude: ['src/**/*.d.ts'],
            reporter: ['text', 'lcov'],
            thresholds: {
                lines: 70,
                functions: 70,
                statements: 70,
                branches: 60,
            },
        },
    },
})
