import { registerHelper } from '@/app/actions/helpers'
import { AREAS, SKILLS, AVAILABILITY, TIME_OPTIONS, LANGUAGES } from '@/lib/types'

export default function RegisterHelperPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">I want to help</h1>
        <p className="text-stone-500">
          Register once. We&apos;ll match you with needs near you when they come up.
          No commitment — you decide when and how you show up.
        </p>
      </div>

      <form action={registerHelper} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Your name *</label>
          <input
            name="name"
            required
            placeholder="First name is fine"
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp *</label>
            <input
              name="whatsapp"
              required
              placeholder="+351..."
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Where are you based? *</label>
          <select name="area" required className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white">
            <option value="">Select area</option>
            {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">What can you offer?</label>
          <div className="grid grid-cols-2 gap-2">
            {SKILLS.map(skill => (
              <label key={skill} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="skills" value={skill} className="rounded" />
                {skill}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">When are you available?</label>
          <div className="grid grid-cols-2 gap-2">
            {AVAILABILITY.map(a => (
              <label key={a} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="availability" value={a} className="rounded" />
                {a}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">How much time can you give at once?</label>
          <select name="time_per_session" className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white">
            <option value="">Select</option>
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Languages</label>
          <div className="flex flex-wrap gap-3">
            {LANGUAGES.map(lang => (
              <label key={lang} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="languages" value={lang} className="rounded" />
                {lang}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tell us a bit about yourself (optional)</label>
          <textarea
            name="about"
            rows={3}
            placeholder="Anything that helps match you to the right needs..."
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-700 transition-colors"
        >
          Register as a helper
        </button>
      </form>
    </div>
  )
}
