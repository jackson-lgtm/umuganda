import { dbSelect } from '@/lib/supabase/fetch'
import { Need, AREAS } from '@/lib/types'
import Link from 'next/link'

const URGENCY_STYLE: Record<string, { bg: string; color: string }> = {
  'Urgent — today/tomorrow': { bg: '#fde8e8', color: '#b91c1c' },
  'This week':               { bg: '#fef3d0', color: '#92400e' },
  'This month':              { bg: '#e8f4ee', color: '#166534' },
  'Ongoing':                 { bg: '#e0effe', color: '#1e40af' },
}

export default async function NeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; submitted?: string; registered?: string }>
}) {
  const params = await searchParams

  const qp: Record<string, string> = {
    pipeline: 'eq.Open',
    order: 'created_at.desc',
  }
  if (params.area) qp['area'] = `eq.${params.area}`

  const needs = await dbSelect<Need>('needs', qp)

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      {params.submitted && (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '12px', color: '#166534' }} className="mb-6 p-4 text-sm">
          Your need has been posted. Someone will reach out soon. Thank you for trusting the community.
        </div>
      )}
      {params.registered && (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '12px', color: '#166534' }} className="mb-6 p-4 text-sm">
          You&apos;re registered. We&apos;ll connect you with needs near you. Welcome.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.1 }}>
            Open needs
          </h1>
          <p style={{ color: 'var(--muted)', marginTop: '6px', fontSize: '0.95rem' }}>
            {needs.length} {needs.length === 1 ? 'person or project' : 'people and projects'} looking for help right now
          </p>
        </div>
        <Link
          href="/needs/new"
          style={{ background: 'var(--terra)', color: 'white', fontWeight: 500, borderRadius: '999px', padding: '10px 24px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          className="hover:opacity-90 transition-opacity text-center"
        >
          Post a need
        </Link>
      </div>

      {/* Area filters — scroll horizontally on mobile */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
        <a
          href="/needs"
          style={{
            background: !params.area ? 'var(--forest)' : 'white',
            color: !params.area ? 'white' : 'var(--muted)',
            border: `1px solid ${!params.area ? 'var(--forest)' : 'var(--border)'}`,
            borderRadius: '999px', padding: '6px 16px', fontSize: '0.85rem', fontWeight: 500
          }}
          className="hover:opacity-80 transition-opacity shrink-0"
        >
          All areas
        </a>
        {AREAS.filter(a => a !== 'Other').map(area => (
          <a
            key={area}
            href={`/needs?area=${area}`}
            style={{
              background: params.area === area ? 'var(--forest)' : 'white',
              color: params.area === area ? 'white' : 'var(--muted)',
              border: `1px solid ${params.area === area ? 'var(--forest)' : 'var(--border)'}`,
              borderRadius: '999px', padding: '6px 16px', fontSize: '0.85rem'
            }}
            className="hover:opacity-80 transition-opacity shrink-0"
          >
            {area}
          </a>
        ))}
      </div>

      {/* Needs list */}
      {needs.length === 0 ? (
        <div className="text-center py-24" style={{ color: 'var(--muted)' }}>
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 300, marginBottom: '8px' }}>
            No open needs right now.
          </p>
          <p className="text-sm mb-6">That&apos;s either very good news, or no one has posted yet.</p>
          <Link
            href="/needs/new"
            style={{ border: '1px solid var(--border)', color: 'var(--warm-text)', borderRadius: '999px', padding: '10px 24px', fontSize: '0.9rem' }}
            className="hover:border-stone-400 transition-colors"
          >
            Post a need
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {needs.map((need: Need) => (
            <Link
              key={need.id}
              href={`/needs/${need.id}`}
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', display: 'block' }}
              className="p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.3, marginBottom: '6px', color: 'var(--forest-dark)' }}
                    className="group-hover:text-[#1e5c3a] transition-colors">
                    {need.title}
                  </h2>
                  {need.description && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.5 }} className="line-clamp-2 mb-3">
                      {need.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 items-center">
                    {need.area && (
                      <span style={{ background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '999px', fontSize: '0.75rem', padding: '3px 10px' }}>
                        {need.area}
                      </span>
                    )}
                    {need.time_required && (
                      <span style={{ background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '999px', fontSize: '0.75rem', padding: '3px 10px' }}>
                        {need.time_required}
                      </span>
                    )}
                    {need.category?.slice(0, 2).map(cat => (
                      <span key={cat} style={{ background: 'var(--amber-light)', color: '#92400e', borderRadius: '999px', fontSize: '0.75rem', padding: '3px 10px' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {need.urgency && URGENCY_STYLE[need.urgency] && (
                    <span style={{ ...URGENCY_STYLE[need.urgency], borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 600 }}>
                      {need.urgency}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {new Date(need.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <span style={{ color: 'var(--forest)', fontSize: '0.8rem', fontWeight: 500 }} className="group-hover:underline">
                    I can help →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
