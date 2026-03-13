import { dbAdminCount } from '@/lib/supabase/fetch'

export default async function AdminOverview() {
  const [openNeeds, pendingNeeds, totalHelpers, totalResponses] = await Promise.all([
    dbAdminCount('needs', { pipeline: 'eq.Open', moderation_status: 'eq.live' }),
    dbAdminCount('needs', { moderation_status: 'eq.pending_review' }),
    dbAdminCount('helpers'),
    dbAdminCount('helper_responses'),
  ])

  const stats = [
    { label: 'Open needs (live)', value: openNeeds, color: 'var(--terra)', bg: 'var(--terra-light)' },
    { label: 'Pending review', value: pendingNeeds, color: '#92400e', bg: '#fef3d0', alert: pendingNeeds > 0 },
    { label: 'Helpers registered', value: totalHelpers, color: '#1e40af', bg: '#e0effe' },
    { label: 'Help responses', value: totalResponses, color: '#166534', bg: '#e8f4ee' },
  ]

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '8px' }}>
        Overview
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '36px' }}>
        {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
        {stats.map(({ label, value, color, bg, alert }) => (
          <div key={label} style={{ background: bg, borderRadius: '16px', padding: '24px', position: 'relative' }}>
            {alert && (
              <div style={{ position: 'absolute', top: '16px', right: '16px', width: '8px', height: '8px', borderRadius: '50%', background: color }} className="animate-pulse" />
            )}
            <div style={{ fontSize: '2.5rem', fontWeight: 600, color, fontFamily: 'Fraunces, serif', lineHeight: 1 }}>{value}</div>
            <div style={{ color, fontSize: '0.8rem', marginTop: '8px', fontWeight: 500 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { href: '/admin/needs', title: 'Manage needs', desc: 'Update pipeline status, review and approve or reject listings.' },
          { href: '/admin/helpers', title: 'Manage helpers', desc: 'View all registered volunteers, update their status.' },
          { href: '/admin/responses', title: 'View responses', desc: 'See who has offered to help with which needs.' },
          { href: '/needs/new', title: 'Post a need', desc: 'Submit a need directly on behalf of someone.' },
        ].map(({ href, title, desc }) => (
          <a
            key={href}
            href={href}
            style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px', textDecoration: 'none', display: 'block' }}
          >
            <div style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '4px' }}>{title} →</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{desc}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
