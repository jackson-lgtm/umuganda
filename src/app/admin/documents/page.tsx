import { dbAdminSelect } from '@/lib/supabase/fetch'
import { approveDocument, rejectDocument } from '@/app/actions/admin'
import { UserDocument } from '@/lib/types'

const DOC_LABELS: Record<string, string> = {
  identity: 'Identity document',
  working_with_children: 'Working with Children check',
  medical: 'Medical qualification',
  trade_licence: 'Trade licence',
}

// Docs that typically expire and need a date
const DOC_HAS_EXPIRY: Record<string, boolean> = {
  identity: true,
  working_with_children: true,
  medical: false,
  trade_licence: true,
}

function expiryStatus(expires_at: string | null): { label: string; color: string; bg: string } | null {
  if (!expires_at) return null
  const days = Math.ceil((new Date(expires_at).getTime() - Date.now()) / 86400000)
  if (days < 0) return { label: 'Expired', color: '#991b1b', bg: '#fee2e2' }
  if (days <= 30) return { label: `Expires in ${days}d`, color: '#92400e', bg: '#fef3d0' }
  return { label: `Expires ${new Date(expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, color: '#166534', bg: '#e8f4ee' }
}

export default async function AdminDocuments() {
  const docs = await dbAdminSelect<UserDocument>('user_documents', { order: 'created_at.desc' })
  const pending = docs.filter(d => !d.is_verified)
  const approved = docs.filter(d => d.is_verified)

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  async function getSignedUrl(path: string): Promise<string> {
    try {
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/documents/${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expiresIn: 3600 }),
        cache: 'no-store',
      })
      const data = await res.json()
      return `${SUPABASE_URL}/storage/v1${data.signedURL}`
    } catch {
      return '#'
    }
  }

  const expiredOrExpiring = approved.filter(d => {
    if (!d.expires_at) return false
    const days = Math.ceil((new Date(d.expires_at).getTime() - Date.now()) / 86400000)
    return days <= 30
  })

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
          Documents
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          {pending.length} pending review · {approved.length} approved
          {expiredOrExpiring.length > 0 && ` · ${expiredOrExpiring.length} expiring soon`}
        </p>
      </div>

      {expiredOrExpiring.length > 0 && (
        <div style={{ background: '#fef3d0', border: '1px solid #fde68a', borderRadius: '16px', padding: '16px 20px', marginBottom: '28px' }}>
          <p style={{ fontWeight: 600, color: '#92400e', marginBottom: '8px', fontSize: '0.875rem' }}>
            {expiredOrExpiring.length} document{expiredOrExpiring.length > 1 ? 's' : ''} expiring or expired
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {expiredOrExpiring.map(doc => {
              const exp = expiryStatus(doc.expires_at)
              return (
                <p key={doc.id} style={{ fontSize: '0.8rem', color: '#92400e' }}>
                  {DOC_LABELS[doc.document_type] ?? doc.document_type} · User {doc.user_id.slice(0, 8)}…
                  {exp && <span style={{ marginLeft: '6px', fontWeight: 600, color: exp.color }}>{exp.label}</span>}
                </p>
              )
            })}
          </div>
        </div>
      )}

      {pending.length === 0 ? (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: '#166534', fontWeight: 500 }}>No documents pending review</p>
        </div>
      ) : (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '16px' }}>Pending review</h2>
          <div className="space-y-4">
            {await Promise.all(pending.map(async doc => {
              const signedUrl = await getSignedUrl(doc.file_url)
              return (
                <div key={doc.id} style={{ background: 'white', border: '1px solid #fde68a', borderRadius: '14px', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '2px' }}>
                        {DOC_LABELS[doc.document_type] ?? doc.document_type}
                      </p>
                      <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                        User: {doc.user_id.slice(0, 8)}… · {new Date(doc.created_at).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                    <a href={signedUrl} target="_blank" style={{ border: '1px solid var(--border)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'none' }}>
                      View file
                    </a>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <form action={async (fd: FormData) => { 'use server'; await approveDocument(doc.id, fd.get('expires_at') as string | null) }} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                      {DOC_HAS_EXPIRY[doc.document_type] && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', marginBottom: '4px' }}>Expiry date (optional)</label>
                          <input type="date" name="expires_at" style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 10px', fontSize: '0.8rem', color: 'var(--forest-dark)' }} />
                        </div>
                      )}
                      <button type="submit" style={{ background: '#e8f4ee', color: '#166534', border: '1px solid #86efac', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                        Approve
                      </button>
                    </form>
                    <form action={async () => { 'use server'; await rejectDocument(doc.id) }}>
                      <button type="submit" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                        Reject
                      </button>
                    </form>
                  </div>
                </div>
              )
            }))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '16px' }}>Approved</h2>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafaf9' }}>
                  {['Type', 'User', 'Approved', 'Expiry'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approved.map((doc, i) => {
                  const exp = expiryStatus(doc.expires_at)
                  return (
                    <tr key={doc.id} style={{ borderBottom: i < approved.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--forest-dark)' }}>{DOC_LABELS[doc.document_type] ?? doc.document_type}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--muted)' }}>{doc.user_id.slice(0, 8)}…</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(doc.created_at).toLocaleDateString('en-GB')}</td>
                      <td style={{ padding: '12px 16px', fontSize: '0.8rem' }}>
                        {exp ? (
                          <span style={{ color: exp.color, background: exp.bg, borderRadius: '999px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 500 }}>
                            {exp.label}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
