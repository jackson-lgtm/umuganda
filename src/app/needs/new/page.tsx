import { submitNeed } from '@/app/actions/needs'
import { AREAS, CATEGORIES, URGENCY_OPTIONS, TIME_OPTIONS } from '@/lib/types'

export default function SubmitNeedPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-10">
        <p style={{ color: 'var(--terra)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
          Ask for help
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.1, marginBottom: '12px' }}>
          Post a need
        </h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Tell us what&apos;s needed. Someone nearby will see it and reach out.
          No need is too small or too large.
        </p>
      </div>

      <form action={submitNeed} className="space-y-6">
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
            What&apos;s needed? <span style={{ color: 'var(--terra)' }}>*</span>
          </label>
          <input
            name="title"
            required
            placeholder="e.g. Help painting the walls for an elderly neighbour in Ericeira"
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
            Describe the need
          </label>
          <textarea
            name="description"
            rows={4}
            placeholder="More detail helps the right person show up. What exactly needs doing? Any context that&apos;s useful?"
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none', resize: 'none' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '10px', color: 'var(--warm-text)' }}>
            Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'white' }}>
                <input type="checkbox" name="category" value={cat} style={{ accentColor: 'var(--forest)' }} />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
              Area <span style={{ color: 'var(--terra)' }}>*</span>
            </label>
            <select name="area" required style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
              <option value="">Select area</option>
              {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
              Urgency
            </label>
            <select name="urgency" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
              <option value="">Select urgency</option>
              {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
            Specific location / address
          </label>
          <input
            name="location"
            placeholder="Street, neighbourhood, or landmark"
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
              Time required
            </label>
            <select name="time_required" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
              <option value="">Select</option>
              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
              Helpers needed
            </label>
            <input
              name="helpers_needed"
              type="number"
              min="1"
              defaultValue="1"
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.2rem', fontWeight: 400, marginBottom: '16px', color: 'var(--forest-dark)' }}>Your contact details</h2>
          <div className="space-y-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
                Your name <span style={{ color: 'var(--terra)' }}>*</span>
              </label>
              <input
                name="contact_name"
                required
                placeholder="First name is fine"
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
                WhatsApp number <span style={{ color: 'var(--terra)' }}>*</span>
              </label>
              <input
                name="contact_whatsapp"
                required
                placeholder="+351..."
                style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px', color: 'var(--warm-text)' }}>
                Submitting for
              </label>
              <select name="submitted_by" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
                <option value="Self">Myself</option>
                <option value="On behalf of someone">On behalf of someone else</option>
                <option value="Organisation">Organisation / community</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '16px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
          className="hover:opacity-90 transition-opacity"
        >
          Post this need
        </button>
      </form>
    </div>
  )
}
