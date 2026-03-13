import { register } from '@/app/actions/auth'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>
}) {
  const { error, redirect: redirectTo } = await searchParams

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '8px' }}>
            Join Umuganda
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Create an account to post needs or offer help.
          </p>
        </div>

        {error && (
          <div style={{ background: '#fde8e8', border: '1px solid #fca5a5', borderRadius: '10px', color: '#b91c1c', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form action={register} className="space-y-4">
          {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Full name *</label>
            <input name="full_name" required placeholder="Your full name" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Email *</label>
            <input name="email" type="email" required placeholder="your@email.com" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>WhatsApp / phone *</label>
            <input name="phone" required placeholder="+351..." style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Password *</label>
            <input name="password" type="password" required placeholder="At least 6 characters" minLength={6} style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
          </div>

          <button type="submit" style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '14px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none', marginTop: '8px' }}
            className="hover:opacity-90 transition-opacity">
            Create account
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--muted)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <a href={`/signin${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`} style={{ color: 'var(--forest)' }}>Sign in</a>
        </p>
      </div>
    </div>
  )
}
