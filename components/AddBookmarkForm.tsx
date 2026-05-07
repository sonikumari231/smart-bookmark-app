'use client'

import { useState, useRef } from 'react'
import { Plus, Link2, Type, Tag, Loader2, X } from 'lucide-react'
import { addBookmark } from '@/app/actions'

interface AddBookmarkFormProps {
  onAdd: () => void
}

export default function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await addBookmark(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      formRef.current?.reset()
      onAdd()
      setTimeout(() => {
        setSuccess(false)
        setExpanded(false)
      }, 1200)
      setLoading(false)
    }
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '14px' }}
      >
        <Plus size={16} />
        Add Bookmark
      </button>
    )
  }

  return (
    <div
      className="card animate-scale-in"
      style={{ padding: '20px', border: '1px solid var(--border-hover)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>New Bookmark</h3>
        <button
          onClick={() => { setExpanded(false); setError('') }}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={16} />
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* URL */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }}>
              <Link2 size={14} />
            </div>
            <input
              name="url"
              type="text"
              placeholder="https://example.com"
              className="input"
              style={{ paddingLeft: '36px' }}
              required
              autoFocus
            />
          </div>

          {/* Title */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }}>
              <Type size={14} />
            </div>
            <input
              name="title"
              type="text"
              placeholder="Title (optional)"
              className="input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Tags */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }}>
              <Tag size={14} />
            </div>
            <input
              name="tags"
              type="text"
              placeholder="Tags: design, dev, tools (comma separated)"
              className="input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '13px', margin: 0 }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => { setExpanded(false); setError('') }}
              className="btn btn-ghost"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              {loading ? (
                <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</>
              ) : success ? (
                '✓ Saved!'
              ) : (
                'Save Bookmark'
              )}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
