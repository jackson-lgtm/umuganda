import { adminResendConfirmation, adminUpdatePhone, resendConfirmationToAll } from '@/app/actions/auth'

interface AuthUser {
  id: string
  email: string
  created_at: string
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  user_metadata: { full_name?: string; phone?: string }
}

export default async function AdminUsers({
  searchParams,
}: {
  searchParams: Promise<{ resent?: string }>
}) {
  const { resent } = await searchParams

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    cache: 'no-store',
  })
  const data = await res.json()
  const users: AuthUser[] = (data.users ?? []).sort(
    (a: AuthUser, b: AuthUser) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const confirmed = users.filter(u => u.email_confirmed_at)
  const unconfirmed = users.filter(u => !u.email_confirmed_at)

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
            Users
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            {users.length} total · {confirmed.length} confirmed · {unconfirmed.length} unconfirmed
          </p>
        </div>
        {unconfirmed.length > 0 && (
          <form action={resendConfirmationToAll}>
            <button type="submit" style={{ background: 'var(--terra)', color: 'white', border: 'none', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
              Resend to all {unconfirmed.length} unconfirmed
            </button>
          </form>
        )}
      </div>

      {resent && (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '12px', color: '#166534', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '24px' }}>
          Confirmation email resent to {resent} user{resent !== '1' ? 's' : ''}.
        </div>
      )}

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        {users.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>No users yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafaf9' }}>
                {['Name', 'Email', 'Phone', 'Signed up', 'Last sign in', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--forest-dark)', fontWeight: 500 }}>
                    {user.user_metadata?.full_name ?? '—'}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)' }}>
                    {user.email}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem' }}>
                    <form action={async (fd: FormData) => { 'use server'; await adminUpdatePhone(user.id, fd.get('phone') as string) }} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <input
                        name="phone"
                        defaultValue={user.user_metadata?.phone ?? ''}
                        placeholder="+351..."
                        required
                        style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '4px 8px', fontSize: '0.75rem', width: '130px', color: 'var(--forest-dark)' }}
                      />
                      <button type="submit" style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '8px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', cursor: 'pointer', whiteSpace: 'nowrap' }}>Save</button>
                    </form>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                      : '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {user.email_confirmed_at ? (
                      <span style={{ background: '#e8f4ee', color: '#166534', borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500 }}>
                        Confirmed
                      </span>
                    ) : (
                      <span style={{ background: '#fef3d0', color: '#92400e', borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500 }}>
                        Unconfirmed
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {!user.email_confirmed_at && (
                      <form action={adminResendConfirmation.bind(null, user.email)}>
                        <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #fde68a', background: '#fffbeb', color: '#92400e', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Resend email
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
