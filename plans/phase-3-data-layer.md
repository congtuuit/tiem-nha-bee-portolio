# Phase 3: Data Layer - Xoa direct Supabase JS calls

## Files can sua

### 1. Edit Product Page
app/(admin)/admin/products/edit/[id]/page.tsx
- supabase.from("products").select() -> prisma.products.findUnique()

### 2. Product Form
components/ProductForm.tsx
- supabase.from("products").insert() -> fetch POST /api/products
- supabase.from("products").update() -> fetch PUT /api/products/[id]

### 3. Delete Product Button
components/DeleteProductButton.tsx
- supabase.from("products").delete() -> fetch DELETE /api/products/[id]

## Files API moi

### app/api/products/route.ts
POST handler: prisma.products.create()

### app/api/products/[id]/route.ts
PUT handler: prisma.products.update()
DELETE handler: prisma.products.delete()

## Files xoa
lib/supabase/client.ts
lib/supabase/server.ts
