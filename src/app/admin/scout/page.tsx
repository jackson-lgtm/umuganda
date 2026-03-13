import { dbAdminSelect } from '@/lib/supabase/fetch'
import { promoteScout, rejectScout } from '@/app/actions/scout'

interface ScoutSubmission {
  id: string
  created_at: string
  title: string
  description: string | null
  area: string | null
  location: string | null
  category: string | null
  urgency: string | null
  contact_name: string | null
  contact_whatsapp: string | null
  source_platform: string | null
  source_url: string | null
  status: string
  promoted_need_id: string | null
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:  { bg: '#fef3d0', color: '#92400e' },
  promoted: { bg: '#e8f4ee', color: '#166534' },
  rejected: { bg: '#fee2e2', color: '#991b1b' },
}

export default async function AdminScout({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const qp: Record<string, string> = { order: 'created_at.desc' }
  if (status) qp['status'] = `eq.${status}`

  const submissions = await dbAdminSelect<ScoutSubmission>('scout_submissions', qp)

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
            Scout submissions
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{submissions.length} total</p>
        </div>
        <a href="/scout" target="_blank" style={{ border: '1px solid var(--border)', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none' }}>
          View scout form →
        </a>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[undefined, 'pending', 'promoted', 'rejected'].map(s => (
          <a key={s ?? 'all'} href={s ? `/admin/scout?status=${s}` : '/admin/scout'}
            style={{ borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', background: status === s ? 'var(--forest-dark)' : 'white', color: status === s ? 'white' : 'var(--muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>
            {s ?? 'All'}
          </a>
        ))}
      </div>

      {submissions.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
          No submissions yet. Share the <a href="/scout" target="_blank" style={{ color: 'var(--forest)' }}>scout form</a> with your scouts.
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(s => {
            const sStyle = STATUS_STYLE[s.status] ?? STATUS_STYLE.pending
            return (
              <div key={s.id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.95rem', marginBottom: '4px' }}>{s.title}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
                      {s.area && <span>{s.area}</span>}
                      {s.category && <span>{s.category}</span>}
                      {s.urgency && <span>{s.urgency}</span>}
                      {s.source_platform && <span>via {s.source_platform}</span>}
                      <span>{new Date(s.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <span style={{ ...sStyle, borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {s.status}
                  </span>
                </div>

                {s.description && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '12px' }}>{s.description}</p>
                )}

                <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {s.contact_name && <span style={{ color: 'var(--muted)' }}>Contact: <strong style={{ color: 'var(--forest-dark)' }}>{s.contact_name}</strong></span>}
                  {s.contact_whatsapp && <span style={{ color: 'var(--muted)' }}>WhatsApp: <strong style={{ color: 'var(--forest)' }}>{s.contact_whatsapp}</strong></span>}
                  {s.source_url && <a href={s.source_url} target="_blank" style={{ color: 'var(--terra)' }}>Original post →</a>}
                </div>

                {s.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <form action={async () => { 'use server'; await promoteScout(s.id) }}>
                      <button type="submit" style={{ background: '#e8f4ee', color: '#166534', border: '1px solid #86efac', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                        Promote to live need
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await rejectScout(s.id) }}>
                      <button type="submit" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                        Reject
                      </button>
                    </form>
                  </div>
                )}
                {s.status === 'promoted' && s.promoted_need_id && (
                  <a href={`/needs/${s.promoted_need_id}`} target="_blank" style={{ color: 'var(--forest)', fontSize: '0.8rem', textDecoration: 'none' }}>
                    View live need →
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
