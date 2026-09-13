import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        extended: 'src/extended.ts',
        realtime: 'src/realtime.ts',
    },
    format: ['cjs', 'esm'],
    dts: {
        compilerOptions: {
            ignoreDeprecations: '6.0',
        },
    },
    sourcemap: true,
    clean: true,
    splitting: true,
    treeshake: true,
    target: 'es2022',
    platform: 'browser',
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.js' : '.mjs' }
    },
    external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@tanstack/react-query',
        'frappe-js-client',
        'frappe-js-client/extended',
        'frappe-js-client/realtime',
        'socket.io-client',
    ],
})
