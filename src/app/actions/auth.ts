'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { authSignUp, authSignIn, createUserRecord } from '@/lib/auth'

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  const data = await authSignUp(email, password, fullName, phone)

  if (data.error) {
    redirect(`/signup?error=${encodeURIComponent(data.error.message ?? 'Sign up failed')}`)
  }

  // If email confirmation is off, we get a session immediately
  if (data.access_token) {
    const cookieStore = await cookies()
    cookieStore.set('sb_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    // Mirror into public.users table
    if (data.user?.id) {
      await createUserRecord(data.user.id, email, fullName, phone)
    }
    redirect('/profile')
  }

  redirect(`/signup/check-email?email=${encodeURIComponent(email)}`)
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirect') as string) || '/profile'

  const data = await authSignIn(email, password)

  if (data.error || !data.access_token) {
    redirect(`/signin?error=${encodeURIComponent(data.error?.message ?? 'Invalid email or password')}`)
  }

  const cookieStore = await cookies()
  cookieStore.set('sb_access_token', data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect(redirectTo)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('sb_access_token')
  redirect('/')
}

async function sendConfirmationEmail(email: string) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'signup', email }),
  })
}

export async function resendConfirmation(email: string) {
  await sendConfirmationEmail(email)
  redirect(`/signup/check-email?email=${encodeURIComponent(email)}&resent=1`)
}

export async function adminResendConfirmation(email: string) {
  await sendConfirmationEmail(email)
  revalidatePath('/admin/users')
}

export async function resendConfirmationToAll() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Fetch all unconfirmed users via admin API
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=1000`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    cache: 'no-store',
  })
  const data = await res.json()
  const users: { id: string; email: string; email_confirmed_at: string | null }[] = data.users ?? []
  const unconfirmed = users.filter(u => !u.email_confirmed_at && u.email)

  // Resend to each — fire sequentially to avoid rate limits
  for (const u of unconfirmed) {
    await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
      method: 'POST',
      headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'signup', email: u.email }),
    })
  }

  revalidatePath('/admin/users')
  redirect(`/admin/users?resent=${unconfirmed.length}`)
}
