'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    redirect('/login?error=oauth_error')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function addBookmark(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const tagsRaw = formData.get('tags') as string
  const tags = tagsRaw
    ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : []

  // Basic URL validation
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
  } catch {
    return { error: 'Invalid URL' }
  }

  // Try to get favicon
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=64`

  const { error } = await supabase.from('bookmarks').insert({
    user_id: user.id,
    url: parsedUrl.toString(),
    title: title.trim() || parsedUrl.hostname,
    favicon_url: faviconUrl,
    tags,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true }
}
