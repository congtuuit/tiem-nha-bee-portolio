# Phase 2: Auth - Supabase Auth to NextAuth.js

## Thay the
- @supabase/ssr -> next-auth (Auth.js) beta
- Credentials provider (email + password)
- Session strategy: JWT

## Files moi

### lib/auth/auth.ts
NextAuth config voi Credentials provider, dung prisma.admin_users de verify.

### app/api/auth/[...nextauth]/route.ts
export const { GET, POST } = handlers

### lib/auth/session.ts
Helpers: requireAdmin(), getOptionalSession()

## Files sua

### app/(admin)/layout.tsx
- Import auth, signOut tu @/lib/auth/auth
- session = await auth() thay vi supabase.auth.getUser()
- signOut() thay vi supabase.auth.signOut()
- Xoa import tu @/lib/supabase/server

### app/(admin)/admin/login/page.tsx
- Import signIn tu next-auth/react
- signIn("credentials", { email, password, redirect: false })
- Xoa import tu @/lib/supabase/client

## Seed admin
prisma/seed.ts dung bcryptjs de hash password, upsert admin_users.
