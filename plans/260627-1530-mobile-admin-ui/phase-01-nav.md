# Phase 01: Admin Navigation & Layout
Status: ⬜ Pending
Dependencies: None

## Objective
Thay đổi layout tổng thể của trang Admin để tương thích tốt hơn với thiết bị di động.

## Requirements
### Functional
- [ ] Chuyển đổi Sidebar truyền thống thành menu có thể thu gọn (Hamburger menu hoặc Drawer) trên mobile.
- [ ] Hoặc thêm Bottom Navigation cho các tính năng chính (Dashboard, Sản phẩm, Bài viết, Cài đặt) khi ở màn hình mobile.
- [ ] Giữ nguyên giao diện Sidebar nếu xem trên Desktop (Responsive design).

## Implementation Steps
1. [ ] Phân tích `app/admin/layout.tsx` và components navigation hiện tại.
2. [ ] Áp dụng `Sheet` component của shadcn/ui (nếu chưa có thì install) để làm Mobile Menu.
3. [ ] Cập nhật responsive classes (md:hidden, md:flex).

## Test Criteria
- [ ] Layout hiển thị Sidebar trên màn hình lớn.
- [ ] Layout chuyển thành Mobile Menu (Hamburger/Bottom Nav) trên màn hình nhỏ.

---
Next Phase: Phase 02
