import { dbAdminSelect } from '@/lib/supabase/fetch'
import { HelperResponse, Need } from '@/lib/types'

export default async function AdminResponses() {
  const [responses, needs] = await Promise.all([
    dbAdminSelect<HelperResponse>('helper_responses', { order: 'created_at.desc' }),
    dbAdminSelect<Need>('needs', { order: 'created_at.desc' }),
  ])

  const needsMap = Object.fromEntries(needs.map(n => [n.id, n]))

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
          Responses
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{responses.length} total offers to help</p>
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        {responses.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>No responses yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafaf9' }}>
                {['Helper', 'Contact', 'Need', 'Message', 'Date'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((r, i) => {
                const need = needsMap[r.need_id]
                return (
                  <tr key={r.id} style={{ borderBottom: i < responses.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.875rem' }}>{r.helper_name}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem' }}>
                      {r.helper_whatsapp && <div style={{ color: 'var(--forest)', fontWeight: 500 }}>{r.helper_whatsapp}</div>}
                      {r.helper_email && <div style={{ color: 'var(--muted)' }}>{r.helper_email}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: '220px' }}>
                      {need ? (
                        <a href={`/needs/${need.id}`} target="_blank" style={{ color: 'var(--forest-dark)', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                          {need.title}
                        </a>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', maxWidth: '220px' }}>
                      {r.message ? (
                        <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.message}</span>
                      ) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
