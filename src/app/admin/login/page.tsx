import { adminLogin } from '@/app/actions/admin'

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)' }}>
      <div style={{ width: '100%', maxWidth: '360px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.svg" alt="" width={48} height={48} style={{ margin: '0 auto 12px' }} />
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 400, color: 'var(--forest-dark)' }}>
            Admin
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginTop: '4px' }}>Umuganda operations panel</p>
        </div>

        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #fca5a5', borderRadius: '10px', color: '#b91c1c', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px' }}>
            Incorrect password.
          </div>
        )}

        <form action={adminLogin}>
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            autoFocus
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none', marginBottom: '12px' }}
          />
          <button
            type="submit"
            style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '14px', borderRadius: '999px', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}
