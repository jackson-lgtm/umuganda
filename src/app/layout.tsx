import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Umuganda — Community Action',
  description: 'Connecting people who want to help with communities and individuals in need. Lisbon, Ericeira, Mafra, Sintra and surrounds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf8f5] text-[#1a1a1a] antialiased">
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold tracking-tight">Umuganda</a>
            <nav className="flex gap-4 text-sm">
              <a href="/needs" className="text-stone-600 hover:text-stone-900 transition-colors">See needs</a>
              <a href="/needs/new" className="text-stone-600 hover:text-stone-900 transition-colors">Post a need</a>
              <a href="/helpers/new" className="bg-stone-900 text-white px-3 py-1.5 rounded-md hover:bg-stone-700 transition-colors">I want to help</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-stone-200 mt-20 py-8 text-center text-sm text-stone-400">
          <p>Umuganda — Lisbon · Ericeira · Mafra · Sintra · Cascais · Setubal</p>
          <p className="mt-1">Inspired by Rwanda&apos;s tradition of community service. No religion. No obligation. Just showing up.</p>
        </footer>
      </body>
    </html>
  )
}
