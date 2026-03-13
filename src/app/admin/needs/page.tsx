import { dbAdminSelect } from '@/lib/supabase/fetch'
import { updateNeedPipeline, updateNeedModeration } from '@/app/actions/admin'
import { Need } from '@/lib/types'

const PIPELINE_COLOURS: Record<string, { bg: string; color: string }> = {
  'Open':            { bg: '#e8f4ee', color: '#166534' },
  'Helper assigned': { bg: '#e0effe', color: '#1e40af' },
  'In progress':     { bg: '#fef3d0', color: '#92400e' },
  'Fulfilled':       { bg: '#f3f4f6', color: '#374151' },
  'Closed':          { bg: '#fee2e2', color: '#991b1b' },
}

const MOD_COLOURS: Record<string, { bg: string; color: string }> = {
  'live':           { bg: '#e8f4ee', color: '#166534' },
  'pending_review': { bg: '#fef3d0', color: '#92400e' },
  'rejected':       { bg: '#fee2e2', color: '#991b1b' },
}

export default async function AdminNeeds({
  searchParams,
}: {
  searchParams: Promise<{ pipeline?: string; mod?: string }>
}) {
  const { pipeline, mod } = await searchParams

  const qp: Record<string, string> = { order: 'created_at.desc' }
  if (pipeline) qp['pipeline'] = `eq.${pipeline}`
  if (mod) qp['moderation_status'] = `eq.${mod}`

  const needs = await dbAdminSelect<Need>('needs', qp)

  const pipelines = ['Open', 'Helper assigned', 'In progress', 'Fulfilled', 'Closed']
  const modStatuses = ['live', 'pending_review', 'rejected']

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
            Needs
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{needs.length} total</p>
        </div>
        <a
          href="/needs/new"
          style={{ background: 'var(--terra)', color: 'white', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}
        >
          + Post a need
        </a>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <a href="/admin/needs" style={{ borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', background: !pipeline && !mod ? 'var(--forest-dark)' : 'white', color: !pipeline && !mod ? 'white' : 'var(--muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>All</a>
        {pipelines.map(p => (
          <a key={p} href={`/admin/needs?pipeline=${encodeURIComponent(p)}`} style={{ borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', background: pipeline === p ? 'var(--forest-dark)' : 'white', color: pipeline === p ? 'white' : 'var(--muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>{p}</a>
        ))}
        <div style={{ width: '1px', background: 'var(--border)', margin: '0 4px' }} />
        {modStatuses.map(m => (
          <a key={m} href={`/admin/needs?mod=${m}`} style={{ borderRadius: '999px', padding: '5px 14px', fontSize: '0.8rem', background: mod === m ? '#2a1200' : 'white', color: mod === m ? 'white' : 'var(--muted)', border: '1px solid var(--border)', textDecoration: 'none' }}>{m.replace('_', ' ')}</a>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
        {needs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>No needs match this filter.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: '#fafaf9' }}>
                {['Need', 'Area', 'Posted', 'Pipeline', 'Moderation', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {needs.map((need, i) => {
                const pStyle = PIPELINE_COLOURS[need.pipeline] ?? { bg: '#f3f4f6', color: '#374151' }
                const mStyle = MOD_COLOURS[need.moderation_status] ?? { bg: '#f3f4f6', color: '#374151' }
                return (
                  <tr key={need.id} style={{ borderBottom: i < needs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                      <a href={`/admin/needs/${need.id}`} style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.875rem', textDecoration: 'none', display: 'block', marginBottom: '2px' }}>
                        {need.title}
                      </a>
                      {need.contact_name && <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{need.contact_name}</span>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{need.area ?? '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(need.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ ...pStyle, borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {need.pipeline}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ ...mStyle, borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {need.moderation_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {/* Pipeline actions */}
                        {need.pipeline === 'Open' && (
                          <form action={async () => { 'use server'; await updateNeedPipeline(need.id, 'Helper assigned') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #93c5fd', background: '#eff6ff', color: '#1e40af', cursor: 'pointer' }}>Assign helper</button>
                          </form>
                        )}
                        {need.pipeline !== 'Fulfilled' && need.pipeline !== 'Closed' && (
                          <form action={async () => { 'use server'; await updateNeedPipeline(need.id, 'Fulfilled') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', cursor: 'pointer' }}>Mark fulfilled</button>
                          </form>
                        )}
                        {need.pipeline !== 'Closed' && (
                          <form action={async () => { 'use server'; await updateNeedPipeline(need.id, 'Closed') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #fca5a5', background: '#fff1f2', color: '#991b1b', cursor: 'pointer' }}>Close</button>
                          </form>
                        )}
                        {/* Moderation actions */}
                        {need.moderation_status !== 'live' && (
                          <form action={async () => { 'use server'; await updateNeedModeration(need.id, 'live') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #86efac', background: '#f0fdf4', color: '#166534', cursor: 'pointer' }}>Approve</button>
                          </form>
                        )}
                        {need.moderation_status !== 'rejected' && (
                          <form action={async () => { 'use server'; await updateNeedModeration(need.id, 'rejected') }}>
                            <button type="submit" style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: '999px', border: '1px solid #fca5a5', background: '#fff1f2', color: '#991b1b', cursor: 'pointer' }}>Reject</button>
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
