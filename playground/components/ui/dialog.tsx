import type { ReactNode } from 'react'

import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils'

export function Dialog({
    open,
    onOpenChange,
    title,
    description,
    children,
    className,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description?: string
    children: ReactNode
    className?: string
}) {
    useEffect(() => {
        if (!open) return
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onOpenChange(false)
        }
        window.addEventListener('keydown', onKeyDown)
        return () => window.removeEventListener('keydown', onKeyDown)
    }, [open, onOpenChange])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
        >
            <button
                type="button"
                aria-label="Close dialog"
                className="absolute inset-0 bg-black/50"
                onClick={() => onOpenChange(false)}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                className={cn(
                    'relative z-10 w-full max-w-lg rounded-xl bg-card p-6 text-card-foreground shadow-lg ring-1 ring-foreground/10',
                    className,
                )}
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="dialog-title"
                            className="font-heading text-base font-medium"
                        >
                            {title}
                        </h2>
                        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onOpenChange(false)}
                    >
                        ×
                    </Button>
                </div>
                {children}
            </div>
        </div>
    )
}
