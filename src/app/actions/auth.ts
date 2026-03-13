'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

  redirect('/signin?message=Check+your+email+to+confirm+your+account')
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
