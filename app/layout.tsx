import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Caveat } from 'next/font/google'
import { counts } from '@/lib/data'
import './globals.css'

const apisCount = Math.floor(counts.apis / 10) * 10
const toolsCount = Math.floor(counts.tools / 10) * 10

const baseDescription = `Discover ${apisCount}+ free public APIs, ${toolsCount}+ developer tools, VSC extensions, and Chrome extensions. Search, filter, and ship your next project faster.`
const ogDescription = `Access a curated collection of ${apisCount}+ free public APIs, ${toolsCount}+ tools, and extensions to speed up your build workflow.`
const twitterDescription = `Find ${apisCount}+ free APIs, ${toolsCount}+ developer utilities, and browser extensions to build apps faster.`

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-cursive',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sprintapi.vercel.app'),
  title: 'SprintAPI | All Resources in One Place',
  description: baseDescription,
  keywords: [
    'free apis',
    'developer tools',
    'vscode extensions',
    'Useful Tools',
    'Productivity Tools',
    'Free LLMs',
    'chrome extensions',
    'public apis',
    'free developer resources',
    'open source catalog',
  ],
  icons: {
    icon: '/fevicon.png',
    apple: '/fevicon.png',
  },
  openGraph: {
    title: 'SprintAPI | Curated Directory of Free Developer Resources',
    description: ogDescription,
    url: 'https://sprintapi.vercel.app',
    siteName: 'SprintAPI',
    images: [
      {
        url: '/fevicon.png',
        width: 512,
        height: 512,
        alt: 'SprintAPI Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SprintAPI | Curated Directory of Free Developer Resources',
    description: twitterDescription,
    images: ['/fevicon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'DataCatalog',
              'name': 'SprintAPI',
              'description': baseDescription,
              'url': 'https://sprintapi.vercel.app',
              'keywords': 'free apis, developer tools, vscode extensions, chrome extensions, public apis, free tools',
              'creator': {
                '@type': 'Person',
                'name': 'Aditya Jha',
                'url': 'https://github.com/adityajha-coder'
              }
            })
          }}
        />
      </head>
      <body className="antialiased bg-background" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
