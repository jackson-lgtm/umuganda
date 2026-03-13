import { submitScout } from '@/app/actions/scout'
import { AREAS, CATEGORIES, URGENCY_OPTIONS } from '@/lib/types'

const PLATFORMS = ['WhatsApp group', 'Facebook', 'OLX', 'Neighbour / word of mouth', 'Other']

export default async function ScoutPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>
}) {
  const { submitted } = await searchParams

  if (submitted) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '12px' }}>
            Thank you
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '24px' }}>
            We&apos;ve received this. If it checks out, we&apos;ll post it to the Umuganda board within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <a href="/scout" style={{ border: '1px solid var(--border)', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', color: 'var(--muted)', textDecoration: 'none' }}>Submit another</a>
            <a href="/needs" style={{ background: 'var(--terra)', color: 'white', borderRadius: '999px', padding: '10px 20px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>See all needs</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: 'var(--terra)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>Scout report</p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.2rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.1, marginBottom: '12px' }}>
          I saw a need elsewhere
        </h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Spotted a real need on WhatsApp, Facebook, or elsewhere? Submit it here and we&apos;ll verify and post it to the Umuganda board.
        </p>
      </div>

      <form action={submitScout} className="space-y-5">
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>What&apos;s the need? *</label>
          <input name="title" required placeholder="e.g. Elderly woman needs help moving furniture in Ericeira" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>More detail</label>
          <textarea name="description" rows={3} placeholder="Any context that would help a volunteer..." style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none', resize: 'none' }} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Area</label>
            <select name="area" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}>
              <option value="">Select area</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Urgency</label>
            <select name="urgency" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}>
              <option value="">Select urgency</option>
              {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '6px' }}>Category</label>
          <select name="category" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '16px', color: 'var(--forest-dark)' }}>Contact details (if known)</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: 'var(--muted)' }}>Their name</label>
              <input name="contact_name" placeholder="First name is fine" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: 'var(--muted)' }}>Their WhatsApp</label>
              <input name="contact_whatsapp" placeholder="+351..." style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: '16px', color: 'var(--forest-dark)' }}>Where did you see this?</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: 'var(--muted)' }}>Platform</label>
              <select name="source_platform" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}>
                <option value="">Select</option>
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '6px', color: 'var(--muted)' }}>Link (if any)</label>
              <input name="source_url" type="url" placeholder="https://..." style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }} />
            </div>
          </div>
        </div>

        <button type="submit" style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '16px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
          className="hover:opacity-90 transition-opacity">
          Submit this need
        </button>
      </form>
    </div>
  )
}
