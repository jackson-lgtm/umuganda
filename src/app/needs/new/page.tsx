import { submitNeed } from '@/app/actions/needs'
import { AREAS, CATEGORIES, URGENCY_OPTIONS, TIME_OPTIONS } from '@/lib/types'

export default function SubmitNeedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Post a need</h1>
        <p className="text-stone-500">Tell us what&apos;s needed. Someone nearby will see it and reach out.</p>
      </div>

      <form action={submitNeed} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">What&apos;s needed? *</label>
          <input
            name="title"
            required
            placeholder="e.g. Help painting the walls for an elderly neighbour"
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Describe the need</label>
          <textarea
            name="description"
            rows={4}
            placeholder="More detail helps the right person show up. What exactly needs doing? Any context?"
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" name="category" value={cat} className="rounded" />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Area *</label>
            <select name="area" required className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white">
              <option value="">Select area</option>
              {AREAS.map(area => <option key={area} value={area}>{area}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Urgency</label>
            <select name="urgency" className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white">
              <option value="">Select urgency</option>
              {URGENCY_OPTIONS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Specific location / address</label>
          <input
            name="location"
            placeholder="Street, neighbourhood, or landmark"
            className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Time required</label>
            <select name="time_required" className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white">
              <option value="">Select</option>
              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Helpers needed</label>
            <input
              name="helpers_needed"
              type="number"
              min="1"
              defaultValue="1"
              className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
            />
          </div>
        </div>

        <div className="border-t border-stone-200 pt-6">
          <h2 className="font-medium mb-4">Your contact details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your name *</label>
              <input
                name="contact_name"
                required
                placeholder="First name is fine"
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">WhatsApp number *</label>
              <input
                name="contact_whatsapp"
                required
                placeholder="+351..."
                className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Submitting for</label>
              <select name="submitted_by" className="w-full border border-stone-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-stone-500 bg-white">
                <option value="Self">Myself</option>
                <option value="On behalf of someone">On behalf of someone else</option>
                <option value="Organisation">Organisation / community</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-stone-900 text-white py-4 rounded-lg font-medium hover:bg-stone-700 transition-colors"
        >
          Post this need
        </button>
      </form>
    </div>
  )
}
