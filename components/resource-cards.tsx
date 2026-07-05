'use client'

import { ArrowUpRight, Copy, Check, KeyRound, Puzzle } from 'lucide-react'
import { useState } from 'react'
import type { ApiEntry, ToolEntry, ExtensionEntry } from '@/lib/data'
import { cn } from '@/lib/utils'

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

function Favicon({ url, name }: { url: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const domain = hostname(url)
  if (failed) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-sm font-semibold text-primary">
        {name.charAt(0)}
      </span>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-10 shrink-0 rounded-xl border border-border bg-secondary p-1.5"
    />
  )
}

function getVSCodeIconUrl(id: string) {
  const parts = id.split('.')
  if (parts.length < 2) return ''
  const publisher = parts[0]
  const extName = parts.slice(1).join('.')
  return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/extensions/${extName}/latest/assetbyname/Microsoft.VisualStudio.Services.Icons.Default`
}

function VSCodeExtensionIcon({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const url = getVSCodeIconUrl(id)

  if (failed || !url) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
        <Puzzle className="size-5" aria-hidden="true" />
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-10 shrink-0 rounded-xl border border-border bg-secondary p-1.5 object-contain"
    />
  )
}

function ChromeExtensionIcon({ id, name }: { id: string; name: string }) {
  const [failed, setFailed] = useState(false)
  const url = `https://chrome.google.com/webstore/detail/${id}/images/icon/128`

  if (failed) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary">
        <Puzzle className="size-5" aria-hidden="true" />
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-10 shrink-0 rounded-xl border border-border bg-secondary p-1 object-contain"
    />
  )
}

const pricingStyles: Record<string, string> = {
  Free: 'border-chart-2/40 bg-chart-2/10 text-chart-2',
  Freemium: 'border-primary/40 bg-primary/10 text-primary',
  Paid: 'border-chart-5/40 bg-chart-5/10 text-chart-5',
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  )
}

const cardBase =
  'group relative flex h-full flex-col rounded-2xl border border-border bg-card/60 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 glass-card'

export function ApiCard({ item }: { item: ApiEntry }) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className={cardBase}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Favicon url={item.url} name={item.name} />
          <div>
            <h3 className="font-semibold leading-tight">{item.name}</h3>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </div>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.desc}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className={pricingStyles[item.pricing] ?? ''}>{item.pricing}</Badge>
        <Badge>
          <KeyRound className="size-3" aria-hidden="true" />
          {item.auth === 'None' ? 'No key' : item.auth}
        </Badge>
      </div>
    </a>
  )
}

export function ToolCard({ item }: { item: ToolEntry }) {
  return (
    <a href={item.url} target="_blank" rel="noreferrer" className={cardBase}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Favicon url={item.url} name={item.name} />
          <div>
            <h3 className="font-semibold leading-tight">{item.name}</h3>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </div>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.desc}
      </p>
      <div className="mt-4">
        <Badge className="border-primary/30 bg-primary/10 text-primary">
          {hostname(item.url)}
        </Badge>
      </div>
    </a>
  )
}

export function ExtensionCard({ item }: { item: ExtensionEntry }) {
  const [copied, setCopied] = useState(false)
  const marketplace = `https://marketplace.visualstudio.com/items?itemName=${item.id}`

  const copyId = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(`ext install ${item.id}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <a href={marketplace} target="_blank" rel="noreferrer" className={cardBase}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <VSCodeExtensionIcon id={item.id} name={item.name} />
          <div>
            <h3 className="font-semibold leading-tight">{item.name}</h3>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </div>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.desc}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <code className="truncate rounded-lg border border-border bg-background/60 px-2 py-1 font-mono text-xs text-muted-foreground">
          {item.id}
        </code>
        <button
          type="button"
          onClick={copyId}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-secondary/60 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          aria-label={`Copy install command for ${item.name}`}
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-chart-2" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" /> Install
            </>
          )}
        </button>
      </div>
    </a>
  )
}

export function ChromeExtensionCard({ item }: { item: ExtensionEntry }) {
  const storeUrl = `https://chromewebstore.google.com/detail/${item.id}`

  return (
    <a href={storeUrl} target="_blank" rel="noreferrer" className={cardBase}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ChromeExtensionIcon id={item.id} name={item.name} />
          <div>
            <h3 className="font-semibold leading-tight">{item.name}</h3>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </div>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.desc}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-1 text-[10px] font-semibold text-primary">
          Chrome Web Store
        </span>
        <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
          Add to Chrome
        </span>
      </div>
    </a>
  )
}

