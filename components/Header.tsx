'use client'

import { signOut } from '@/app/actions'
import { LogOut } from 'lucide-react'

interface HeaderProps {
  userName: string
  avatarUrl?: string
  email?: string
}

export default function Header({ userName, avatarUrl, email }: HeaderProps) {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(12,12,14,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          padding: '0 20px',
          height: '58px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              background: 'var(--accent)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1z" fill="#0c0c0e" />
            </svg>
          </div>
          <span className="font-display" style={{ fontSize: '18px', color: 'var(--text)', letterSpacing: '-0.3px' }}>
            Markd
          </span>
        </div>

        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={userName}
                width={28}
                height={28}
                style={{ borderRadius: '50%', border: '1px solid var(--border)' }}
              />
            ) : (
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {userName[0]?.toUpperCase()}
              </div>
            )}
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                maxWidth: '140px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {userName}
            </span>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="btn btn-ghost"
              style={{ padding: '6px 10px', fontSize: '12px', gap: '5px' }}
              title="Sign out"
            >
              <LogOut size={13} />
              <span style={{ display: 'none' }}>Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
