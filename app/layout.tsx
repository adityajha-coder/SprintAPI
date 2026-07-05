import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Caveat } from 'next/font/google'
import './globals.css'

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
  title: 'SprintAPI — Free APIs, Tools & VSC Extensions for Developers',
  description:
    'Discover 350+ free public APIs, 200+ developer tools, VSC extensions, and Chrome extensions. Search, filter, and ship your next project faster.',
  generator: 'v0.app',
  keywords: [
    'free apis',
    'developer tools',
    'vscode extensions',
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
    title: 'SprintAPI — Curated Directory of Free Developer Resources',
    description: 'Access a curated collection of 350+ free public APIs, 200+ tools, and extensions to speed up your build workflow.',
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
    title: 'SprintAPI — Curated Directory of Free Developer Resources',
    description: 'Find 350+ free APIs, 200+ developer utilities, and browser extensions to build apps faster.',
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
              'description': 'Discover 350+ free public APIs, 200+ developer tools, VSC extensions, and Chrome extensions. Search, filter, and ship your next project faster.',
              'url': 'https://sprintapi.vercel.app',
              'keywords': 'free apis, developer tools, vscode extensions, chrome extensions, public apis, free tools',
              'creator': {
                '@type': 'Organization',
                'name': 'SprintAPI Contributors',
                'url': 'https://github.com/adityajha-coder/SprintAPI'
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
