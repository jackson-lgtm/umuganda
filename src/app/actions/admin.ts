'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { dbUpdate } from '@/lib/supabase/fetch'

export async function adminLogin(formData: FormData) {
  const password = formData.get('password') as string
  const correct = process.env.ADMIN_PASSWORD

  if (!correct || password !== correct) {
    redirect('/admin/login?error=1')
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_token', password, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  redirect('/admin')
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
  redirect('/admin/login')
}

export async function updateNeedPipeline(id: string, pipeline: string) {
  await dbUpdate('needs', id, { pipeline })
  revalidatePath('/admin/needs')
  revalidatePath('/needs')
}

export async function updateNeedModeration(id: string, moderation_status: string, moderation_note?: string) {
  await dbUpdate('needs', id, { moderation_status, moderation_note: moderation_note ?? null })
  revalidatePath('/admin/needs')
  revalidatePath('/needs')
}

export async function updateHelperPipeline(id: string, pipeline: string) {
  await dbUpdate('helpers', id, { pipeline })
  revalidatePath('/admin/helpers')
}

export async function updateHelperModeration(id: string, moderation_status: string, moderation_note?: string) {
  await dbUpdate('helpers', id, { moderation_status, moderation_note: moderation_note ?? null })
  revalidatePath('/admin/helpers')
}
