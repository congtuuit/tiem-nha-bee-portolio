# Phase 02: Backend API
Status: ⬜ Pending

## Objective
Tạo Route Handler (API Endpoint) tĩnh để Frontend có thể lấy danh sách sản phẩm và lọc dữ liệu qua Client-side.

## Requirements
### Functional
- [ ] Tạo file `app/api/products/route.ts`
- [ ] Xử lý nhận các `searchParams` (`category`, `search`, `minPrice`, `maxPrice`, `sort`, `page`)
- [ ] Query Prisma để lấy danh sách sản phẩm và tổng số lượng (sử dụng lại logic query hiện có ở page cũ)
- [ ] Trả về JSON cho Frontend.

## Implementation Steps
1. [ ] Tạo `app/api/products/route.ts`
2. [ ] Viết hàm `GET` handler nhận query parameters.
3. [ ] Xử lý logic tìm kiếm (search, filter, sort, pagination) bằng Prisma.
4. [ ] Trả về object `{ products: [...], totalCount: X, totalPages: Y }`

## Files to Create/Modify
- `app/api/products/route.ts` - [NEW] API Endpoint cho sản phẩm.

## Test Criteria
- [ ] Có thể truy cập `/api/products` và nhận về JSON chứa sản phẩm.
- [ ] Hỗ trợ phân trang và filter qua URL parameters của API.

---
Next Phase: Phase 03
