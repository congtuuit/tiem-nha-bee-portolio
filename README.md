# Tiệm Nhà Bee Portfolio

Website giới thiệu sản phẩm thủ công mỹ nghệ với Admin Dashboard để quản lý sản phẩm.

## 🚀 Tính năng

- Giao diện người dùng (Public Site) tối ưu tốc độ và SEO với Next.js App Router.
- Trang quản trị (Admin Dashboard) bảo mật bằng Supabase Auth.
- Thêm/sửa sản phẩm dễ dàng.
- Tải ảnh lên Cloudflare R2 (S3 API).
- Tự động tạo slug (đường dẫn thân thiện) cho sản phẩm.

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **Database & Auth**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2
- **Forms & Validation**: React Hook Form, Zod
- **Image Compression**: browser-image-compression

## 📋 Hướng dẫn cài đặt

### 1. Supabase Setup

1. Tạo một dự án mới trên [Supabase](https://supabase.com).
2. Tới phần **Authentication** > **Providers** và đảm bảo **Email** đã được bật (có thể tắt "Confirm email" cho MVP).
3. Vào phần **SQL Editor** và chạy đoạn script sau để tạo bảng `products`:

```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price numeric,
  cover_image text,
  images jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bật Row Level Security (RLS)
alter table products enable row level security;

-- Cho phép ai cũng có thể đọc (Public read)
create policy "Public can view products"
  on products for select
  using ( true );

-- Chỉ cho phép admin (authenticated) sửa đổi
create policy "Authenticated users can insert products"
  on products for insert
  to authenticated
  with check ( true );

create policy "Authenticated users can update products"
  on products for update
  to authenticated
  using ( true );

create policy "Authenticated users can delete products"
  on products for delete
  to authenticated
  using ( true );
```

4. Tạo một tài khoản Admin bằng cách vào **Authentication** > **Users** > **Add user** (hoặc dùng giao diện login của app).

### 2. Cloudflare R2 Setup

1. Tạo tài khoản [Cloudflare](https://dash.cloudflare.com/) và kích hoạt R2 (cần add thẻ VISA, nhưng có free-tier 10GB).
2. Tạo một bucket mới (ví dụ: `tiem-nha-bee-assets`).
3. Vào phần **Settings** của Bucket:
   - Cho phép **Public Access** và tạo/lấy Custom Domain hoặc R2.dev sub-domain (Đây sẽ là `R2_PUBLIC_URL`).
   - Cấu hình **CORS** để cho phép upload từ domain của bạn:
     ```json
     [
       {
         "AllowedOrigins": ["http://localhost:3000", "https://your-vercel-domain.com"],
         "AllowedMethods": ["PUT", "GET"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3000
       }
     ]
     ```
4. Quay lại trang chính R2, chọn **Manage R2 API Tokens**, tạo một token với quyền **Object Read & Write**.
5. Copy các thông tin: Account ID, Access Key ID, và Secret Access Key.

### 3. Cấu hình biến môi trường (.env.local)

Tạo file `.env.local` ở thư mục gốc:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Cloudflare R2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=tiem-nha-bee-assets
R2_PUBLIC_URL=https://pub-xxxxxx.r2.dev
```

### 4. Khởi chạy và Deploy (Vercel)

1. Cài đặt thư viện (nếu chưa cài): `npm install`
2. Chạy thử máy phát triển: `npm run dev`
3. Kiểm tra build sản phẩm: `npm run build`
4. Để deploy lên Vercel:
   - Đẩy code lên GitHub.
   - Kết nối Vercel với repository GitHub.
   - Trong phần cài đặt (Environment Variables) trên Vercel, dán toàn bộ nội dung file `.env.local` vào.
   - Nhấn Deploy.

---

Chúc bạn kinh doanh thành công! 🐝
