
# Smart Bookmark App

A modern real-time bookmark manager built using Next.js, Supabase, TypeScript, and Tailwind CSS. Users can securely save, organize, search, and manage bookmarks with Google authentication and real-time syncing.

---

## 🚀 Features

- Google OAuth Authentication
- Add and manage bookmarks
- Tag-based organization
- Real-time bookmark updates across tabs
- Search and filter functionality
- Delete bookmarks with confirmation
- Responsive and polished UI
- Secure data access using Supabase RLS
- Auto favicon fetching

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Backend / Database
- Supabase
- PostgreSQL

### Deployment
- Vercel

---

## 📂 Project Setup

### Clone Repository

```bash
git clone https://github.com/sonikumari231/smart-bookmark-app.git
cd smart-bookmark-app
```

### Install Dependencies

```bash
npm install
```

### Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

---

## 🔐 Supabase Authentication & RLS

Google OAuth authentication is implemented using Supabase Auth.

Row Level Security (RLS) is enabled to ensure users can only access their own bookmarks.

### RLS Policies

```sql
CREATE POLICY "Users can view own bookmarks"
ON public.bookmarks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
ON public.bookmarks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
ON public.bookmarks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
ON public.bookmarks
FOR DELETE
USING (auth.uid() = user_id);
```

These policies ensure bookmark access is protected at the database level and cannot be bypassed from the frontend.

---

## ⚡ Real-Time Sync

Supabase Realtime subscriptions are used to instantly sync bookmark changes across tabs and sessions without page refresh.

Realtime subscriptions listen for database changes on the bookmarks table and automatically update the UI when bookmarks are added or deleted.

Subscription cleanup is handled properly on component unmount to avoid memory leaks and duplicate listeners.

---

## 🎁 Bonus Feature

I added a tag-based organization system for bookmarks.

Users can add multiple tags to bookmarks and quickly filter bookmarks by tags. This improves bookmark organization and makes searching faster and more user-friendly without adding unnecessary complexity.

---

## 🐛 Challenges Faced

- Managing Supabase realtime subscriptions without duplicate updates
- Configuring Google OAuth redirect URLs correctly for production deployment
- Preventing duplicate bookmark entries caused by realtime events and UI revalidation
- Implementing secure Row Level Security (RLS) policies correctly

These issues were solved using proper subscription cleanup, event deduplication logic, and verified Supabase RLS policies.

---

## 🔧 One Improvement With More Time

If I had more time, I would build a browser extension for one-click bookmark saving directly from the browser toolbar to improve user experience and reduce friction while saving bookmarks.

---

## 🌐 Deployment

The application is deployed on Vercel and connected with Supabase for authentication, database, and realtime functionality.

---

## 👩‍💻 Author

**Soni Kumari**  
MCA — NIT Jamshedpur  

GitHub: https://github.com/sonikumari231  
LinkedIn: https://www.linkedin.com/in/soni-kumari-0817bb203/
