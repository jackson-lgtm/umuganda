import { dbAdminSelect } from '@/lib/supabase/fetch'
import { Need } from '@/lib/types'

interface Verification {
  id: string
  created_at: string
  need_id: string
  party: string
  completed_at: string | null
  flagged: boolean | null
  volunteer_showed_up: boolean | null
  task_safe_and_genuine: boolean | null
  task_completed: boolean | null
  volunteer_task_safe: boolean | null
}

export default async function AdminFlags() {
  const [all, flagged] = await Promise.all([
    dbAdminSelect<Verification>('task_verifications', { order: 'created_at.desc' }),
    dbAdminSelect<Verification>('task_verifications', { flagged: 'eq.true', order: 'created_at.desc' }),
  ])

  const needIds = [...new Set(flagged.map(v => v.need_id))]
  const needs = needIds.length > 0
    ? await dbAdminSelect<Need>('needs', { 'id': `in.(${needIds.join(',')})` })
    : []
  const needsMap = Object.fromEntries(needs.map(n => [n.id, n]))

  const completed = all.filter(v => v.completed_at).length
  const pending = all.filter(v => !v.completed_at).length

  return (
    <div style={{ padding: '40px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
          Flags
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          {all.length} verifications total · {completed} completed · {pending} pending · {flagged.length} flagged
        </p>
      </div>

      {flagged.length === 0 ? (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#166534', fontWeight: 500, marginBottom: '4px' }}>No flags</p>
          <p style={{ color: '#166534', fontSize: '0.875rem', opacity: 0.8 }}>All completed verifications came back positive.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flagged.map(v => {
            const need = needsMap[v.need_id]
            return (
              <div key={v.id} style={{ background: 'white', border: '1px solid #fca5a5', borderRadius: '14px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    {need && (
                      <a href={`/admin/needs/${need.id}`} style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.95rem', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
                        {need.title} →
                      </a>
                    )}
                    <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
                      {v.party === 'poster' ? 'Posted by poster' : 'Posted by volunteer'} ·{' '}
                      {v.completed_at ? new Date(v.completed_at).toLocaleDateString('en-GB') : 'pending'}
                    </p>
                  </div>
                  <span style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    Flagged
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.8rem' }}>
                  {v.party === 'poster' ? (
                    <>
                      <div style={{ background: '#f8f7f5', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted)' }}>Volunteer showed up: </span>
                        <strong style={{ color: v.volunteer_showed_up ? '#166534' : '#991b1b' }}>
                          {v.volunteer_showed_up === null ? '—' : v.volunteer_showed_up ? 'Yes' : 'No'}
                        </strong>
                      </div>
                      <div style={{ background: '#f8f7f5', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted)' }}>Task safe & genuine: </span>
                        <strong style={{ color: v.task_safe_and_genuine ? '#166534' : '#991b1b' }}>
                          {v.task_safe_and_genuine === null ? '—' : v.task_safe_and_genuine ? 'Yes' : 'No'}
                        </strong>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ background: '#f8f7f5', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted)' }}>Task completed: </span>
                        <strong style={{ color: v.task_completed ? '#166534' : '#991b1b' }}>
                          {v.task_completed === null ? '—' : v.task_completed ? 'Yes' : 'No'}
                        </strong>
                      </div>
                      <div style={{ background: '#f8f7f5', borderRadius: '8px', padding: '8px 12px' }}>
                        <span style={{ color: 'var(--muted)' }}>Task safe: </span>
                        <strong style={{ color: v.volunteer_task_safe ? '#166534' : '#991b1b' }}>
                          {v.volunteer_task_safe === null ? '—' : v.volunteer_task_safe ? 'Yes' : 'No'}
                        </strong>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
