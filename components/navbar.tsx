'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const links = [
  { label: 'APIs', href: '#apis' },
  { label: 'Tools', href: '#tools' },
  { label: 'VSC Extensions', href: '#extensions' },
  { label: 'Chrome Extensions', href: '#chrome-extensions' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeLink, setActiveLink] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight active link based on intersection & hash
  useEffect(() => {
    let isDirectoryVisible = false

    const handleHashChange = () => {
      if (isDirectoryVisible) {
        setActiveLink(window.location.hash || '#apis')
      } else {
        setActiveLink(null)
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isDirectoryVisible = entry.isIntersecting
        if (entry.isIntersecting) {
          // If directory is visible, highlight current hash or default to #apis
          setActiveLink(window.location.hash || '#apis')
        } else {
          setActiveLink(null)
        }
      },
      {
        // Highlight when directory occupies at least 20% of viewport
        threshold: 0.2,
        rootMargin: '-80px 0px 0px 0px', // account for header height
      }
    )

    const directoryEl = document.getElementById('directory')
    if (directoryEl) {
      observer.observe(directoryEl)
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={cn(
          'flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border px-4 py-3 transition-all duration-300 md:px-6',
          scrolled ? 'glass shadow-lg' : 'glass',
        )}
        aria-label="Main navigation"
      >
        <a href="#top" className="flex items-center gap-2">
          <Image
            src="/fevicon.png"
            alt="SprintAPI logo"
            width={32}
            height={32}
            className="size-8 rounded-lg"
          />
          <span className="text-base font-semibold tracking-tight">
            Sprint<span className="text-primary">API</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm transition-all duration-200',
                activeLink === link.href
                  ? 'bg-secondary text-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#directory"
            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:flex"
          >
            Browse resources
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-foreground md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-border p-2 glass md:hidden">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                  activeLink === link.href
                    ? 'bg-secondary text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
