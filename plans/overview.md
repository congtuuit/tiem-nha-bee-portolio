# Kế Hoạch Migration: Supabase -> Turso (SQLite) + NextAuth.js

## Tổng quan

Chuyển dự án **Tiệm Nhà Bee Portfolio** khỏi Supabase (PostgreSQL + Auth)
sang **Turso (SQLite-compatible edge database) + NextAuth.js (Auth.js)**
để deploy lên Vercel mà không phụ thuộc vào Supabase.

## Kiến trúc hiện tại

- **Database**: Prisma ORM + PostgreSQL (Supabase connection pool)
- **Auth**: Supabase Auth (@supabase/ssr) - server + browser client
- **File storage**: Cloudflare R2 (giữ nguyên, không ảnh hưởng)

## Kiến trúc mục tiêu

- **Database**: Prisma ORM + Turso (libsql/SQLite edge database)
- **Auth**: NextAuth.js (Auth.js) với Credentials provider
- **File storage**: Cloudflare R2 (giữ nguyên)

## Danh sách files thay đổi theo phase

### Phase 1 - Database (4 files)
| File | Action |
|------|--------|
| prisma/schema.prisma | provider + types |
| lib/prisma.ts | Them JSON helpers |
| package.json | Them @libsql/client |
| .env | Thay DATABASE_URL |

### Phase 2 - Auth (6 files)
| File | Action |
|------|--------|
| lib/auth/auth.ts | NEW - NextAuth config |
| app/api/auth/[...nextauth]/route.ts | NEW - Auth handler |
| lib/auth/session.ts | NEW - Session helpers |
| app/(admin)/layout.tsx | Dung NextAuth thay Supabase |
| app/(admin)/admin/login/page.tsx | Dung signIn thay signInWithPassword |
| package.json | Them next-auth@beta |

### Phase 3 - Data Layer (7 files)
| File | Action |
|------|--------|
| app/api/products/route.ts | NEW - POST create product |
| app/api/products/[id]/route.ts | NEW - PUT/DELETE product |
| app/(admin)/admin/products/edit/[id]/page.tsx | Dung Prisma thay Supabase JS |
| components/ProductForm.tsx | Dung API thay Supabase JS |
| components/DeleteProductButton.tsx | Dung API thay Supabase JS |
| lib/supabase/client.ts | XOA |
| lib/supabase/server.ts | XOA |

### Phase 4 - Config & Deploy (3 files)
| File | Action |
|------|--------|
| .env | Cap nhat day du |
| next.config.ts | Them serverExternalPackages |
| prisma/seed.ts | Seed admin user |

## Luong di migration

Phase 1 (Database)
  -> Phase 2 (Auth)
    -> Phase 3 (Data Layer)
      -> Phase 4 (Deploy)

Moi phase co the lam rieng biet, khong blocking lan nhau qua nhieu.
