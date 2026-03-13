import type { Metadata } from 'next'
import './globals.css'
import { getUser } from '@/lib/auth'
import { logout } from '@/app/actions/auth'

export const metadata: Metadata = {
  title: 'Umuganda — Community Action',
  description: 'Connecting people who want to help with communities and individuals in need. Lisbon, Ericeira, Mafra, Sintra and surrounds.',
  icons: { icon: '/logo.svg' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? null

  return (
    <html lang="en">
      <body className="min-h-screen antialiased" style={{ background: 'var(--cream)', color: 'var(--warm-text)' }}>
        <header className="sticky top-0 z-50" style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,253,247,0.95)' }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 leading-none">
              <img src="/logo.svg" alt="" width={36} height={36} style={{ flexShrink: 0 }} />
              <div className="flex flex-col">
                <span style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: '1.15rem', fontWeight: 400, color: 'var(--forest-dark)' }}>Umuganda</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>Community Action</span>
              </div>
            </a>
            <nav className="flex items-center gap-2 sm:gap-3 text-sm">
              <a href="/needs" style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity hidden sm:inline">See needs</a>
              <a href="/needs/new" style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity hidden sm:inline">Post a need</a>

              {user ? (
                <>
                  <a href="/profile" style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity hidden sm:inline">
                    {firstName}
                  </a>
                  <form action={logout} style={{ display: 'inline' }}>
                    <button type="submit" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.8rem', color: 'var(--muted)', cursor: 'pointer' }}
                      className="hover:opacity-70 transition-opacity hidden sm:inline-block">
                      Sign out
                    </button>
                  </form>
                  <a href="/profile" style={{ background: 'var(--forest)', color: 'white' }} className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap sm:hidden">
                    {firstName ?? 'Profile'}
                  </a>
                </>
              ) : (
                <>
                  <a href="/signin" style={{ color: 'var(--muted)' }} className="hover:opacity-70 transition-opacity hidden sm:inline">Sign in</a>
                  <a href="/signup" style={{ background: 'var(--forest)', color: 'white' }} className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap">
                    Join
                  </a>
                </>
              )}
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer style={{ background: 'var(--hero-bg)', color: 'rgba(255,255,255,0.75)' }} className="mt-16 sm:mt-24 py-10 text-center text-sm px-4">
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>
            Umuganda
          </p>
          <p>Lisbon · Ericeira · Mafra · Sintra · Cascais · Setubal</p>
          <p className="mt-2" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            Umuganda — coming together in common purpose. Inspired by Rwanda.
          </p>
        </footer>
      </body>
    </html>
  )
}
