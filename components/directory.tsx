'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import {
  apis,
  tools,
  extensions,
  apiCategories,
  apiAuthTypes,
  apiPricingTypes,
  toolCategories,
  extensionCategories,
} from '@/lib/data'
import { ApiCard, ToolCard, ExtensionCard } from '@/components/resource-cards'
import { cn } from '@/lib/utils'

type Tab = 'apis' | 'tools' | 'extensions'

const tabs: { id: Tab; label: string; count: number }[] = [
  { id: 'apis', label: 'APIs', count: apis.length },
  { id: 'tools', label: 'Tools', count: tools.length },
  { id: 'extensions', label: 'Extensions', count: extensions.length },
]

const CATEGORY_LIMIT = 10

function Chip({
  active,
  onClick,
  children,
  count,
  disabled,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  count?: number
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all',
        active
          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
          : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/40 hover:text-foreground',
        disabled && 'cursor-not-allowed opacity-40 hover:border-border hover:text-muted-foreground',
      )}
    >
      {children}
      {typeof count === 'number' && (
        <span
          className={cn(
            'rounded-md px-1.5 text-[10px] font-semibold tabular-nums',
            active ? 'bg-primary-foreground/20' : 'bg-background/70 text-muted-foreground',
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function matches(query: string, ...fields: string[]) {
  if (!query) return true
  const q = query.toLowerCase()
  return fields.some((f) => f.toLowerCase().includes(q))
}

export function Directory() {
  const [tab, setTab] = useState<Tab>('apis')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [auth, setAuth] = useState('All')
  const [pricing, setPricing] = useState('All')
  const [showFilters, setShowFilters] = useState(true)
  const [showAllCategories, setShowAllCategories] = useState(false)

  const categories =
    tab === 'apis' ? apiCategories : tab === 'tools' ? toolCategories : extensionCategories

  const changeTab = (next: Tab) => {
    setTab(next)
    setCategory('All')
    setAuth('All')
    setPricing('All')
    setShowAllCategories(false)
  }

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'apis' || hash === 'tools' || hash === 'extensions') {
        changeTab(hash)
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [])

  const filteredApis = useMemo(
    () =>
      apis.filter(
        (a) =>
          (category === 'All' || a.category === category) &&
          (auth === 'All' || a.auth === auth) &&
          (pricing === 'All' || a.pricing === pricing) &&
          matches(query, a.name, a.desc, a.category),
      ),
    [category, auth, pricing, query],
  )

  const filteredTools = useMemo(
    () =>
      tools.filter(
        (t) =>
          (category === 'All' || t.category === category) &&
          matches(query, t.name, t.desc, t.category),
      ),
    [category, query],
  )

  const filteredExtensions = useMemo(
    () =>
      extensions.filter(
        (e) =>
          (category === 'All' || e.category === category) &&
          matches(query, e.name, e.desc, e.category, e.id),
      ),
    [category, query],
  )

  // Live faceted counts — each dimension counts against the *other* active filters + query.
  const facets = useMemo(() => {
    const categoryCount: Record<string, number> = {}
    const authCount: Record<string, number> = {}
    const pricingCount: Record<string, number> = {}

    if (tab === 'apis') {
      apis.forEach((a) => {
        const q = matches(query, a.name, a.desc, a.category)
        if (!q) return
        const passAuth = auth === 'All' || a.auth === auth
        const passPricing = pricing === 'All' || a.pricing === pricing
        const passCategory = category === 'All' || a.category === category
        if (passAuth && passPricing) categoryCount[a.category] = (categoryCount[a.category] ?? 0) + 1
        if (passCategory && passPricing) authCount[a.auth] = (authCount[a.auth] ?? 0) + 1
        if (passCategory && passAuth) pricingCount[a.pricing] = (pricingCount[a.pricing] ?? 0) + 1
      })
    } else {
      const source = tab === 'tools' ? tools : extensions
      source.forEach((item) => {
        const q =
          tab === 'tools'
            ? matches(query, item.name, item.desc, item.category)
            : matches(query, item.name, item.desc, item.category, (item as { id?: string }).id ?? '')
        if (q) categoryCount[item.category] = (categoryCount[item.category] ?? 0) + 1
      })
    }
    return { categoryCount, authCount, pricingCount }
  }, [tab, query, category, auth, pricing])

  const totalForCategoryAll = useMemo(
    () => Object.values(facets.categoryCount).reduce((sum, n) => sum + n, 0),
    [facets],
  )

  const resultCount =
    tab === 'apis'
      ? filteredApis.length
      : tab === 'tools'
        ? filteredTools.length
        : filteredExtensions.length

  const activeFilters =
    (category !== 'All' ? 1 : 0) +
    (tab === 'apis' && auth !== 'All' ? 1 : 0) +
    (tab === 'apis' && pricing !== 'All' ? 1 : 0)

  const clearAll = () => {
    setCategory('All')
    setAuth('All')
    setPricing('All')
    setQuery('')
  }

  const visibleCategories = showAllCategories ? categories : categories.slice(0, CATEGORY_LIMIT)

  return (
    <section id="directory" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-24">
      <div aria-hidden="true" className="relative">
        <span id="apis" className="absolute -top-28" />
        <span id="tools" className="absolute -top-28" />
        <span id="extensions" className="absolute -top-28" />
      </div>
      {/* Sticky control bar */}
      <div className="sticky top-24 z-30 -mx-4 rounded-2xl border border-border p-3 glass md:mx-0 md:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Tabs */}
          <div className="flex rounded-xl border border-border bg-secondary/40 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => changeTab(t.id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors md:px-4',
                  tab === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                    tab === t.id ? 'bg-primary-foreground/20' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${tab}...`}
                className="w-full rounded-xl border border-border bg-background/60 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                aria-label={`Search ${tab}`}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                'flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors',
                showFilters
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground',
              )}
              aria-pressed={showFilters}
            >
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters > 0 && (
                <span className="rounded-md bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active filter pills */}
        {(activeFilters > 0 || query) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Active
            </span>
            {query && (
              <ActivePill label={`"${query}"`} onRemove={() => setQuery('')} />
            )}
            {category !== 'All' && (
              <ActivePill label={category} onRemove={() => setCategory('All')} />
            )}
            {tab === 'apis' && auth !== 'All' && (
              <ActivePill label={`Auth: ${auth}`} onRemove={() => setAuth('All')} />
            )}
            {tab === 'apis' && pricing !== 'All' && (
              <ActivePill label={pricing} onRemove={() => setPricing('All')} />
            )}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-primary transition-colors hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="mt-3 space-y-3 border-t border-border pt-3">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Category
              </p>
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={category === 'All'}
                  onClick={() => setCategory('All')}
                  count={totalForCategoryAll}
                >
                  All
                </Chip>
                {visibleCategories.map((c) => {
                  const count = facets.categoryCount[c] ?? 0
                  return (
                    <Chip
                      key={c}
                      active={category === c}
                      onClick={() => setCategory(category === c ? 'All' : c)}
                      count={count}
                      disabled={count === 0 && category !== c}
                    >
                      {c}
                    </Chip>
                  )
                })}
                {categories.length > CATEGORY_LIMIT && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories((v) => !v)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showAllCategories
                      ? 'Show less'
                      : `+${categories.length - CATEGORY_LIMIT} more`}
                    <ChevronDown
                      className={cn(
                        'size-3.5 transition-transform',
                        showAllCategories && 'rotate-180',
                      )}
                    />
                  </button>
                )}
              </div>
            </div>

            {tab === 'apis' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Auth
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={auth === 'All'} onClick={() => setAuth('All')}>
                      All
                    </Chip>
                    {apiAuthTypes.map((a) => {
                      const count = facets.authCount[a] ?? 0
                      return (
                        <Chip
                          key={a}
                          active={auth === a}
                          onClick={() => setAuth(auth === a ? 'All' : a)}
                          count={count}
                          disabled={count === 0 && auth !== a}
                        >
                          {a}
                        </Chip>
                      )
                    })}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Pricing
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Chip active={pricing === 'All'} onClick={() => setPricing('All')}>
                      All
                    </Chip>
                    {apiPricingTypes.map((p) => {
                      const count = facets.pricingCount[p] ?? 0
                      return (
                        <Chip
                          key={p}
                          active={pricing === p}
                          onClick={() => setPricing(pricing === p ? 'All' : p)}
                          count={count}
                          disabled={count === 0 && pricing !== p}
                        >
                          {p}
                        </Chip>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{resultCount}</span> result
          {resultCount === 1 ? '' : 's'}
        </p>
      </div>

      {/* Grid */}
      {resultCount === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-lg font-medium">No matches found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search term or clear your filters.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tab === 'apis' &&
            filteredApis.map((item) => <ApiCard key={item.name} item={item} />)}
          {tab === 'tools' &&
            filteredTools.map((item) => (
              <ToolCard key={`${item.category}-${item.name}`} item={item} />
            ))}
          {tab === 'extensions' &&
            filteredExtensions.map((item) => (
              <ExtensionCard key={item.id} item={item} />
            ))}
        </div>
      )}
    </section>
  )
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 py-1 pl-3 pr-1.5 text-xs font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="flex size-4 items-center justify-center rounded-full transition-colors hover:bg-primary/20"
      >
        <X className="size-3" />
      </button>
    </span>
  )
}
