'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import {
  apis,
  tools,
  extensions,
  chromeExtensions,
  apiCategories,
  apiAuthTypes,
  apiPricingTypes,
  toolCategories,
  extensionCategories,
  chromeExtensionCategories,
} from '@/lib/data'
import { ApiCard, ToolCard, ExtensionCard, ChromeExtensionCard } from '@/components/resource-cards'
import { cn } from '@/lib/utils'

type Tab = 'apis' | 'tools' | 'extensions' | 'chrome-extensions'

const tabs: { id: Tab; label: string; count: number }[] = [
  { id: 'apis', label: 'APIs', count: apis.length },
  { id: 'tools', label: 'Tools', count: tools.length },
  { id: 'extensions', label: 'VSC Extensions', count: extensions.length },
  { id: 'chrome-extensions', label: 'Chrome Extensions', count: chromeExtensions.length },
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAuths, setSelectedAuths] = useState<string[]>([])
  const [selectedPricings, setSelectedPricings] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const filterPanelRef = useRef<HTMLDivElement>(null)
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const categories =
    tab === 'apis'
      ? apiCategories
      : tab === 'tools'
        ? toolCategories
        : tab === 'extensions'
          ? extensionCategories
          : chromeExtensionCategories

  const changeTab = (next: Tab) => {
    setTab(next)
    setSelectedCategories([])
    setSelectedAuths([])
    setSelectedPricings([])
    setShowAllCategories(false)
    window.history.replaceState(null, '', `#${next}`)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  // Close filter dropdown when clicking outside
  useEffect(() => {
    if (!showFilters) return
    const handleClick = (e: MouseEvent) => {
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target as Node) &&
        filterBtnRef.current &&
        !filterBtnRef.current.contains(e.target as Node)
      ) {
        setShowFilters(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showFilters])

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.replace('#', '')
      if (
        hash === 'apis' ||
        hash === 'tools' ||
        hash === 'extensions' ||
        hash === 'chrome-extensions'
      ) {
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
          (selectedCategories.length === 0 || selectedCategories.includes(a.category)) &&
          (selectedAuths.length === 0 || selectedAuths.includes(a.auth)) &&
          (selectedPricings.length === 0 || selectedPricings.includes(a.pricing)) &&
          matches(query, a.name, a.desc, a.category),
      ),
    [selectedCategories, selectedAuths, selectedPricings, query],
  )

  const filteredTools = useMemo(
    () =>
      tools.filter(
        (t) =>
          (selectedCategories.length === 0 || selectedCategories.includes(t.category)) &&
          matches(query, t.name, t.desc, t.category),
      ),
    [selectedCategories, query],
  )

  const filteredExtensions = useMemo(
    () =>
      extensions.filter(
        (e) =>
          (selectedCategories.length === 0 || selectedCategories.includes(e.category)) &&
          matches(query, e.name, e.desc, e.category, e.id),
      ),
    [selectedCategories, query],
  )

  const filteredChromeExtensions = useMemo(
    () =>
      chromeExtensions.filter(
        (e) =>
          (selectedCategories.length === 0 || selectedCategories.includes(e.category)) &&
          matches(query, e.name, e.desc, e.category, e.id),
      ),
    [selectedCategories, query],
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
        const passAuth = selectedAuths.length === 0 || selectedAuths.includes(a.auth)
        const passPricing = selectedPricings.length === 0 || selectedPricings.includes(a.pricing)
        const passCategory = selectedCategories.length === 0 || selectedCategories.includes(a.category)
        if (passAuth && passPricing) categoryCount[a.category] = (categoryCount[a.category] ?? 0) + 1
        if (passCategory && passPricing) authCount[a.auth] = (authCount[a.auth] ?? 0) + 1
        if (passCategory && passAuth) pricingCount[a.pricing] = (pricingCount[a.pricing] ?? 0) + 1
      })
    } else {
      const source =
        tab === 'tools'
          ? tools
          : tab === 'extensions'
            ? extensions
            : chromeExtensions
      source.forEach((item) => {
        const q =
          tab === 'tools'
            ? matches(query, item.name, item.desc, item.category)
            : matches(query, item.name, item.desc, item.category, (item as { id?: string }).id ?? '')
        if (q) categoryCount[item.category] = (categoryCount[item.category] ?? 0) + 1
      })
    }
    return { categoryCount, authCount, pricingCount }
  }, [tab, query, selectedCategories, selectedAuths, selectedPricings])

  const totalForCategoryAll = useMemo(
    () => Object.values(facets.categoryCount).reduce((sum, n) => sum + n, 0),
    [facets],
  )

  const resultCount =
    tab === 'apis'
      ? filteredApis.length
      : tab === 'tools'
        ? filteredTools.length
        : tab === 'extensions'
          ? filteredExtensions.length
          : filteredChromeExtensions.length

  const activeFilters =
    selectedCategories.length +
    (tab === 'apis' ? selectedAuths.length : 0) +
    (tab === 'apis' ? selectedPricings.length : 0)

  const clearAll = useCallback(() => {
    setSelectedCategories([])
    setSelectedAuths([])
    setSelectedPricings([])
    setQuery('')
  }, [])

  const visibleCategories = showAllCategories ? categories : categories.slice(0, CATEGORY_LIMIT)

  return (
    <section id="directory" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-24">
      <div aria-hidden="true" className="relative">
        <span id="apis" className="absolute -top-28" />
        <span id="tools" className="absolute -top-28" />
        <span id="extensions" className="absolute -top-28" />
        <span id="chrome-extensions" className="absolute -top-28" />
      </div>

      {/* Sticky control bar — mobile-friendly responsive row */}
      <div className="sticky top-24 z-30 -mx-4 rounded-2xl border border-border glass md:mx-0">
        <div className="flex flex-col gap-2.5 p-2 md:flex-row md:items-center md:gap-3 md:p-3">
          {/* Tabs — scrollable on mobile */}
          <div className="flex overflow-x-auto rounded-xl border border-border bg-secondary/40 p-1 scrollbar-none shrink-0 max-w-full">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => changeTab(t.id)}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors md:px-3.5',
                  tab === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
                <span
                  className={cn(
                    'hidden rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums sm:inline',
                    tab === t.id ? 'bg-primary-foreground/20' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filter Group — horizontal row filling remaining space */}
          <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${
                  tab === 'extensions'
                    ? 'VSC Extensions'
                    : tab === 'chrome-extensions'
                      ? 'Chrome Extensions'
                      : tab
                }...`}
                className="w-full rounded-xl border border-border bg-background/60 py-2 pl-9 pr-12 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                aria-label={`Search ${
                  tab === 'extensions'
                    ? 'VSC Extensions'
                    : tab === 'chrome-extensions'
                      ? 'Chrome Extensions'
                      : tab
                }`}
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden items-center rounded border border-border/80 bg-secondary/70 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:flex">
                <span>/</span>
              </div>
            </div>

            {/* Filter toggle — right side */}
            <div className="relative shrink-0">
              <button
                ref={filterBtnRef}
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                  showFilters
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground',
                )}
                aria-pressed={showFilters}
                aria-haspopup="true"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="size-4" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilters > 0 && (
                  <span className="rounded-md bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'size-3.5 transition-transform',
                    showFilters && 'rotate-180',
                  )}
                />
              </button>

              {/* Filter dropdown panel */}
              {showFilters && (
                <div
                  ref={filterPanelRef}
                  className="absolute right-0 top-full z-50 mt-2 w-[min(28rem,calc(100vw-2rem))] origin-top-right animate-in fade-in slide-in-from-top-2 rounded-2xl border border-border bg-card p-4 shadow-2xl sm:w-[32rem]"
                  role="dialog"
                  aria-label="Filter options"
                >
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Filter{' '}
                    {tab === 'extensions'
                      ? 'VSC Extensions'
                      : tab === 'chrome-extensions'
                        ? 'Chrome Extensions'
                        : tab}
                  </h3>
                  <div className="flex items-center gap-2">
                    {activeFilters > 0 && (
                      <button
                        type="button"
                        onClick={clearAll}
                        className="text-xs font-medium text-primary transition-colors hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="flex size-6 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                      aria-label="Close filters"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Category
                    </p>
                    <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto pr-1">
                      <Chip
                        active={selectedCategories.length === 0}
                        onClick={() => setSelectedCategories([])}
                        count={totalForCategoryAll}
                      >
                        All
                      </Chip>
                      {visibleCategories.map((c) => {
                        const count = facets.categoryCount[c] ?? 0
                        const isActive = selectedCategories.includes(c)
                        return (
                          <Chip
                            key={c}
                            active={isActive}
                            onClick={() =>
                              setSelectedCategories((prev) =>
                                prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                              )
                            }
                            count={count}
                            disabled={count === 0 && !isActive}
                          >
                            {c}
                          </Chip>
                        )
                      })}
                      {categories.length > CATEGORY_LIMIT && (
                        <button
                          type="button"
                          onClick={() => setShowAllCategories((v) => !v)}
                          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {showAllCategories
                            ? 'Show less'
                            : `+${categories.length - CATEGORY_LIMIT} more`}
                          <ChevronDown
                            className={cn(
                              'size-3 transition-transform',
                              showAllCategories && 'rotate-180',
                            )}
                          />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Auth & Pricing — only for APIs */}
                  {tab === 'apis' && (
                    <>
                      <div className="border-t border-border pt-3">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Auth
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <Chip
                            active={selectedAuths.length === 0}
                            onClick={() => setSelectedAuths([])}
                          >
                            All
                          </Chip>
                          {apiAuthTypes.map((a) => {
                            const count = facets.authCount[a] ?? 0
                            const isActive = selectedAuths.includes(a)
                            return (
                              <Chip
                                key={a}
                                active={isActive}
                                onClick={() =>
                                  setSelectedAuths((prev) =>
                                    prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
                                  )
                                }
                                count={count}
                                disabled={count === 0 && !isActive}
                              >
                                {a}
                              </Chip>
                            )
                          })}
                        </div>
                      </div>
                      <div className="border-t border-border pt-3">
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Pricing
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <Chip
                            active={selectedPricings.length === 0}
                            onClick={() => setSelectedPricings([])}
                          >
                            All
                          </Chip>
                          {apiPricingTypes.map((p) => {
                            const count = facets.pricingCount[p] ?? 0
                            const isActive = selectedPricings.includes(p)
                            return (
                              <Chip
                                key={p}
                                active={isActive}
                                onClick={() =>
                                  setSelectedPricings((prev) =>
                                    prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
                                  )
                                }
                                count={count}
                                disabled={count === 0 && !isActive}
                              >
                                {p}
                              </Chip>
                            )
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Active filter pills — compact row below the bar */}
        {(activeFilters > 0 || query) && (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/50 px-3 py-2 md:px-4">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Active
            </span>
            {query && (
              <ActivePill label={`"${query}"`} onRemove={() => setQuery('')} />
            )}
            {selectedCategories.map((c) => (
              <ActivePill
                key={c}
                label={c}
                onRemove={() =>
                  setSelectedCategories((prev) => prev.filter((x) => x !== c))
                }
              />
            ))}
            {tab === 'apis' &&
              selectedAuths.map((a) => (
                <ActivePill
                  key={a}
                  label={`Auth: ${a}`}
                  onRemove={() =>
                    setSelectedAuths((prev) => prev.filter((x) => x !== a))
                  }
                />
              ))}
            {tab === 'apis' &&
              selectedPricings.map((p) => (
                <ActivePill
                  key={p}
                  label={p}
                  onRemove={() =>
                    setSelectedPricings((prev) => prev.filter((x) => x !== p))
                  }
                />
              ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium text-primary transition-colors hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Result count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{resultCount}</span> of{' '}
          <span className="font-semibold text-foreground">
            {tab === 'apis'
              ? apis.length
              : tab === 'tools'
                ? tools.length
                : tab === 'extensions'
                  ? extensions.length
                  : chromeExtensions.length}
          </span>{' '}
          {tab === 'extensions'
            ? 'VSC Extensions'
            : tab === 'chrome-extensions'
              ? 'Chrome Extensions'
              : tab}
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
          {tab === 'chrome-extensions' &&
            filteredChromeExtensions.map((item) => (
              <ChromeExtensionCard key={item.id} item={item} />
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

