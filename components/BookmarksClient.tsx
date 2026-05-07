'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import BookmarkCard from './BookmarkCard'
import AddBookmarkForm from './AddBookmarkForm'
import { Search, Bookmark, Wifi, WifiOff, Tag } from 'lucide-react'
import type { Bookmark as BookmarkType } from '@/types'

interface BookmarksClientProps {
  initialBookmarks: BookmarkType[]
  userId: string
}

export default function BookmarksClient({ initialBookmarks, userId }: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(initialBookmarks)
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting')
  const [newIds, setNewIds] = useState<Set<string>>(new Set())

  // All tags from bookmarks
  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags || []))
  ).sort()

  // Filtered bookmarks
  const filtered = bookmarks.filter((b) => {
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.url.toLowerCase().includes(search.toLowerCase()) ||
      (b.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchTag = !activeTag || (b.tags || []).includes(activeTag)
    return matchSearch && matchTag
  })

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as BookmarkType
          setBookmarks((prev) => {
            // Avoid duplicates
            if (prev.find((b) => b.id === newBookmark.id)) return prev
            return [newBookmark, ...prev]
          })
          setNewIds((prev) => new Set(prev).add(newBookmark.id))
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev)
              next.delete(newBookmark.id)
              return next
            })
          }, 2000)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected')
        else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') setRealtimeStatus('disconnected')
        else setRealtimeStatus('connecting')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const handleDelete = useCallback((id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const handleAdd = useCallback(() => {
    // Realtime will pick up the new bookmark
  }, [])

  return (
    <div>
      {/* Add form */}
      <AddBookmarkForm onAdd={handleAdd} />

      {/* Search */}
      <div style={{ position: 'relative', marginTop: '12px' }}>
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-dim)',
            pointerEvents: 'none',
          }}
        >
          <Search size={14} />
        </div>
        <input
          type="text"
          placeholder="Search bookmarks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ paddingLeft: '36px' }}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Tags filter */}
      {allTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`tag ${activeTag === tag ? 'active' : ''}`}
              style={{ cursor: 'pointer', background: 'none' }}
            >
              <Tag size={9} style={{ marginRight: '3px' }} />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Realtime status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '16px',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: realtimeStatus === 'connected' ? 'var(--success)' : 'var(--text-dim)',
            fontSize: '11px',
          }}
        >
          {realtimeStatus === 'connected' ? (
            <>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--success)',
                  display: 'inline-block',
                }}
              />
              Live
            </>
          ) : realtimeStatus === 'connecting' ? (
            <>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--text-dim)',
                  display: 'inline-block',
                  animation: 'pulse 1s infinite',
                }}
              />
              Connecting…
            </>
          ) : (
            <>
              <WifiOff size={10} />
              Offline
            </>
          )}
        </div>
        <span style={{ color: 'var(--text-dim)', fontSize: '11px', marginLeft: 'auto' }}>
          {filtered.length} {filtered.length === 1 ? 'bookmark' : 'bookmarks'}
          {(search || activeTag) && bookmarks.length !== filtered.length ? ` of ${bookmarks.length}` : ''}
        </span>
      </div>

      {/* Bookmarks list */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-dim)',
          }}
        >
          {bookmarks.length === 0 ? (
            <>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Bookmark size={20} style={{ color: 'var(--text-dim)' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px' }}>
                No bookmarks yet
              </p>
              <p style={{ fontSize: '13px' }}>Save your first bookmark above to get started.</p>
            </>
          ) : (
            <>
              <Search size={20} style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>No results for "{search || activeTag}"</p>
            </>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((bookmark) => (
            <div
              key={bookmark.id}
              style={{
                transition: 'all 0.3s',
                ...(newIds.has(bookmark.id) ? {
                  boxShadow: '0 0 0 2px var(--accent)',
                  borderRadius: 'var(--radius)',
                } : {}),
              }}
            >
              <BookmarkCard
                bookmark={bookmark}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
