import { resendConfirmation } from '@/app/actions/auth'

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; resent?: string }>
}) {
  const { email, resent } = await searchParams

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '460px', textAlign: 'center' }}>

        {/* Icon */}
        <div style={{ width: '64px', height: '64px', background: '#e8f4ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#166534" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '12px', lineHeight: 1.2 }}>
          Check your inbox
        </h1>

        {resent ? (
          <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '10px', color: '#166534', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '20px' }}>
            Confirmation email resent. Check your inbox and spam folder.
          </div>
        ) : null}

        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '8px' }}>
          We&apos;ve sent a confirmation link to
        </p>
        {email && (
          <p style={{ fontWeight: 600, color: 'var(--forest-dark)', fontSize: '0.95rem', marginBottom: '24px' }}>
            {email}
          </p>
        )}

        <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Click the link in the email to confirm your account. If you don&apos;t see it, check your spam folder — it sometimes ends up there.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <a
            href="/signin"
            style={{ background: 'var(--forest)', color: 'white', borderRadius: '999px', padding: '12px 32px', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}
          >
            Already confirmed? Sign in
          </a>

          {email && (
            <form action={resendConfirmation.bind(null, email)}>
              <button type="submit" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '999px', padding: '10px 28px', fontSize: '0.85rem', color: 'var(--muted)', cursor: 'pointer' }}>
                Resend confirmation email
              </button>
            </form>
          )}

          <a
            href="/signup"
            style={{ color: 'var(--muted)', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            Wrong email? Start over
          </a>
        </div>
      </div>
    </div>
  )
}
