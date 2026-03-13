import { dbAdminSelect } from '@/lib/supabase/fetch'
import { submitVerification } from '@/app/actions/verify'
import { Need } from '@/lib/types'

interface Verification {
  id: string
  need_id: string
  party: string
  completed_at: string | null
  flagged: boolean | null
}

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ done?: string }>
}) {
  const { id } = await params
  const { done } = await searchParams

  const verifications = await dbAdminSelect<Verification>('task_verifications', { 'id': `eq.${id}` })
  const v = verifications[0]

  if (!v) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Verification not found.</p>
      </div>
    )
  }

  const needs = await dbAdminSelect<Need>('needs', { 'id': `eq.${v.need_id}` })
  const need = needs[0]

  if (done || v.completed_at) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '12px' }}>
            Thank you
          </h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
            Your response has been recorded. Umuganda works because of people like you.
          </p>
          <a href="/needs" style={{ display: 'inline-block', marginTop: '24px', background: 'var(--terra)', color: 'white', borderRadius: '999px', padding: '10px 24px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>
            See more needs
          </a>
        </div>
      </div>
    )
  }

  const isPoster = v.party === 'poster'

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: 'var(--terra)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '8px' }}>
            Task complete
          </p>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.2, marginBottom: '8px' }}>
            How did it go?
          </h1>
          {need && (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Re: <strong style={{ color: 'var(--forest-dark)' }}>{need.title}</strong>
            </p>
          )}
        </div>

        <form action={submitVerification} className="space-y-6">
          <input type="hidden" name="id" value={v.id} />
          <input type="hidden" name="party" value={v.party} />

          {isPoster ? (
            <>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px' }}>
                <p style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '16px' }}>Did the volunteer show up and complete the task?</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', border: '2px solid transparent' }}>
                    <input type="radio" name="volunteer_showed_up" value="yes" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>Yes</span>
                  </label>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer', border: '2px solid transparent' }}>
                    <input type="radio" name="volunteer_showed_up" value="no" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>No</span>
                  </label>
                </div>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px' }}>
                <p style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '16px' }}>Was the task completed safely and as expected?</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                    <input type="radio" name="task_safe_and_genuine" value="yes" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>Yes</span>
                  </label>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                    <input type="radio" name="task_safe_and_genuine" value="no" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>No</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px' }}>
                <p style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '16px' }}>Did you complete the task?</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                    <input type="radio" name="task_completed" value="yes" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>Yes</span>
                  </label>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                    <input type="radio" name="task_completed" value="no" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>No</span>
                  </label>
                </div>
              </div>

              <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px' }}>
                <p style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '16px' }}>Was the task genuine and safe to carry out?</p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                    <input type="radio" name="volunteer_task_safe" value="yes" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>Yes</span>
                  </label>
                  <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f8f7f5', borderRadius: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                    <input type="radio" name="volunteer_task_safe" value="no" required style={{ accentColor: 'var(--terra)' }} />
                    <span style={{ fontWeight: 500 }}>No</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <button type="submit" style={{ width: '100%', background: 'var(--forest)', color: 'white', padding: '16px', borderRadius: '999px', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', border: 'none' }}
            className="hover:opacity-90 transition-opacity">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
