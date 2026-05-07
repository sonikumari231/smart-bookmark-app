'use client'

import { useState } from 'react'
import { Trash2, ExternalLink, Tag } from 'lucide-react'
import { deleteBookmark } from '@/app/actions'
import type { Bookmark } from '@/types'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const result = await deleteBookmark(bookmark.id)
    if (result.success) {
      onDelete(bookmark.id)
    }
    setDeleting(false)
    setShowConfirm(false)
  }

  const domain = (() => {
    try {
      return new URL(bookmark.url).hostname.replace('www.', '')
    } catch {
      return bookmark.url
    }
  })()

  const timeAgo = (() => {
    const diff = Date.now() - new Date(bookmark.created_at).getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(bookmark.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })()

  return (
    <div
      className="card animate-in"
      style={{
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        transition: 'border-color 0.15s, transform 0.15s',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-hover)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)'
      }}
    >
      {/* Favicon */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '9px',
          background: 'var(--bg-3)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {bookmark.favicon_url ? (
          <img
            src={bookmark.favicon_url}
            alt=""
            width={20}
            height={20}
            style={{ objectFit: 'contain' }}
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <span style={{ color: 'var(--text-dim)', fontSize: '12px', fontWeight: 600 }}>
            {domain[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--text)',
                fontWeight: 500,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                lineHeight: '1.3',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--accent)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--text)')}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bookmark.title}
              </span>
              <ExternalLink size={11} style={{ flexShrink: 0, opacity: 0.5 }} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {domain}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>·</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '12px', flexShrink: 0 }}>{timeAgo}</span>
            </div>
          </div>

          {/* Delete button */}
          {!showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn btn-ghost"
              style={{ padding: '6px', border: 'none', opacity: 0.4 }}
              title="Delete bookmark"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
            {bookmark.tags.map((tag) => (
              <span key={tag} className="tag" style={{ fontSize: '10px', padding: '1px 8px' }}>
                <Tag size={8} style={{ marginRight: '3px' }} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Delete confirmation */}
        {showConfirm && (
          <div
            className="animate-scale-in"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '10px',
              background: 'rgba(224,90,90,0.06)',
              border: '1px solid rgba(224,90,90,0.15)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 12px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', flex: 1 }}>
              Delete this bookmark?
            </span>
            <button
              onClick={() => setShowConfirm(false)}
              className="btn btn-ghost"
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-danger"
              style={{ padding: '4px 10px', fontSize: '12px' }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
