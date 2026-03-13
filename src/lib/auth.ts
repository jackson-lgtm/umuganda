import { cookies } from 'next/headers'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
    phone?: string
  }
}

export async function getUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb_access_token')?.value
  if (!token) return null

  try {
    const res = await fetch(`${URL}/auth/v1/user`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function authSignUp(email: string, password: string, fullName: string, phone: string) {
  const res = await fetch(`${URL}/auth/v1/signup`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, data: { full_name: fullName, phone } }),
  })
  return res.json()
}

export async function authSignIn(email: string, password: string) {
  const res = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: ANON_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function createUserRecord(id: string, email: string, fullName: string, phone: string) {
  await fetch(`${URL}/rest/v1/users`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ id, email, full_name: fullName, phone }),
  })
}
