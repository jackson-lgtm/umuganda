'use server'

import { createServiceClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function registerHelper(formData: FormData) {
  const supabase = await createServiceClient()

  const skills = formData.getAll('skills') as string[]
  const availability = formData.getAll('availability') as string[]
  const languages = formData.getAll('languages') as string[]

  const { error } = await supabase.from('helpers').insert({
    name: formData.get('name') as string,
    whatsapp: formData.get('whatsapp') as string,
    email: formData.get('email') as string,
    area: formData.get('area') as string,
    skills,
    availability,
    time_per_session: formData.get('time_per_session') as string,
    languages,
    about: formData.get('about') as string,
    pipeline: 'Active',
  })

  if (error) throw new Error(error.message)

  redirect('/needs?registered=1')
}
