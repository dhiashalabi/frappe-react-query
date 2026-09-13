import { existsSync } from 'node:fs'

const files = [
    'dist/index.js',
    'dist/index.mjs',
    'dist/index.d.ts',
    'dist/extended.js',
    'dist/extended.mjs',
    'dist/realtime.js',
    'dist/realtime.mjs',
]

const missing = files.filter((file) => !existsSync(file))
if (missing.length) {
    console.error(`verify-dist: missing ${missing.join(', ')}`)
    process.exit(1)
}

console.log('verify-dist: ok')
