'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitNeed(formData: FormData) {
  const supabase = await createServiceClient()

  const category = formData.getAll('category') as string[]

  const { error } = await supabase.from('needs').insert({
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category,
    area: formData.get('area') as string,
    location: formData.get('location') as string,
    urgency: formData.get('urgency') as string,
    helpers_needed: parseInt(formData.get('helpers_needed') as string) || 1,
    time_required: formData.get('time_required') as string,
    contact_name: formData.get('contact_name') as string,
    contact_whatsapp: formData.get('contact_whatsapp') as string,
    submitted_by: formData.get('submitted_by') as string,
    pipeline: 'Open',
  })

  if (error) throw new Error(error.message)

  revalidatePath('/needs')
  redirect('/needs?submitted=1')
}

export async function respondToNeed(formData: FormData) {
  const supabase = await createServiceClient()

  const needId = formData.get('need_id') as string
  const helperName = formData.get('helper_name') as string
  const helperWhatsapp = formData.get('helper_whatsapp') as string
  const helperEmail = formData.get('helper_email') as string
  const message = formData.get('message') as string

  const { error } = await supabase.from('helper_responses').insert({
    need_id: needId,
    helper_name: helperName,
    helper_whatsapp: helperWhatsapp,
    helper_email: helperEmail,
    message,
  })

  if (error) throw new Error(error.message)

  // Get the need to notify the poster
  const { data: need } = await supabase
    .from('needs')
    .select('title, contact_name, contact_whatsapp')
    .eq('id', needId)
    .single()

  // Send email notification if Resend is configured
  if (process.env.RESEND_API_KEY && need) {
    try {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@umuganda.org',
        to: process.env.ADMIN_EMAIL!,
        subject: `New helper for: ${need.title}`,
        text: `
${helperName} wants to help with: ${need.title}

WhatsApp: ${helperWhatsapp || 'not provided'}
Email: ${helperEmail || 'not provided'}
Message: ${message || 'none'}

Contact the poster (${need.contact_name}): ${need.contact_whatsapp}
        `.trim(),
      })
    } catch (e) {
      // Email failure shouldn't block the response
      console.error('Email error:', e)
    }
  }

  revalidatePath(`/needs/${needId}`)
  redirect(`/needs/${needId}?helped=1`)
}
