import { getUser } from '@/lib/auth'
import { dbAdminSelect } from '@/lib/supabase/fetch'
import { logout } from '@/app/actions/auth'
import { Need, HelperResponse } from '@/lib/types'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/signin?redirect=/profile')

  const { welcome } = await searchParams

  const fullName = user.user_metadata?.full_name ?? user.email
  const phone = user.user_metadata?.phone

  const [myNeeds, myResponses] = await Promise.all([
    dbAdminSelect<Need>('needs', { submitted_by: `eq.${user.id}`, order: 'created_at.desc' }).catch(() => [] as Need[]),
    dbAdminSelect<HelperResponse>('helper_responses', { order: 'created_at.desc' }).catch(() => [] as HelperResponse[]),
  ])

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      {welcome && (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '14px', padding: '16px 20px', marginBottom: '32px' }}>
          <p style={{ fontWeight: 600, color: '#166534', marginBottom: '4px' }}>Welcome to Umuganda.</p>
          <p style={{ color: '#166534', fontSize: '0.875rem' }}>Your account is confirmed. Browse needs, offer your skills, or post something your community can help with.</p>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
            {fullName}
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{user.email}</p>
          {phone && <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{phone}</p>}
        </div>
        <form action={logout}>
          <button type="submit" style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', color: 'var(--muted)', cursor: 'pointer' }}>
            Sign out
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <Link href="/needs/new" style={{ background: 'var(--terra)', color: 'white', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
          + Post a need
        </Link>
        <Link href="/helpers/new" style={{ background: 'white', color: 'var(--forest-dark)', border: '1px solid var(--border)', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
          Register as volunteer
        </Link>
        <Link href="/profile/documents" style={{ background: 'white', color: 'var(--forest-dark)', border: '1px solid var(--border)', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
          Upload documents
        </Link>
      </div>

      {/* Needs posted */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '16px' }}>
          Your needs ({myNeeds.length})
        </h2>
        {myNeeds.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>You haven&apos;t posted any needs yet.</p>
        ) : (
          <div className="space-y-3">
            {myNeeds.map(n => (
              <Link key={n.id} href={`/needs/${n.id}`} style={{ display: 'block', background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 20px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.95rem' }}>{n.title}</span>
                  <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px', background: n.pipeline === 'Open' ? '#e8f4ee' : '#f3f4f6', color: n.pipeline === 'Open' ? '#166534' : '#374151', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {n.pipeline}
                  </span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  {n.area} · {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Responses made */}
      <section>
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '16px' }}>
          Help you&apos;ve offered ({myResponses.length})
        </h2>
        {myResponses.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
            You haven&apos;t responded to any needs yet. <Link href="/needs" style={{ color: 'var(--forest)' }}>See open needs →</Link>
          </p>
        ) : (
          <div className="space-y-3">
            {myResponses.map(r => (
              <Link key={r.id} href={`/needs/${r.need_id}`} style={{ display: 'block', background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 20px', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.95rem' }}>Help offered</span>
                  <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '999px', background: (r as HelperResponse & { status?: string }).status === 'accepted' ? '#e8f4ee' : '#f3f4f6', color: (r as HelperResponse & { status?: string }).status === 'accepted' ? '#166534' : '#374151', whiteSpace: 'nowrap' }}>
                    {(r as HelperResponse & { status?: string }).status ?? 'pending'}
                  </span>
                </div>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                  {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
