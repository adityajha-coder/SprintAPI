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
  title: 'SprintAPI — Free APIs, Tools & Extensions for Developers',
  description:
    'A curated directory of free APIs, developer tools, and VS Code extensions. Search, filter, and ship faster.',
  generator: 'v0.app',
  keywords: [
    'free apis',
    'developer tools',
    'vscode extensions',
    'public apis',
    'directory',
  ],
  icons: {
    icon: '/fevicon.png',
    apple: '/fevicon.png',
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
      <body className="antialiased bg-background" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
