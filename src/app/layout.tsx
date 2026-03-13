import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Umuganda — Community Action',
  description: 'Connecting people who want to help with communities and individuals in need. Lisbon, Ericeira, Mafra, Sintra and surrounds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: 'var(--cream)', color: 'var(--warm-text)' }}>
        <header style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,253,247,0.92)', backdropFilter: 'blur(8px)' }} className="sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
            <a href="/" className="flex flex-col leading-none">
              <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: 'var(--forest-dark)' }}>Umuganda</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>Community Action</span>
            </a>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/needs" style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity hidden sm:inline">See needs</a>
              <a href="/needs/new" style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity hidden sm:inline">Post a need</a>
              <a href="/helpers/new" style={{ background: 'var(--forest)', color: 'white' }} className="px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                I want to help
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--forest-dark)', color: 'rgba(255,255,255,0.6)' }} className="mt-24 py-12 text-center text-sm">
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
            Umuganda
          </p>
          <p>Lisbon · Ericeira · Mafra · Sintra · Cascais · Setubal</p>
          <p className="mt-2" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
            Inspired by Rwanda&apos;s tradition of community service. No religion. No obligation. Just showing up.
          </p>
        </footer>
      </body>
    </html>
  )
}
