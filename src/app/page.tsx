import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { count: needsCount } = await supabase
    .from('needs')
    .select('*', { count: 'exact', head: true })
    .eq('pipeline', 'Open')

  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--forest-dark)' }} className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-5 py-24 sm:py-32 relative z-10">
          <div className="max-w-2xl">
            <p style={{ color: 'var(--amber)', fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }} className="mb-5">
              Lisbon · Ericeira · Mafra · Sintra and surrounds
            </p>
            <h1 style={{ fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400, lineHeight: 1.1, color: 'white' }} className="text-5xl sm:text-6xl mb-6">
              Show up.<br />
              <em style={{ color: 'var(--amber)', fontStyle: 'italic' }}>For someone</em><br />
              who needs it.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '1.05rem' }} className="mb-10 max-w-lg">
              In Rwanda, on the last Saturday of every month, everyone stops —
              rich and poor — and gives their time to the community.
              No obligation. No hierarchy. Just showing up.
              This is that, here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/needs"
                style={{ background: 'var(--amber)', color: 'var(--forest-dark)', fontWeight: 600 }}
                className="px-8 py-4 rounded-full text-base hover:opacity-90 transition-opacity text-center"
              >
                See what&apos;s needed →
              </Link>
              <Link
                href="/needs/new"
                style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}
                className="px-8 py-4 rounded-full text-base hover:bg-white/10 transition-colors text-center"
              >
                Ask for help
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative circle */}
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '500px', height: '500px', borderRadius: '50%', background: 'var(--amber)', opacity: 0.12 }} />
        <div style={{ position: 'absolute', right: '120px', bottom: '-120px', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--terra)', opacity: 0.12 }} />
      </section>

      {/* Live count strip */}
      {needsCount !== null && needsCount > 0 && (
        <div style={{ background: 'var(--amber-light)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-3 text-sm">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--terra)', display: 'inline-block', flexShrink: 0 }} className="animate-pulse" />
            <span style={{ color: 'var(--warm-text)', fontWeight: 500 }}>
              {needsCount} {needsCount === 1 ? 'need' : 'needs'} open right now in your area.
            </span>
            <Link href="/needs" style={{ color: 'var(--forest)', fontWeight: 600 }} className="hover:opacity-70 transition-opacity">
              See them →
            </Link>
          </div>
        </div>
      )}

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 300, color: 'var(--muted)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.5 }}>
          From painting a wall for an elderly neighbour to building something
          for a community — all help counts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              title: 'Someone posts a need',
              body: 'A person, family, or project posts what they need — no minimum, no maximum. A dog walk or an orphanage. It all belongs here.',
              color: 'var(--terra-light)',
              accent: 'var(--terra)',
            },
            {
              n: '02',
              title: 'You see it and offer',
              body: 'Browse what\'s open near you. When something calls to you, click "I can help" — your contact goes straight to the person who posted.',
              color: 'var(--amber-light)',
              accent: 'var(--amber)',
            },
            {
              n: '03',
              title: 'You show up',
              body: 'No ongoing commitment. No schedule. No ego. You help when you can, as much as you want, because you want to.',
              color: '#fef9e8',
              accent: 'var(--amber)',
            },
          ].map(({ n, title, body, color, accent }) => (
            <div key={n} style={{ background: color, borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', fontWeight: 300, color: accent, lineHeight: 1, marginBottom: '12px' }}>{n}</div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: '1.15rem', marginBottom: '10px', color: 'var(--warm-text)' }}>{title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ background: 'white', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }} className="py-16">
        <div className="max-w-5xl mx-auto px-5">
          <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: 'var(--muted)', textAlign: 'center', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            The kinds of help that land here
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Elderly support', 'Children & youth', 'Environment & nature',
              'Animals', 'Housing & repairs', 'Food & hunger',
              'Community spaces', 'Events', 'Anything else'
            ].map(cat => (
              <span key={cat} style={{ background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '999px', padding: '6px 16px', fontSize: '0.85rem' }}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-5xl mx-auto px-5 py-20 text-center">
        <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 400, marginBottom: '1rem', color: 'var(--forest-dark)' }}>
          Ready to show up?
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1rem' }}>
          Register as a helper once. We&apos;ll connect you with needs near you when they come up.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/helpers/new"
            style={{ background: 'var(--forest)', color: 'white', fontWeight: 500 }}
            className="px-8 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
          >
            Register as a helper
          </Link>
          <Link
            href="/needs"
            style={{ border: '1px solid var(--border)', color: 'var(--warm-text)' }}
            className="px-8 py-4 rounded-full text-base hover:border-stone-400 transition-colors"
          >
            Browse open needs
          </Link>
        </div>
      </section>
    </div>
  )
}
