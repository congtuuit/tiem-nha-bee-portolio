# Phase 03: Google Merchant Center Feed
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Tạo đường dẫn API xuất dữ liệu sản phẩm dưới dạng XML Feed chuẩn của Google Merchant Center. Việc này giúp sản phẩm xuất hiện miễn phí trên Google Mua Sắm (Google Shopping).

## Requirements
### Functional
- [ ] API xuất tối đa tất cả sản phẩm đang active dưới dạng XML.
- [ ] XML bao gồm: `id`, `title`, `description`, `link`, `image_link`, `availability`, `price`, `condition`, `brand`.
- [ ] API có caching hợp lý (revalidate mỗi giờ) để tránh quá tải DB.

## Implementation Steps
1. [x] Tạo file `app/api/feed/google-merchant.xml/route.ts`.
2. [x] Viết hàm GET kết nối Prisma lấy toàn bộ `products`.
3. [x] Generate chuỗi XML theo định dạng RSS 2.0 (Google format).
4. [x] Return response với `Content-Type: application/xml`.

## Files to Create
- `app/api/feed/google-merchant.xml/route.ts`

---
Next Phase: Phase 04
