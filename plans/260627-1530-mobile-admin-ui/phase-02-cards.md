# Phase 02: Data Tables to Cards
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Tối ưu hóa các danh sách dữ liệu trong Admin (Danh sách bài viết, Danh sách sản phẩm) để dễ xem và tương tác trên màn hình hẹp, tránh việc phải cuộn ngang (horizontal scroll).

## Requirements
### Functional
- [ ] Chuyển đổi giao diện Bảng (Table) thành giao diện danh sách Thẻ (Cards).
- [ ] Mỗi thẻ hiển thị thông tin chính (Tên, Ảnh, Trạng thái) và có menu dropdown `...` cho các thao tác (Sửa, Xóa).
- [ ] Responsive: Màn hình lớn hiển thị Table/Grid, màn hình nhỏ hiển thị 1 cột Card dọc.

## Implementation Steps
1. [ ] Kiểm tra trang danh sách Bài viết (`app/admin/posts/page.tsx`).
2. [ ] Thiết kế `Card` component cho từng dòng dữ liệu sử dụng shadcn/ui Card.
3. [ ] Kiểm tra và áp dụng tương tự cho trang danh sách Sản phẩm (nếu có ở `/admin`).

## Test Criteria
- [ ] Không xuất hiện thanh cuộn ngang khi xem danh sách trên Mobile.
- [ ] Các thông tin quan trọng vẫn hiển thị đầy đủ và rõ ràng trên từng Card.

---
Next Phase: Phase 03
