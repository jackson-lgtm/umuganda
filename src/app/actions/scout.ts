'use server'

import { redirect } from 'next/navigation'
import { dbInsert, dbUpdate, dbAdminSelect } from '@/lib/supabase/fetch'
import { revalidatePath } from 'next/cache'

export async function submitScout(formData: FormData) {
  await dbInsert('scout_submissions', {
    title: formData.get('title') as string,
    description: formData.get('description') as string || null,
    area: formData.get('area') as string || null,
    location: formData.get('location') as string || null,
    category: formData.get('category') as string || null,
    urgency: formData.get('urgency') as string || null,
    contact_name: formData.get('contact_name') as string || null,
    contact_whatsapp: formData.get('contact_whatsapp') as string || null,
    source_url: formData.get('source_url') as string || null,
    source_platform: formData.get('source_platform') as string || null,
  })
  redirect('/scout?submitted=1')
}

export async function promoteScout(id: string) {
  // Read the scout submission
  const rows = await dbAdminSelect<{
    id: string; title: string; description: string | null; area: string | null;
    location: string | null; category: string | null; urgency: string | null;
    contact_name: string | null; contact_whatsapp: string | null;
  }>('scout_submissions', { 'id': `eq.${id}` })

  const s = rows[0]
  if (!s) return

  // Create a live need from it
  const need = await dbInsert<{ id: string }>('needs', {
    title: s.title,
    description: s.description,
    area: s.area,
    location: s.location,
    category: s.category ? [s.category] : [],
    urgency: s.urgency,
    contact_name: s.contact_name,
    contact_whatsapp: s.contact_whatsapp,
    pipeline: 'Open',
    moderation_status: 'live',
  })

  // Mark scout as promoted
  await dbUpdate('scout_submissions', id, { status: 'promoted', promoted_need_id: need.id })

  revalidatePath('/admin/scout')
  revalidatePath('/needs')
}

export async function rejectScout(id: string) {
  await dbUpdate('scout_submissions', id, { status: 'rejected' })
  revalidatePath('/admin/scout')
}
