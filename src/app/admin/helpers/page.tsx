import { dbAdminSelect } from '@/lib/supabase/fetch'
import { updateHelperPipeline, updateHelperModeration } from '@/app/actions/admin'
import { Helper } from '@/lib/types'

const PIPELINE_COLOURS: Record<string, { bg: string; color: string }> = {
  'New':      { bg: '#e0effe', color: '#1e40af' },
  'Active':   { bg: '#e8f4ee', color: '#166534' },
  'Paused':   { bg: '#fef3d0', color: '#92400e' },
  'Inactive': { bg: '#f3f4f6', color: '#374151' },
}

export default async function AdminHelpers({
  searchParams,
}: {
  searchParams: Promise<{ pipeline?: string; area?: string }>
}) {
  const { pipeline, area } = await searchParams

  const qp: Record<string, string> = { order: 'created_at.desc' }
  if (pipeline) qp['pipeline'] = `eq.${pipeline}`
  if (area) qp['area'] = `eq.${area}`

  const helpers = await dbAdminSelect<Helper>('helpers', qp)
  const pipelines = ['New', 'Active', 'Paused', 'Inactive']

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
          Helpers
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{helpers.length} registered</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <a href="/admin/helpers" style={{ borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', background: !pipeline ? 'var(--forest-dark)' : 'white', color: !pipeline ? 'white' : 'var(--muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>All</a>
        {pipelines.map(p => (
          <a key={p} href={`/admin/helpers?pipeline=${p}`} style={{ borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', background: pipeline === p ? 'var(--forest-dark)' : 'white', color: pipeline === p ? 'white' : 'var(--muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>{p}</a>
        ))}
      </div>

      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        {helpers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>No helpers match this filter.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafaf9' }}>
                {['Helper', 'Area', 'Skills', 'Contact', 'Registered', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {helpers.map((helper, i) => {
                const pStyle = PIPELINE_COLOURS[helper.pipeline] ?? { bg: '#f3f4f6', color: '#374151' }
                return (
                  <tr key={helper.id} style={{ borderBottom: i < helpers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.875rem' }}>{helper.name}</div>
                      {helper.about && <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{helper.about}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{helper.area ?? '—'}</td>
                    <td style={{ padding: '14px 16px', maxWidth: '180px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {helper.skills.slice(0, 3).map(s => (
                          <span key={s} style={{ background: 'var(--amber-light)', color: '#92400e', borderRadius: '999px', fontSize: '0.65rem', padding: '2px 8px' }}>{s}</span>
                        ))}
                        {helper.skills.length > 3 && <span style={{ fontSize: '0.65rem', color: 'var(--muted)' }}>+{helper.skills.length - 3}</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.75rem' }}>
                      {helper.whatsapp && <div style={{ color: 'var(--forest)' }}>{helper.whatsapp}</div>}
                      {helper.email && <div style={{ color: 'var(--muted)' }}>{helper.email}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(helper.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ ...pStyle, borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500 }}>
                        {helper.pipeline}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {helper.pipeline === 'New' && (
                          <form action={async () => { 'use server'; await updateHelperPipeline(helper.id, 'Active') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', cursor: 'pointer' }}>Activate</button>
                          </form>
                        )}
                        {helper.pipeline === 'Active' && (
                          <form action={async () => { 'use server'; await updateHelperPipeline(helper.id, 'Paused') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #fde68a', background: '#fffbeb', color: '#92400e', cursor: 'pointer' }}>Pause</button>
                          </form>
                        )}
                        {(helper.pipeline === 'Paused' || helper.pipeline === 'Inactive') && (
                          <form action={async () => { 'use server'; await updateHelperPipeline(helper.id, 'Active') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', cursor: 'pointer' }}>Reactivate</button>
                          </form>
                        )}
                        {helper.moderation_status !== 'rejected' && (
                          <form action={async () => { 'use server'; await updateHelperModeration(helper.id, 'rejected') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #fca5a5', background: '#fff1f2', color: '#991b1b', cursor: 'pointer' }}>Suspend</button>
                          </form>
                        )}
                        {helper.moderation_status === 'rejected' && (
                          <form action={async () => { 'use server'; await updateHelperModeration(helper.id, 'live') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', cursor: 'pointer' }}>Reinstate</button>
                          </form>
                        )}
                      </div>
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
