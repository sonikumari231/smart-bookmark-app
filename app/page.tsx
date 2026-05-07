import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import BookmarksClient from '@/components/BookmarksClient'
import type { Bookmark } from '@/types'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header
        userName={userName}
        avatarUrl={user.user_metadata?.avatar_url}
        email={user.email}
      />

      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 80px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1
            className="font-display"
            style={{
              fontSize: '28px',
              color: 'var(--text)',
              letterSpacing: '-0.5px',
              marginBottom: '6px',
              lineHeight: 1.2,
            }}
          >
            Your Bookmarks
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Saved links, organized and synced in real-time.
          </p>
        </div>

        <BookmarksClient
          initialBookmarks={(bookmarks as Bookmark[]) || []}
          userId={user.id}
        />
      </main>
    </div>
  )
}
