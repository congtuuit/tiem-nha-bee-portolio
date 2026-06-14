# Phase 01: Database Schema Update
Status: ⬜ Pending
Dependencies: None

## Objective
Cập nhật bảng `shop_config` để thêm trường lưu trữ ID của Google Analytics 4 (Measurement ID), giúp việc theo dõi (tracking) được thiết lập động qua trang Admin thay vì fix cứng trong source code.

## Requirements
### Functional
- [ ] Thêm trường `ga_measurement_id` vào schema Prisma.
- [ ] Áp dụng DB push để cập nhật bảng PostgreSQL.
- [ ] Cập nhật giao diện trang `admin/settings` để người dùng có thể nhập/sửa Tracking ID.

## Implementation Steps
1. [x] Cập nhật `prisma/schema.prisma` (Thêm trường `ga_measurement_id String?`).
2. [x] Chạy lệnh `npx prisma db push` để apply thay đổi.
3. [x] Cập nhật API GET/PUT `/api/settings/route.ts` để lấy/lưu trường mới.
4. [x] Cập nhật trang `app/(admin)/admin/settings/page.tsx` hiển thị ô input cho GA4 Tracking ID.

## Files to Modify
- `prisma/schema.prisma`
- `app/api/settings/route.ts`
- `app/(admin)/admin/settings/page.tsx`

---
Next Phase: Phase 02
