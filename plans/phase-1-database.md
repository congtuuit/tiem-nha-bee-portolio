# Phase 1: Database - Prisma PostgreSQL to Turso (SQLite)

## Van de
SQLite file-based khong hoat dong tren Vercel serverless vi filesystem ephemeral.
**Giai phap: Turso** - managed edge database built on libsql (SQLite fork).

## Cac buoc thuc hien

### 1. Cai dat dependencies
npm install @libsql/client @prisma/adapter-libsql

### 2. Tao Turso database
turso auth login
turso db create tiem-nha-bee
turso db show tiem-nha-bee --url
turso db tokens create tiem-nha-bee

### 3. Sua prisma/schema.prisma
Thay doi chinh:
- provider = "postgresql" -> provider = "sqlite"
- Xoa directUrl
- @default(dbgenerated("gen_random_uuid()")) -> @default(uuid())
- @db.Uuid -> xoa
- @db.Timestamptz(6) -> xoa
- Decimal -> Float
- Json -> String (luu JSON dang text)

Them model admin_users:
model admin_users {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  password  String
  created_at DateTime @default(now())
}

### 4. Sua lib/prisma.ts
Them helpers:

export function parseJsonField(value, fallback) {
  if (!value) return fallback;
  try { return JSON.parse(value); }
  catch { return fallback; }
}
export function stringifyJsonField(value) {
  return JSON.stringify(value);
}

### 5. Cap nhat .env
DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
AUTH_SECRET="..."
ADMIN_EMAIL="admin@tiemnhabee.com"
ADMIN_PASSWORD="..."

### 6. Push schema
npx prisma db push
npx prisma generate
