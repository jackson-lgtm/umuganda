import { login } from '@/app/actions/auth'

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; redirect?: string }>
}) {
  const { error, message, redirect: redirectTo } = await searchParams

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Sign in to your Umuganda account.</p>
        </div>

        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #fca5a5', borderRadius: '10px', color: '#b91c1c', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        <form action={login} className="space-y-4">
          {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Email</label>
            <input name="email" type="email" required autoFocus placeholder="your@email.com" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Password</label>
            <input name="password" type="password" required placeholder="Your password" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
          </div>

          <button type="submit" style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '14px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', marginTop: '8px' }}
            className="hover:opacity-90 transition-opacity">
            Sign in
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--muted)', fontSize: '0.875rem' }}>
          No account yet?{' '}
          <a href={`/signup${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} style={{ color: 'var(--forest)' }}>Create one</a>
        </p>
      </div>
    </div>
  )
}
