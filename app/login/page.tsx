import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignInButton from './GoogleSignInButton'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const params = await searchParams

  if (user) redirect('/')

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(232,213,176,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="animate-scale-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-10">
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', background: 'var(--accent)', borderRadius: '14px', marginBottom: '20px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="#0c0c0e" />
            </svg>
          </div>
          <h1 className="font-display" style={{ fontSize: '32px', color: 'var(--text)', marginBottom: '8px', letterSpacing: '-0.5px' }}>Markd</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Your bookmarks, beautifully organized.</p>
        </div>

        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px', color: 'var(--text)' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>Sign in to access your bookmarks</p>

          {params.error && (
            <div style={{ background: 'rgba(224,90,90,0.1)', border: '1px solid rgba(224,90,90,0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '13px', padding: '10px 14px', marginBottom: '16px' }}>
              Authentication failed. Please try again.
            </div>
          )}

          <GoogleSignInButton />

          <p style={{ color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center', marginTop: '20px', lineHeight: '1.5' }}>
            By signing in, you agree to keep your bookmarks private and secure.
          </p>
        </div>

        <p style={{ color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center', marginTop: '24px' }}>Real-time sync across all your tabs.</p>
      </div>
    </div>
  )
}