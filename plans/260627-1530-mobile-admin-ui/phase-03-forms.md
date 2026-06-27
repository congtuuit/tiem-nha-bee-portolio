# Phase 03: Form UI & Floating Actions
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Cải thiện trải nghiệm nhập liệu (tạo mới, chỉnh sửa) bằng cách dùng Sheet/Drawer thay vì Dialog nhỏ lẻ, cùng nút thêm nhanh tiện lợi.

## Requirements
### Functional
- [ ] Các Form thêm/sửa được mở dưới dạng `Sheet` (hoặc `Drawer`) từ dưới lên hoặc từ phải sang, chiếm toàn bộ màn hình trên mobile.
- [ ] Tối ưu kích thước nút bấm (Buttons) và ô nhập liệu (Inputs) cho ngón tay.
- [ ] Thêm nút Floating Action Button (FAB) hình tròn, cố định góc dưới bên phải màn hình để tạo mới dữ liệu nhanh chóng.

## Implementation Steps
1. [ ] Kiểm tra các popup form hiện tại (ví dụ trong trang bài viết).
2. [ ] Thay thế `Dialog` bằng `Sheet` (của shadcn) cho mobile view, đảm bảo width 100% trên điện thoại.
3. [ ] Tạo component `FAB` và nhúng vào trang danh sách.

## Test Criteria
- [ ] Nhấn nút FAB mở Form mượt mà.
- [ ] Form hiển thị full màn hình dọc trên mobile, dễ dàng gõ phím.
- [ ] Nút Lưu/Hủy dễ bấm.

---
Next Phase: None (Completion)
