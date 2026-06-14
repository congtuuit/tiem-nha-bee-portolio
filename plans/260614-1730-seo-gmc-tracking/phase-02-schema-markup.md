# Phase 02: Schema Markup (JSON-LD)
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Làm sạch và nâng cấp các thẻ metadata JSON-LD để tuân thủ chuẩn của Google, giúp hiển thị kết quả phong phú (Rich Snippet) tốt hơn trên kết quả tìm kiếm.

## Requirements
### Functional
- [ ] Gỡ bỏ Rating cứng (Fake rating 5.0 sao) khỏi trang chi tiết sản phẩm.
- [ ] Thêm trường `sku` (lấy từ ID sản phẩm) và `itemCondition` (NewCondition) vào trang chi tiết.
- [ ] Thêm cấu trúc `ItemList` (hoặc `CollectionPage`) JSON-LD cho trang danh sách sản phẩm `/san-pham`.

## Implementation Steps
1. [x] Sửa JSON-LD tại `app/(public)/san-pham/[slug]/page.tsx`: Xóa `aggregateRating`, thêm `sku` và `offers.itemCondition`.
2. [x] Thêm thẻ `<script type="application/ld+json">` cho trang `app/(public)/san-pham/page.tsx` (danh sách các sản phẩm đang được hiển thị).

## Files to Modify
- `app/(public)/san-pham/[slug]/page.tsx`
- `app/(public)/san-pham/page.tsx`

---
Next Phase: Phase 03
