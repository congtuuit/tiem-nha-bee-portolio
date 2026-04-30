# Changelog - Tiệm Nhà Bee

## [2026-04-30] - Premium Storefront & CMS Upgrade

### ✨ Added
- **Homepage CMS**: Thêm các trường `hero_title`, `hero_subtitle`, `hero_image` vào `shop_config`.
- **Admin Settings**: Giao diện quản lý nội dung Hero Section cho Admin.
- **Storefront Listing Enhancement**:
    - Bộ lọc Mobile (Drawer/Sheet) chuyên nghiệp.
    - Active Filter Tags (xóa nhanh bộ lọc).
    - Header động hiển thị tiêu đề danh mục/tìm kiếm.
    - Grid 4 cột trên desktop.
- **Image Optimization**:
    - Component `ImageWithSkeleton` (Lazy Load + Skeleton placeholders).
    - Xử lý cache và loading state mượt mà.
- **Product Seeding**: Script sinh 25 sản phẩm mẫu đa dạng.
- **Custom Carousel**: Nâng cấp UI Swiper với Lucide icons và stylized pagination.

### 🔧 Fixed
- **Hydration Failed**: Khắc phục lỗi lồng thẻ `<button>` trong bộ sưu tập ảnh và thanh tìm kiếm.
- **Image 404**: Cấu hình `remotePatterns` trong `next.config.ts` để hiển thị ảnh từ Unsplash và R2.
- **PDP UI Bug**: Sửa lỗi crash do thiếu biến `contactUrl` trong trang chi tiết.
- **Layout Overflow**: Fix lỗi Carousel tràn chiều ngang gây xuất hiện thanh cuộn.
- **Build Fail (TypeScript)**:
    - Sửa lỗi type `SheetTrigger` do dùng sai prop `asChild` của Base UI (thay bằng `render`).
    - Sửa lỗi type mismatch `images` trong `ProductForm` (Zod schema alignment).
- **Next.js Deprecation**: Di chuyển `middleware.ts` sang `proxy.ts` để tuân thủ tiêu chuẩn Next.js 16.

---
*Ghi chú: Phiên làm việc tập trung vào UI/UX và tối ưu hóa tốc độ tải trang public.*
