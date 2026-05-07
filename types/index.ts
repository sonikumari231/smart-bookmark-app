export interface Bookmark {
  id: string
  user_id: string
  url: string
  title: string
  favicon_url: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string | undefined
  user_metadata: {
    full_name?: string
    avatar_url?: string
  }
}
