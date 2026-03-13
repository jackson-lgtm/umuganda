import { dbAdminSelect } from '@/lib/supabase/fetch'
import { updateHelperPipeline, updateHelperModeration, toggleTrustedVoucher } from '@/app/actions/admin'
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

  const [helpers, vouchRows] = await Promise.all([
    dbAdminSelect<Helper>('helpers', qp),
    dbAdminSelect<{ vouchee_id: string }>('helper_vouches', { select: 'vouchee_id' }),
  ])

  const vouchCountById = new Map<string, number>()
  for (const v of vouchRows) vouchCountById.set(v.vouchee_id, (vouchCountById.get(v.vouchee_id) ?? 0) + 1)

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
                {['Helper', 'Area', 'Skills', 'Contact', 'Registered', 'Status', 'Trust', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {helpers.map((helper, i) => {
                const pStyle = PIPELINE_COLOURS[helper.pipeline] ?? { bg: '#f3f4f6', color: '#374151' }
                const vouches = vouchCountById.get(helper.id) ?? 0
                return (
                  <tr key={helper.id} style={{ borderBottom: i < helpers.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.875rem' }}>{helper.name}</span>
                        {helper.is_trusted_voucher && (
                          <span style={{ background: '#e8f4ee', color: '#166534', borderRadius: '999px', fontSize: '0.6rem', padding: '1px 6px', fontWeight: 600 }}>trusted</span>
                        )}
                        {vouches > 0 && (
                          <span style={{ background: '#e0effe', color: '#1e40af', borderRadius: '999px', fontSize: '0.6rem', padding: '1px 6px' }}>{vouches}v</span>
                        )}
                      </div>
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
                      <form action={async () => { 'use server'; await toggleTrustedVoucher(helper.id, helper.is_trusted_voucher) }}>
                        <button type="submit" style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '999px', border: `1px solid ${helper.is_trusted_voucher ? '#86efac' : 'var(--border)'}`, background: helper.is_trusted_voucher ? '#e8f4ee' : 'white', color: helper.is_trusted_voucher ? '#166534' : 'var(--muted)', cursor: 'pointer' }}>
                          {helper.is_trusted_voucher ? 'Trusted' : 'Mark trusted'}
                        </button>
                      </form>
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
