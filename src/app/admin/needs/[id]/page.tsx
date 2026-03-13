import { dbAdminSelect } from '@/lib/supabase/fetch'
import { acceptResponse, declineResponse, markFulfilledAndVerify, unassignNeed } from '@/app/actions/admin'
import { Need, Helper, HelperResponse } from '@/lib/types'
import {
  matchToVolunteer, matchToPoster,
  verifyToPoster, verifyToVolunteer,
  indirectMatchSameArea, indirectMatchSameSkill,
  relevantSkillsForNeed,
} from '@/lib/whatsapp'
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

  const [needs, responses, verifications, allHelpers] = await Promise.all([
    dbAdminSelect<Need>('needs', { 'id': `eq.${id}` }),
    dbAdminSelect<HelperResponseWithStatus>('helper_responses', { need_id: `eq.${id}`, order: 'created_at.asc' }),
    dbAdminSelect<Verification>('task_verifications', { need_id: `eq.${id}` }),
    dbAdminSelect<Helper>('helpers', { pipeline: 'eq.Active', moderation_status: 'eq.live', order: 'created_at.desc' }),
  ])

  const need = needs[0]
  if (!need) notFound()

  const acceptedResponse = responses.find(r => r.status === 'accepted')
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://umuganda.vercel.app'

  // ── Smart pairing ────────────────────────────────────────────
  const relevantSkills = relevantSkillsForNeed(need.category ?? [])
  const respondedWhatsapps = new Set(responses.map(r => r.helper_whatsapp))

  const directMatches: Helper[] = []
  const indirectSameArea: Helper[] = []
  const indirectSameSkill: Helper[] = []

  for (const h of allHelpers) {
    if (!h.whatsapp) continue
    const areaMatch = h.area === need.area
    const skillMatch = relevantSkills.length === 0 || h.skills.some(s => relevantSkills.includes(s))

    if (areaMatch && skillMatch) directMatches.push(h)
    else if (areaMatch && !skillMatch) indirectSameArea.push(h)
    else if (!areaMatch && skillMatch) indirectSameSkill.push(h)
  }

  return (
    <div style={{ padding: '40px', maxWidth: '860px' }}>
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
          {need.category?.length > 0 && <span>Category: <strong style={{ color: 'var(--forest-dark)' }}>{need.category.join(', ')}</strong></span>}
          {need.contact_name && <span>Posted by: <strong style={{ color: 'var(--forest-dark)' }}>{need.contact_name}</strong></span>}
          {need.contact_whatsapp && (
            <span>WhatsApp: <a href={`https://wa.me/${need.contact_whatsapp.replace(/\D/g, '')}`} target="_blank" style={{ color: 'var(--forest)', fontWeight: 500 }}>{need.contact_whatsapp}</a></span>
          )}
        </div>

        {/* Pipeline actions */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {need.pipeline === 'Helper assigned' && (
            <form action={async () => { 'use server'; await unassignNeed(need.id) }}>
              <button type="submit" style={{ background: 'white', color: '#1e40af', border: '1px solid #93c5fd', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                ↩ Unassign helper
              </button>
            </form>
          )}
          {need.pipeline !== 'Fulfilled' && need.pipeline !== 'Closed' && acceptedResponse && (
            <form action={async () => { 'use server'; await markFulfilledAndVerify(need.id) }}>
              <button type="submit" style={{ background: '#166534', color: 'white', border: 'none', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>
                Mark fulfilled + send verification
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Smart pairing */}
      {(directMatches.length > 0 || indirectSameArea.length > 0 || indirectSameSkill.length > 0) && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '4px' }}>
            Suggested volunteers
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '20px' }}>
            Tap a WhatsApp button to reach out. Direct matches are same area + matching skills. Indirect are one degree away.
          </p>

          {directMatches.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: '#e8f4ee', color: '#166534', borderRadius: '999px', fontSize: '0.7rem', padding: '3px 10px', fontWeight: 600 }}>Direct match</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Same area + matching skills</span>
              </div>
              <div className="space-y-3">
                {directMatches.slice(0, 5).map(h => (
                  <HelperCard key={h.id} helper={h} need={need} type="direct" hasHelped={respondedWhatsapps.has(h.whatsapp)} />
                ))}
              </div>
            </div>
          )}

          {indirectSameArea.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: '#fef3d0', color: '#92400e', borderRadius: '999px', fontSize: '0.7rem', padding: '3px 10px', fontWeight: 600 }}>Indirect — same area</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>In {need.area}, different skills</span>
              </div>
              <div className="space-y-3">
                {indirectSameArea.slice(0, 3).map(h => (
                  <HelperCard key={h.id} helper={h} need={need} type="indirect-area" hasHelped={respondedWhatsapps.has(h.whatsapp)} />
                ))}
              </div>
            </div>
          )}

          {indirectSameSkill.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ background: '#e0effe', color: '#1e40af', borderRadius: '999px', fontSize: '0.7rem', padding: '3px 10px', fontWeight: 600 }}>Indirect — matching skills</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Right skills, different area</span>
              </div>
              <div className="space-y-3">
                {indirectSameSkill.slice(0, 3).map(h => (
                  <HelperCard key={h.id} helper={h} need={need} type="indirect-skill" hasHelped={respondedWhatsapps.has(h.whatsapp)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Responses (people who already offered) */}
      <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.3rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '16px' }}>
        Who offered to help ({responses.length})
      </h2>

      {responses.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '40px' }}>
          No one has offered yet — use the suggested volunteers above to reach out proactively.
        </div>
      ) : (
        <div className="space-y-4" style={{ marginBottom: '40px' }}>
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
                  {introVolLink && (
                    <a href={introVolLink} target="_blank" style={{ background: '#25D366', color: 'white', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                      Message volunteer
                    </a>
                  )}
                  {introPosterLink && (
                    <a href={introPosterLink} target="_blank" style={{ background: '#128C7E', color: 'white', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none' }}>
                      Message poster
                    </a>
                  )}
                  {r.status === 'pending' && (
                    <>
                      <form action={async () => { 'use server'; await acceptResponse(r.id, need.id) }}>
                        <button type="submit" style={{ background: '#e8f4ee', color: '#166534', border: '1px solid #86efac', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Accept</button>
                      </form>
                      <form action={async () => { 'use server'; await declineResponse(r.id, need.id) }}>
                        <button type="submit" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer' }}>Decline</button>
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
        <div>
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
                  <div style={{ display: 'flex', gap: '8px' }}>
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

function HelperCard({ helper, need, type, hasHelped }: { helper: Helper; need: Need; type: 'direct' | 'indirect-area' | 'indirect-skill'; hasHelped?: boolean }) {
  const waLink = type === 'direct' && need.contact_whatsapp
    ? matchToVolunteer(
        { name: helper.name, whatsapp: helper.whatsapp! },
        { name: need.contact_name ?? 'the poster', whatsapp: need.contact_whatsapp },
        need.title, need.area ?? ''
      )
    : type === 'indirect-area'
    ? indirectMatchSameArea(
        { name: helper.name, whatsapp: helper.whatsapp!, skills: helper.skills },
        need.title, need.area ?? ''
      )
    : indirectMatchSameSkill(
        { name: helper.name, whatsapp: helper.whatsapp!, area: helper.area ?? '' },
        need.title, need.area ?? ''
      )

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <p style={{ fontWeight: 500, color: 'var(--forest-dark)', fontSize: '0.9rem' }}>{helper.name}</p>
          {hasHelped && (
            <span style={{ background: '#f3e8ff', color: '#6b21a8', borderRadius: '999px', fontSize: '0.65rem', padding: '2px 8px', fontWeight: 600 }}>
              helped before
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {helper.area && (
            <span style={{ fontSize: '0.72rem', color: helper.area === need.area ? '#166534' : 'var(--muted)', background: helper.area === need.area ? '#e8f4ee' : '#f3f4f6', borderRadius: '999px', padding: '2px 8px' }}>
              {helper.area}
            </span>
          )}
          {helper.skills.slice(0, 3).map(s => (
            <span key={s} style={{ fontSize: '0.72rem', color: '#92400e', background: 'var(--amber-light)', borderRadius: '999px', padding: '2px 8px' }}>{s}</span>
          ))}
          {helper.whatsapp && <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{helper.whatsapp}</span>}
        </div>
      </div>
      {helper.whatsapp && (
        <a href={waLink} target="_blank" style={{ background: '#25D366', color: 'white', borderRadius: '999px', padding: '8px 16px', fontSize: '0.8rem', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Message on WhatsApp
        </a>
      )}
    </div>
  )
}
