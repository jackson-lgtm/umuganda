import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const DOC_TYPES = [
  { value: 'identity', label: 'Identity document', desc: 'Passport or national ID' },
  { value: 'working_with_children', label: 'Working with Children check', desc: 'Required for childcare / youth tasks' },
  { value: 'medical', label: 'Medical qualification', desc: 'Required for health / care tasks' },
  { value: 'trade_licence', label: 'Trade licence', desc: 'Electrical, plumbing, construction etc.' },
]

async function uploadDocument(formData: FormData) {
  'use server'

  const { getUser: getUserFn } = await import('@/lib/auth')
  const user = await getUserFn()
  if (!user) redirect('/signin')

  const file = formData.get('file') as File
  const docType = formData.get('doc_type') as string

  if (!file || file.size === 0) redirect('/profile/documents?error=no-file')

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const path = `${user.id}/${docType}/${Date.now()}-${file.name}`
  const bytes = await file.arrayBuffer()

  const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/documents/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': file.type },
    body: bytes,
  })

  if (!uploadRes.ok) redirect('/profile/documents?error=upload-failed')

  // Record in user_documents table
  await fetch(`${SUPABASE_URL}/rest/v1/user_documents`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ user_id: user.id, document_type: docType, file_url: path }),
  })

  revalidatePath('/profile/documents')
  redirect('/profile/documents?uploaded=1')
}

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ uploaded?: string; error?: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/signin?redirect=/profile/documents')

  const { uploaded, error } = await searchParams

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <a href="/profile" style={{ color: 'var(--muted)', fontSize: '0.875rem' }} className="hover:opacity-70 inline-flex items-center gap-1 mb-8">
        ← Back to profile
      </a>

      <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '8px' }}>
        Verification documents
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '32px' }}>
        Some task types require verified credentials. Upload them here and we&apos;ll review within 48 hours.
      </p>

      {uploaded && (
        <div style={{ background: '#e8f4ee', border: '1px solid #86efac', borderRadius: '12px', color: '#166534', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '24px' }}>
          Document uploaded. We&apos;ll review it within 48 hours.
        </div>
      )}
      {error && (
        <div style={{ background: '#fde8e8', border: '1px solid #fca5a5', borderRadius: '12px', color: '#b91c1c', padding: '12px 16px', fontSize: '0.875rem', marginBottom: '24px' }}>
          {error === 'no-file' ? 'Please select a file.' : 'Upload failed. Please try again.'}
        </div>
      )}

      <div className="space-y-4">
        {DOC_TYPES.map(doc => (
          <div key={doc.value} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '20px 24px' }}>
            <div style={{ marginBottom: '12px' }}>
              <p style={{ fontWeight: 500, color: 'var(--forest-dark)', marginBottom: '2px' }}>{doc.label}</p>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{doc.desc}</p>
            </div>
            <form action={uploadDocument} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input type="hidden" name="doc_type" value={doc.value} />
              <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" required
                style={{ fontSize: '0.8rem', color: 'var(--muted)', flex: 1, minWidth: '200px' }} />
              <button type="submit" style={{ background: 'var(--terra)', color: 'white', border: 'none', borderRadius: '999px', padding: '8px 18px', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Upload
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  )
}
