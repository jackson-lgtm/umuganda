'use server'

import { redirect } from 'next/navigation'
import { dbUpdate, dbAdminSelect } from '@/lib/supabase/fetch'
import { revalidatePath } from 'next/cache'

interface Verification {
  id: string
  need_id: string
  party: string
  completed_at: string | null
}

export async function submitVerification(formData: FormData) {
  const id = formData.get('id') as string
  const party = formData.get('party') as string

  const updates: Record<string, unknown> = { completed_at: new Date().toISOString() }

  if (party === 'poster') {
    updates.volunteer_showed_up = formData.get('volunteer_showed_up') === 'yes'
    updates.task_safe_and_genuine = formData.get('task_safe_and_genuine') === 'yes'
    updates.flagged = formData.get('volunteer_showed_up') !== 'yes' || formData.get('task_safe_and_genuine') !== 'yes'
  } else {
    updates.task_completed = formData.get('task_completed') === 'yes'
    updates.volunteer_task_safe = formData.get('volunteer_task_safe') === 'yes'
    updates.flagged = formData.get('task_completed') !== 'yes' || formData.get('volunteer_task_safe') !== 'yes'
  }

  await dbUpdate('task_verifications', id, updates)
  revalidatePath('/admin/flags')

  redirect(`/verify/${id}?done=1`)
}

export async function createVerifications(needId: string, helperResponseId: string) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Create two verification records — one for poster, one for volunteer
  await fetch(`${SUPABASE_URL}/rest/v1/task_verifications`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify([
      { need_id: needId, helper_response_id: helperResponseId, party: 'poster' },
      { need_id: needId, helper_response_id: helperResponseId, party: 'volunteer' },
    ]),
  })

  revalidatePath('/admin/flags')
}
