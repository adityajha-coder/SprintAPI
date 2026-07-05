import { ArrowRight, Check, Terminal } from 'lucide-react'
import { counts } from '@/lib/data'

const stats = [
  { label: 'Free APIs', value: counts.apis },
  { label: 'Developer tools', value: counts.tools },
  { label: 'Extensions', value: counts.extensions },
]

const highlights = [
  'Curated & maintained',
  'No sign-up required',
  'Filter by category & pricing',
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full opacity-20 blur-[130px]"
        style={{ background: 'var(--primary)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground lg:mx-0">
            <span className="flex size-2 rounded-full bg-primary" aria-hidden="true" />
            The developer resource directory
          </div>

          <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Ship faster with the right{' '}
            <span className="text-primary">APIs</span>, tools &amp; extensions
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground lg:mx-0 md:text-lg">
            A hand-curated catalog of production-ready resources. Stop bookmarking
            and start building — search, filter, and integrate in minutes.
          </p>

          <ul className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-2 lg:mx-0 lg:justify-start">
            {highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="size-4 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <a
              href="#directory"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Explore the directory
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#apis"
              className="inline-flex w-full items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
            >
              Browse free APIs
            </a>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-semibold text-foreground md:text-3xl">
                  {stat.value}
                  <span className="text-primary">+</span>
                </dd>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: terminal-style visual */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl glow">
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-4 py-3">
              <span className="size-3 rounded-full bg-primary/70" aria-hidden="true" />
              <span className="size-3 rounded-full bg-muted-foreground/40" aria-hidden="true" />
              <span className="size-3 rounded-full bg-muted-foreground/25" aria-hidden="true" />
              <span className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Terminal className="size-3.5" aria-hidden="true" />
                sprintapi — zsh
              </span>
            </div>
            <div className="space-y-2 p-5 font-mono text-sm leading-relaxed">
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> find --category weather --pricing free
              </p>
              <p className="text-foreground">→ 12 APIs matched your filters</p>
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> open OpenWeatherMap
              </p>
              <p className="text-foreground">✓ docs · endpoints · auth type</p>
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> integrate
                <span className="ml-1 inline-block h-4 w-2 translate-y-0.5 bg-primary" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
