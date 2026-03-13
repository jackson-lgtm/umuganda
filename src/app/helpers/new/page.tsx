import { registerHelper } from '@/app/actions/helpers'
import { AREAS, SKILLS, AVAILABILITY, TIME_OPTIONS, LANGUAGES } from '@/lib/types'

export default function RegisterHelperPage() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <div className="mb-10">
        <p style={{ color: 'var(--forest)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
          Join the community
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.4rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.1, marginBottom: '12px' }}>
          I want to help
        </h1>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
          Register once. We&apos;ll connect you with needs near you when they come up.
          No commitment — you decide when and how you show up.
        </p>
      </div>

      <form action={registerHelper} className="space-y-6">
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
            Your name <span style={{ color: 'var(--terra)' }}>*</span>
          </label>
          <input
            name="name"
            required
            placeholder="First name is fine"
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
              WhatsApp <span style={{ color: 'var(--terra)' }}>*</span>
            </label>
            <input
              name="whatsapp"
              required
              placeholder="+351..."
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
              Email <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
            Where are you based? <span style={{ color: 'var(--terra)' }}>*</span>
          </label>
          <select name="area" required style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
            <option value="">Select area</option>
            {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '10px' }}>
            What can you offer?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map(skill => (
              <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'white' }}>
                <input type="checkbox" name="skills" value={skill} style={{ accentColor: 'var(--forest)' }} />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '10px' }}>
            When are you available?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '10px', background: 'white' }}>
                <input type="checkbox" name="availability" value={a} style={{ accentColor: 'var(--forest)' }} />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
            How much time can you give at once?
          </label>
          <select name="time_per_session" style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.9rem', background: 'white', outline: 'none' }}>
            <option value="">Select</option>
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '10px' }}>
            Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', cursor: 'pointer', padding: '6px 14px', border: '1px solid var(--border)', borderRadius: '999px', background: 'white' }}>
                <input type="checkbox" name="languages" value={lang} style={{ accentColor: 'var(--forest)' }} />
                {lang}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '8px' }}>
            Tell us a bit about yourself <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            name="about"
            rows={3}
            placeholder="Anything that helps match you to the right needs..."
            style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '12px', padding: '12px 16px', fontSize: '0.95rem', background: 'white', outline: 'none', resize: 'none' }}
          />
        </div>

        <button
          type="submit"
          style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '16px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
          className="hover:opacity-90 transition-opacity"
        >
          Register as a helper
        </button>
      </form>
    </div>
  )
}
