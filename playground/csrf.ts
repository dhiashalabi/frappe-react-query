/** Copy the session CSRF cookie onto `window` / `<meta>` so cookieAuth can sign SPA mutations. */
export function bootstrapCsrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/)
    const encoded = match?.[1]
    if (!encoded) return

    let token: string
    try {
        token = decodeURIComponent(encoded)
    } catch {
        return
    }
    if (!token) return

    window.csrf_token = token

    let meta = document.querySelector<HTMLMetaElement>('meta[name="csrf_token"]')
    if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'csrf_token'
        document.head.appendChild(meta)
    }
    meta.content = token
}
