import { dbAdminSelect } from '@/lib/supabase/fetch'
import { acceptResponse, declineResponse, markFulfilledAndVerify } from '@/app/actions/admin'
import { Need, HelperResponse } from '@/lib/types'
import { matchToVolunteer, matchToPoster, verifyToPoster, verifyToVolunteer } from '@/lib/whatsapp'
import { notFound } from 'next/navigation'

interface HelperResponseWithStatus extends HelperResponse {
  status: 'pending' | 'accepted' | 'declined'
}

interface Verification {
  id: string
  party: string
  completed_at: string | null
  flagged: boolean | null
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:  { bg: '#fef3d0', color: '#92400e' },
  accepted: { bg: '#e8f4ee', color: '#166534' },
  declined: { bg: '#fee2e2', color: '#991b1b' },
}

export default async function AdminNeedDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [needs, responses, verifications] = await Promise.all([
    dbAdminSelect<Need>('needs', { 'id': `eq.${id}` }),
    dbAdminSelect<HelperResponseWithStatus>('helper_responses', { need_id: `eq.${id}`, order: 'created_at.asc' }),
    dbAdminSelect<Verification>('task_verifications', { need_id: `eq.${id}` }),
  ])

  const need = needs[0]
  if (!need) notFound()

  const acceptedResponse = responses.find(r => r.status === 'accepted')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://umuganda.vercel.app'

  return (
    <div style={{ padding: '40px', maxWidth: '800px' }}>
      <a href="/admin/needs" style={{ color: 'var(--muted)', fontSize: '0.875rem', textDecoration: 'none' }}>← Back to needs</a>

      {/* Need summary */}
      <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', margin: '24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.6rem', fontWeight: 400, color: 'var(--forest-dark)', lineHeight: 1.2 }}>
            {need.title}
          </h1>
          <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '999px', background: '#e8f4ee', color: '#166534', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {need.pipeline}
          </span>
        </div>
        {need.description && <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>{need.description}</p>}
        <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--muted)', flexWrap: 'wrap' }}>
          {need.area && <span>Area: <strong style={{ color: 'var(--forest-dark)' }}>{need.area}</strong></span>}
          {need.urgency && <span>Urgency: <strong style={{ color: 'var(--forest-dark)' }}>{need.urgency}</strong></span>}
          {need.contact_name && <span>Posted by: <strong style={{ color: 'var(--forest-dark)' }}>{need.contact_name}</strong></span>}
          {need.contact_whatsapp && (
            <span>WhatsApp: <a href={`https://wa.me/${need.contact_whatsapp.replace(/\D/g, '')}`} target="_blank" style={{ color: 'var(--forest)', fontWeight: 500 }}>{need.contact_whatsapp}</a></span>
          )}
        </div>

        {/* Mark fulfilled */}
        {need.pipeline !== 'Fulfilled' && need.pipeline !== 'Closed' && acceptedResponse && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <form action={async () => { 'use server'; await markFulfilledAndVerify(need.id) }}>
              <button type="submit" style={{ background: '#166534', color: 'white', border: 'none', borderRadius: '999px', padding: '10px 24px', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                Mark fulfilled + send verification links
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Responses */}
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '16px' }}>
        Volunteers who offered ({responses.length})
      </h2>

      {responses.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
          No one has offered to help yet.
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map(r => {
            const sStyle = STATUS_STYLE[r.status] ?? STATUS_STYLE.pending
            const introVolLink = need.contact_whatsapp && r.helper_whatsapp
              ? matchToVolunteer(
                  { name: r.helper_name, whatsapp: r.helper_whatsapp },
                  { name: need.contact_name ?? 'the poster', whatsapp: need.contact_whatsapp },
                  need.title, need.area ?? ''
                )
              : null
            const introPosterLink = need.contact_whatsapp && r.helper_whatsapp
              ? matchToPoster(
                  { name: need.contact_name ?? 'the poster', whatsapp: need.contact_whatsapp },
                  { name: r.helper_name, whatsapp: r.helper_whatsapp },
                  need.title
                )
              : null

            return (
              <div key={r.id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: 'var(--forest-dark)', marginBottom: '2px' }}>{r.helper_name}</p>
                    {r.helper_whatsapp && <p style={{ color: 'var(--forest)', fontSize: '0.875rem' }}>{r.helper_whatsapp}</p>}
                    {r.helper_email && <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{r.helper_email}</p>}
                  </div>
                  <span style={{ ...sStyle, borderRadius: '999px', fontSize: '0.72rem', padding: '3px 10px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {r.status}
                  </span>
                </div>

                {r.message && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '16px', background: '#fafaf9', padding: '10px 14px', borderRadius: '8px' }}>
                    {r.message}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {/* WhatsApp intro buttons */}
                  {introVolLink && (
                    <a href={introVolLink} target="_blank" style={{ background: '#25D366', color: 'white', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                      Message volunteer on WhatsApp
                    </a>
                  )}
                  {introPosterLink && (
                    <a href={introPosterLink} target="_blank" style={{ background: '#128C7E', color: 'white', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                      Message poster on WhatsApp
                    </a>
                  )}

                  {/* Accept / decline */}
                  {r.status === 'pending' && (
                    <>
                      <form action={async () => { 'use server'; await acceptResponse(r.id, need.id) }}>
                        <button type="submit" style={{ background: '#e8f4ee', color: '#166534', border: '1px solid #86efac', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                          Accept
                        </button>
                      </form>
                      <form action={async () => { 'use server'; await declineResponse(r.id, need.id) }}>
                        <button type="submit" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                          Decline
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Verifications */}
      {verifications.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '16px' }}>
            Verification links
          </h2>
          <div className="space-y-3">
            {verifications.map(v => {
              const verifyUrl = `${baseUrl}/verify/${v.id}`
              const phone = v.party === 'poster' ? need.contact_whatsapp : acceptedResponse?.helper_whatsapp
              const name = v.party === 'poster' ? (need.contact_name ?? 'poster') : (acceptedResponse?.helper_name ?? 'volunteer')
              const waVerifyLink = phone
                ? (v.party === 'poster'
                    ? verifyToPoster(phone, name, need.title, verifyUrl)
                    : verifyToVolunteer(phone, name, need.title, verifyUrl))
                : null

              return (
                <div key={v.id} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '0.875rem', color: 'var(--forest-dark)', marginBottom: '2px' }}>
                      {v.party === 'poster' ? 'Poster verification' : 'Volunteer verification'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                      {v.completed_at ? `Completed ${new Date(v.completed_at).toLocaleDateString('en-GB')}` : 'Not yet completed'}
                      {v.flagged && ' · Flagged'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a href={verifyUrl} target="_blank" style={{ border: '1px solid var(--border)', borderRadius: '999px', padding: '6px 14px', fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'none' }}>
                      View form
                    </a>
                    {waVerifyLink && (
                      <a href={waVerifyLink} target="_blank" style={{ background: '#25D366', color: 'white', borderRadius: '999px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: 500, textDecoration: 'none' }}>
                        Send via WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
