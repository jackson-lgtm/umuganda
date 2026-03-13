const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const adminHeaders = () => ({
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
})

// ── Public (anon key, respects RLS) ──────────────────────────────

export async function dbSelect<T>(table: string, params: Record<string, string> = {}): Promise<T[]> {
  const qs = new URLSearchParams({ select: '*', ...params }).toString()
  const res = await fetch(`${URL}/rest/v1/${table}?${qs}`, { headers, cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function dbCount(table: string, params: Record<string, string> = {}): Promise<number> {
  const qs = new URLSearchParams({ select: 'id', ...params }).toString()
  const res = await fetch(`${URL}/rest/v1/${table}?${qs}`, {
    headers: { ...headers, Prefer: 'count=exact' },
    cache: 'no-store',
  })
  const count = res.headers.get('content-range')?.split('/')[1]
  return parseInt(count ?? '0')
}

export async function dbSelectOne<T>(table: string, params: Record<string, string> = {}): Promise<T | null> {
  const rows = await dbSelect<T>(table, params)
  return (rows[0] as T) ?? null
}

// ── Admin (service role key, bypasses RLS) ───────────────────────

export async function dbAdminSelect<T>(table: string, params: Record<string, string> = {}): Promise<T[]> {
  const qs = new URLSearchParams({ select: '*', ...params }).toString()
  const res = await fetch(`${URL}/rest/v1/${table}?${qs}`, { headers: adminHeaders(), cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function dbAdminCount(table: string, params: Record<string, string> = {}): Promise<number> {
  const qs = new URLSearchParams({ select: 'id', ...params }).toString()
  const res = await fetch(`${URL}/rest/v1/${table}?${qs}`, {
    headers: { ...adminHeaders(), Prefer: 'count=exact' },
    cache: 'no-store',
  })
  const count = res.headers.get('content-range')?.split('/')[1]
  return parseInt(count ?? '0')
}

export async function dbUpdate(table: string, id: string, data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${URL}/rest/v1/${table}?id=eq.${id}`, {
    method: 'PATCH',
    headers: adminHeaders(),
    body: JSON.stringify(data),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(await res.text())
}
