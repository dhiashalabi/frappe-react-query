import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig, type ProxyOptions } from 'vite'

const frappeSite = 'frappe16.localhost'
const frappeUrl = 'http://127.0.0.1:8001'
const frappeSocket = 'http://127.0.0.1:9001'

function setFrappeSiteHeaders(proxyReq: { setHeader: (name: string, value: string) => void }) {
    proxyReq.setHeader('Host', frappeSite)
    proxyReq.setHeader('X-Frappe-Site-Name', frappeSite)
}

function frappeProxy(target: string): ProxyOptions {
    return {
        target,
        changeOrigin: true,
        ws: true,
        configure: (proxy) => {
            proxy.on('proxyReq', setFrappeSiteHeaders)
            proxy.on('proxyReqWs', setFrappeSiteHeaders)
        },
    }
}

export default defineConfig({
    root: resolve(import.meta.dirname, 'playground'),
    publicDir: resolve(import.meta.dirname, 'public'),
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': resolve(import.meta.dirname, 'playground'),
            'frappe-react-query': resolve(import.meta.dirname, 'src/index.ts'),
            'frappe-react-query/extended': resolve(import.meta.dirname, 'src/extended.ts'),
            'frappe-react-query/realtime': resolve(import.meta.dirname, 'src/realtime.ts'),
            'frappe-js-client/realtime': resolve(import.meta.dirname, '../frappe-js-client/packages/client/src/realtime.ts'),
            'frappe-js-client/extended': resolve(import.meta.dirname, '../frappe-js-client/packages/client/src/extended.ts'),
            'frappe-js-client': resolve(import.meta.dirname, '../frappe-js-client/packages/client/src/index.ts'),
        },
    },
    optimizeDeps: {
        exclude: ['frappe-js-client'],
    },
    server: {
        proxy: {
            '/api': frappeProxy(frappeUrl),
            '/socket.io': frappeProxy(frappeSocket),
        },
    },
})
