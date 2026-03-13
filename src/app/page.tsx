import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
          Show up.<br />
          <span className="text-stone-400">For someone who needs it.</span>
        </h1>
        <p className="text-xl text-stone-600 max-w-xl mx-auto mb-4 leading-relaxed">
          In Rwanda, on the last Saturday of every month, everyone stops — rich and poor —
          and gives their time to the community. No obligation. No schedule. Just showing up.
        </p>
        <p className="text-base text-stone-500 max-w-lg mx-auto mb-12">
          This is that, here — Lisbon, Ericeira, Mafra, Sintra and surrounds.
          Find something to do. Or ask for help. No commitment required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/needs"
            className="bg-stone-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-stone-700 transition-colors"
          >
            I want to help
          </Link>
          <Link
            href="/needs/new"
            className="bg-white border border-stone-300 text-stone-800 px-8 py-4 rounded-lg text-lg font-medium hover:border-stone-500 transition-colors"
          >
            I need help
          </Link>
        </div>
      </section>

      <section className="py-16 border-t border-stone-200">
        <h2 className="text-2xl font-semibold mb-10 text-center">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-light text-stone-300 mb-3">01</div>
            <h3 className="font-semibold mb-2">Someone posts a need</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              A person, community or project posts what they need — painting a wall, walking a dog,
              feeding the homeless, building something, showing up for someone.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-stone-300 mb-3">02</div>
            <h3 className="font-semibold mb-2">You see it and offer to help</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Browse open needs nearby. When something resonates, click &ldquo;I can help&rdquo;.
              Your contact goes directly to the person who posted it.
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-light text-stone-300 mb-3">03</div>
            <h3 className="font-semibold mb-2">You show up</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              No formal commitment. No ongoing schedule. You help when you can,
              as much as you want, on your terms.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-stone-200 text-center">
        <p className="text-stone-500 mb-6">Want to be notified when new needs appear near you?</p>
        <Link
          href="/helpers/new"
          className="inline-block border border-stone-300 text-stone-700 px-6 py-3 rounded-lg hover:border-stone-500 transition-colors text-sm"
        >
          Register as a helper
        </Link>
      </section>
    </div>
  )
}
