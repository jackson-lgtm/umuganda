import { dbSelectOne } from '@/lib/supabase/fetch'
import { respondToNeed } from '@/app/actions/needs'
import { Need } from '@/lib/types'
import { getUser } from '@/lib/auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const URGENCY_STYLE: Record<string, { bg: string; color: string }> = {
  'Urgent — today/tomorrow': { bg: '#fde8e8', color: '#b91c1c' },
  'This week':               { bg: '#fef3d0', color: '#92400e' },
  'This month':              { bg: '#e8f4ee', color: '#166534' },
  'Ongoing':                 { bg: '#e0effe', color: '#1e40af' },
}

export default async function NeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ helped?: string }>
}) {
  const { id } = await params
  const sp = await searchParams

  const [n, user] = await Promise.all([
    dbSelectOne<Need>('needs', { 'id': `eq.${id}` }),
    getUser(),
  ])

  if (!n) notFound()
  const isClosed = n.pipeline === 'Fulfilled' || n.pipeline === 'Closed'

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <Link href="/needs" style={{ color: 'var(--muted)', fontSize: '0.875rem' }} className="hover:opacity-70 transition-opacity mb-8 inline-flex items-center gap-1">
        ← Back to all needs
      </Link>

      {sp.helped && (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '12px', color: '#166534', marginBottom: '24px' }} className="p-4 text-sm">
          Thank you. Your details have been shared and you&apos;ll hear back soon. This matters.
        </div>
      )}

      {/* Need card */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', padding: '28px', marginBottom: '32px' }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.2 }}>
            {n.title}
          </h1>
          {n.urgency && URGENCY_STYLE[n.urgency] && (
            <span style={{ ...URGENCY_STYLE[n.urgency], borderRadius: '999px', fontSize: '0.75rem', padding: '4px 12px', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {n.urgency}
            </span>
          )}
        </div>

        {n.description && (
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '24px' }}>{n.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          {n.area && (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Area</p>
              <p style={{ fontWeight: 500 }}>{n.area}</p>
            </div>
          )}
          {n.location && (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Location</p>
              <p style={{ fontWeight: 500 }}>{n.location}</p>
            </div>
          )}
          {n.time_required && (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Time needed</p>
              <p style={{ fontWeight: 500 }}>{n.time_required}</p>
            </div>
          )}
          {n.helpers_needed && (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Helpers needed</p>
              <p style={{ fontWeight: 500 }}>{n.helpers_needed}</p>
            </div>
          )}
        </div>

        {n.category && n.category.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {n.category.map(cat => (
              <span key={cat} style={{ background: 'var(--amber-light)', color: '#92400e', borderRadius: '999px', fontSize: '0.75rem', padding: '4px 12px' }}>
                {cat}
              </span>
            ))}
          </div>
        )}

        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '8px' }}>
          Posted {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          {n.contact_name && ` · ${n.contact_name}`}
        </p>
      </div>

      {/* Help form or fulfilled */}
      {!isClosed ? (
        <div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '8px' }}>
            I can help with this
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Leave your details and we&apos;ll connect you with the person who posted this need.
          </p>

          {!user && (
            <div style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px' }}>
              <p style={{ fontWeight: 500, color: '#92400e', marginBottom: '8px' }}>Sign in to respond</p>
              <p style={{ color: '#92400e', fontSize: '0.875rem', marginBottom: '16px' }}>You need an account to offer help. It takes 30 seconds.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href={`/signup?redirect=/needs/${n.id}`} style={{ background: 'var(--terra)', color: 'white', borderRadius: '999px', padding: '9px 20px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
                  Create account
                </Link>
                <Link href={`/signin?redirect=/needs/${n.id}`} style={{ border: '1px solid #d97706', color: '#92400e', borderRadius: '999px', padding: '9px 20px', fontSize: '0.875rem', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </div>
            </div>
          )}

          {user && <form action={respondToNeed} className="space-y-4">
            <input type="hidden" name="need_id" value={n.id} />

            {/* Pre-filled from account — shown as read-only confirmation */}
            <div style={{ background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', fontSize: '0.875rem' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '4px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Responding as</p>
              <p style={{ fontWeight: 500, color: 'var(--forest-dark)' }}>{user.user_metadata?.full_name ?? user.email}</p>
              {user.user_metadata?.phone && <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{user.user_metadata.phone}</p>}
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{user.email}</p>
            </div>

            <input type="hidden" name="helper_name" value={user.user_metadata?.full_name ?? user.email} />
            <input type="hidden" name="helper_whatsapp" value={user.user_metadata?.phone ?? ''} />
            <input type="hidden" name="helper_email" value={user.email} />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
                Message <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                name="message"
                rows={3}
                placeholder="When you're available, what you can bring, anything useful..."
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none', resize: 'none' }}
              />
            </div>
            <button
              type="submit"
              style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '16px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
              className="hover:opacity-90 transition-opacity"
            >
              I&apos;ll show up for this
            </button>
          </form>}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', marginBottom: '8px' }}>
            This need has been fulfilled.
          </p>
          <p className="text-sm mb-6">Thank you to everyone who showed up.</p>
          <Link
            href="/needs"
            style={{ border: '1px solid var(--border)', color: 'var(--warm-text)', borderRadius: '999px', padding: '10px 24px', fontSize: '0.9rem' }}
          >
            See other needs
          </Link>
        </div>
      )}
    </div>
  )
}
