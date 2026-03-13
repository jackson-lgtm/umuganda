import { createClient } from '@/lib/supabase/server'
import { respondToNeed } from '@/app/actions/needs'
import { Need } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const URGENCY_COLOR: Record<string, string> = {
  'Urgent — today/tomorrow': 'bg-red-100 text-red-700',
  'This week': 'bg-orange-100 text-orange-700',
  'This month': 'bg-yellow-100 text-yellow-700',
  'Ongoing': 'bg-blue-100 text-blue-700',
}

export default async function NeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ helped?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: need } = await supabase
    .from('needs')
    .select('*')
    .eq('id', id)
    .single()

  if (!need) notFound()

  const n = need as Need

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/needs" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6 inline-block">
        ← Back to all needs
      </Link>

      {sp.helped && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
          Thank you. The contact details have been shared and you&apos;ll hear back soon.
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold leading-tight">{n.title}</h1>
          {n.urgency && (
            <span className={`shrink-0 text-xs px-2 py-1 rounded-full font-medium ${URGENCY_COLOR[n.urgency] || 'bg-stone-100 text-stone-600'}`}>
              {n.urgency}
            </span>
          )}
        </div>

        {n.description && (
          <p className="text-stone-600 leading-relaxed mb-6">{n.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-sm">
          {n.area && (
            <div>
              <span className="text-stone-400 text-xs uppercase tracking-wide">Area</span>
              <p className="font-medium">{n.area}</p>
            </div>
          )}
          {n.location && (
            <div>
              <span className="text-stone-400 text-xs uppercase tracking-wide">Location</span>
              <p className="font-medium">{n.location}</p>
            </div>
          )}
          {n.time_required && (
            <div>
              <span className="text-stone-400 text-xs uppercase tracking-wide">Time needed</span>
              <p className="font-medium">{n.time_required}</p>
            </div>
          )}
          {n.helpers_needed && (
            <div>
              <span className="text-stone-400 text-xs uppercase tracking-wide">Helpers needed</span>
              <p className="font-medium">{n.helpers_needed}</p>
            </div>
          )}
        </div>

        {n.category && n.category.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {n.category.map(cat => (
              <span key={cat} className="bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-full">{cat}</span>
            ))}
          </div>
        )}

        <p className="text-xs text-stone-400 mt-4">
          Posted {new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          {n.contact_name && ` by ${n.contact_name}`}
        </p>
      </div>

      {n.pipeline !== 'Fulfilled' && n.pipeline !== 'Closed' ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">I can help with this</h2>
          <p className="text-stone-500 text-sm mb-6">Leave your details and the person who posted this will get in touch directly.</p>

          <form action={respondToNeed} className="space-y-4">
            <input type="hidden" name="need_id" value={n.id} />
            <div>
              <label className="block text-sm font-medium mb-2">Your name *</label>
              <input
                name="helper_name"
                required
                placeholder="First name is fine"
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp *</label>
              <input
                name="helper_whatsapp"
                required
                placeholder="+351..."
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email (optional)</label>
              <input
                name="helper_email"
                type="email"
                placeholder="your@email.com"
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message (optional)</label>
              <textarea
                name="message"
                rows={3}
                placeholder="Anything useful to know — when you&apos;re available, what you can bring, etc."
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-700 transition-colors"
            >
              I&apos;ll help with this
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center py-8 text-stone-400">
          <p>This need has been fulfilled. Thank you to everyone who showed up.</p>
          <Link href="/needs" className="text-sm underline mt-2 inline-block">See other needs</Link>
        </div>
      )}
    </div>
  )
}
