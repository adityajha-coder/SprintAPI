import { ArrowRight } from 'lucide-react'
import { counts } from '@/lib/data'

const marqueeItems = [
  'Supabase',
  'OpenRouter API',
  'Anthropic API',
  'Marvel API',
  'Telegram Bot API',
  'GitHub API',
  'NASA API',
  'OpenWeather API',
  'Spotify Web API',
  'TMDb API',
  'Hacker News API',
  'JSONPlaceholder API',
  'Dad Jokes API',
  'Poke API',
  'Telegram Bot API',
  'Harry Potter API',
  'YouTube Data API'
]

export function Hero() {
  const total = counts.apis + counts.tools + counts.extensions + counts.chromeExtensions

  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-15 blur-[130px]"
        style={{ background: 'var(--primary)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        {/* Headline */}
        <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
          The open directory of free
          <br />
          <span className="font-cursive text-primary font-normal tracking-normal text-5xl sm:text-6xl md:text-7xl">Resources</span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          SprintAPI is a hand curated, community driven catalog of{' '}
          <strong className="text-foreground font-medium">{total}+</strong>{' '}
          production ready resources. Every entry is verified for availability,
          categorized by auth type, pricing, and use case — so you spend less time
          researching and more time building.
        </p>


        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#directory"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-95 active:scale-[0.98] sm:w-auto"
          >
            Browse the directory
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href="https://github.com/adityajha-coder/SprintAPI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Contribute on GitHub
          </a>
        </div>

        {/* Infinite sliding API marquee */}
        <div className="mx-auto mt-16 max-w-xl">
          <div className="flex items-center gap-3 overflow-hidden rounded-xl border border-border/80 bg-card/30 px-3 py-2.5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary select-none shrink-0 bg-primary/10 px-2 py-0.5 rounded-md">
              Try:
            </span>
            <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_8%,white_92%,transparent)]">
              <div className="flex w-max animate-marquee gap-8 whitespace-nowrap text-xs font-medium text-muted-foreground">
                <div className="flex gap-8 shrink-0">
                  {marqueeItems.map((item, idx) => (
                    <span key={idx} className="hover:text-foreground transition-colors cursor-default">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex gap-8 shrink-0" aria-hidden="true">
                  {marqueeItems.map((item, idx) => (
                    <span key={`dup-${idx}`} className="hover:text-foreground transition-colors cursor-default">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator + secondary description */}
        <div className="mx-auto mt-14 max-w-xl border-t border-border pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            What you get
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Search and filter across categories like AI/ML, finance, weather,
            communication, and more. Each API includes auth type, CORS support,
            and pricing info. Tools and VS Code extensions are organized by
            workflow — from testing and debugging to formatting and deployment.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            SprintAPI is fully open-source. If you know a resource that should be
            listed, open a PR on{' '}
            <a
              href="https://github.com/adityajha-coder/SprintAPI"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
            >
              GitHub
            </a>{' '}
            and help fellow developers discover it.
          </p>
        </div>
      </div>
    </section>
  )
}
