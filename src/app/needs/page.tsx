import { createClient } from '@/lib/supabase/server'
import { Need, AREAS, CATEGORIES, URGENCY_OPTIONS } from '@/lib/types'
import Link from 'next/link'

const URGENCY_COLOR: Record<string, string> = {
  'Urgent — today/tomorrow': 'bg-red-100 text-red-700',
  'This week': 'bg-orange-100 text-orange-700',
  'This month': 'bg-yellow-100 text-yellow-700',
  'Ongoing': 'bg-blue-100 text-blue-700',
}

export default async function NeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string; category?: string; submitted?: string; registered?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('needs')
    .select('*')
    .eq('pipeline', 'Open')
    .order('created_at', { ascending: false })

  if (params.area) query = query.eq('area', params.area)
  if (params.category) query = query.contains('category', [params.category])

  const { data: needs } = await query

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {params.submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          Your need has been posted. Someone will reach out soon.
        </div>
      )}
      {params.registered && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          You&apos;re registered. We&apos;ll let you know when needs arise near you.
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Open needs</h1>
          <p className="text-stone-500 mt-1 text-sm">{needs?.length ?? 0} looking for help right now</p>
        </div>
        <Link
          href="/needs/new"
          className="bg-stone-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-stone-700 transition-colors"
        >
          Post a need
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <a
          href="/needs"
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${!params.area && !params.category ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}
        >
          All
        </a>
        {AREAS.map(area => (
          <a
            key={area}
            href={`/needs?area=${area}`}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${params.area === area ? 'bg-stone-900 text-white border-stone-900' : 'border-stone-300 text-stone-600 hover:border-stone-500'}`}
          >
            {area}
          </a>
        ))}
      </div>

      {/* Needs list */}
      {!needs || needs.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg mb-2">No open needs right now.</p>
          <p className="text-sm">Check back soon, or <Link href="/needs/new" className="underline">post one</Link>.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {needs.map((need: Need) => (
            <Link
              key={need.id}
              href={`/needs/${need.id}`}
              className="block bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg leading-tight mb-2">{need.title}</h2>
                  {need.description && (
                    <p className="text-stone-500 text-sm line-clamp-2 mb-3">{need.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 items-center text-xs">
                    {need.area && (
                      <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{need.area}</span>
                    )}
                    {need.time_required && (
                      <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{need.time_required}</span>
                    )}
                    {need.category?.slice(0, 2).map(cat => (
                      <span key={cat} className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full">{cat}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {need.urgency && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${URGENCY_COLOR[need.urgency] || 'bg-stone-100 text-stone-600'}`}>
                      {need.urgency}
                    </span>
                  )}
                  <span className="text-xs text-stone-400">
                    {new Date(need.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
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
