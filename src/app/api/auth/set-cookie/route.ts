import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const { access_token } = await req.json()

  if (!access_token || typeof access_token !== 'string') {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 })
  }

  // Verify the token is valid before setting cookie
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${access_token}` },
  })

  if (!userRes.ok) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const user = await userRes.json()

  // Ensure public.users record exists (may not if they confirmed email)
  if (user?.id) {
    await fetch(`${SUPABASE_URL}/rest/v1/users?id=eq.${user.id}`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
    }).then(async existing => {
      const rows = await existing.json()
      if (!rows || rows.length === 0) {
        // Create the public user record if missing
        await fetch(`${SUPABASE_URL}/rest/v1/users`, {
          method: 'POST',
          headers: {
            apikey: SERVICE_KEY,
            Authorization: `Bearer ${SERVICE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name ?? null,
            phone: user.user_metadata?.phone ?? null,
          }),
        })
      }
    }).catch(() => {}) // Non-fatal
  }

  const cookieStore = await cookies()
  cookieStore.set('sb_access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
