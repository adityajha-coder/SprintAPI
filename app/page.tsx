import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { Directory } from '@/components/directory'
import { Footer } from '@/components/footer'
import { ScrollToTop } from '@/components/scroll-to-top'

export default function Page() {
  return (
    <main id="top" className="min-h-dvh">
      <Navbar />
      <Hero />
      <Directory />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
