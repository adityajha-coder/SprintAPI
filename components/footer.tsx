import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">
            Sprint<span className="text-primary">API</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          A curated directory of free APIs, tools &amp; extensions for builders.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for developers &middot; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
