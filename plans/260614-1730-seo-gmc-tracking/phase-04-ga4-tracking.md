# Phase 04: GA4 Tracking Integration
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Cài đặt Google Analytics 4 (GA4) thông qua Measurement ID được lưu trong CSDL. Theo dõi các sự kiện quan trọng như click liên hệ (Zalo, Messenger) để đánh giá tỷ lệ chuyển đổi.

## Requirements
### Functional
- [ ] Cài đặt thư viện `@next/third-parties/google` nếu chưa có.
- [ ] Render thẻ `<GoogleAnalytics />` trong `app/layout.tsx` nếu `config.ga_measurement_id` tồn tại.
- [ ] Thêm event tracking `sendGAEvent` vào các nút Zalo/Facebook trong trang chi tiết sản phẩm.

## Implementation Steps
1. [x] Chạy lệnh cài đặt `npm install @next/third-parties@latest`.
2. [x] Trong `app/layout.tsx`, lấy `shopConfig` và render `<GoogleAnalytics gaId={shopConfig.ga_measurement_id} />`.
3. [x] Trong `app/(public)/san-pham/[slug]/page.tsx`, chuyển các nút liên hệ thành `ContactActions` để gọi `sendGAEvent` khi click.

## Files to Modify/Create
- `app/layout.tsx`
- `components/ContactActions.tsx` (Mới)
- `app/(public)/san-pham/[slug]/page.tsx`

---
Next Phase: N/A
