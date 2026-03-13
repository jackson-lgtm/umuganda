import { adminLogout } from '@/app/actions/admin'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f7f5' }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', background: 'var(--forest-dark)', flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px 20px' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/logo.svg" alt="" width={32} height={32} />
            <div>
              <div style={{ fontFamily: 'Fraunces, serif', color: 'white', fontSize: '1rem', lineHeight: 1.2 }}>Umuganda</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</div>
            </div>
          </a>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px' }}>
          {[
            { href: '/admin', label: 'Overview' },
            { href: '/admin/needs', label: 'Needs' },
            { href: '/admin/helpers', label: 'Helpers' },
            { href: '/admin/responses', label: 'Responses' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              style={{ display: 'block', padding: '9px 12px', borderRadius: '8px', color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: '2px', textDecoration: 'none' }}
            >
              {label}
            </a>
          ))}
        </nav>

        <div style={{ padding: '16px 12px' }}>
          <a
            href="/needs"
            style={{ display: 'block', padding: '9px 12px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', textDecoration: 'none', marginBottom: '4px' }}
          >
            ← View site
          </a>
          <form action={adminLogout}>
            <button
              type="submit"
              style={{ background: 'none', border: 'none', padding: '9px 12px', color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', cursor: 'pointer', width: '100%', textAlign: 'left' }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
