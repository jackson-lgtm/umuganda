'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const type = params.get('type') // 'signup' | 'recovery' | etc.

    if (!accessToken) {
      setStatus('error')
      return
    }

    fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: accessToken }),
    }).then(res => {
      if (res.ok) {
        // New signup → go to profile, recovery → go to reset-password
        router.replace(type === 'recovery' ? '/reset-password' : '/profile?welcome=1')
      } else {
        setStatus('error')
      }
    }).catch(() => setStatus('error'))
  }, [router])

  if (status === 'error') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.8rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '12px' }}>
            Something went wrong
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
            This confirmation link may have expired. Try signing in — if your email is already confirmed it will work.
          </p>
          <a href="/signin" style={{ background: 'var(--forest)', color: 'white', borderRadius: '999px', padding: '12px 28px', fontSize: '0.9rem', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'Fraunces, serif', fontSize: '1.4rem', fontWeight: 400, color: 'var(--forest-dark)', marginBottom: '8px' }}>
          Confirming your account...
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>You&apos;ll be signed in in a moment.</p>
      </div>
    </div>
  )
}
