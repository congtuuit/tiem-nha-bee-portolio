# Phase 4: Config and Deploy

## Env vars cho Vercel
- DATABASE_URL, TURSO_AUTH_TOKEN
- AUTH_SECRET, AUTH_URL
- ADMIN_EMAIL, ADMIN_PASSWORD
- R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
- R2_BUCKET_NAME, R2_PUBLIC_URL

## next.config.ts
Them: serverExternalPackages: ["@libsql/client"]

## package.json scripts
"build": "prisma generate && next build"
"db:push": "prisma db push"
"db:seed": "prisma db seed"

## Checklist truoc deploy
- npm run build thanh cong
- npm run db:push len Turso
- npm run db:seed admin user
- Login/Logout hoat dong
- CRUD products day du
- Settings page doc/ghi duoc
- Public pages van hoat dong
- Upload anh qua R2 van ok

## Rollback
Giu lai .env cu, revert prisma/schema.prisma, npm install @supabase/ssr
