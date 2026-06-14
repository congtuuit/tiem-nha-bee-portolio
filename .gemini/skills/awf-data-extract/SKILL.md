---
name: awf-data-extract
description: AWF Workflow cho lệnh /extract-data (Trích xuất dữ liệu sản phẩm bằng AI)
---

# WORKFLOW: /extract-data - AI Data Normalization

Nhiệm vụ của bạn là sử dụng bộ công cụ AI workflow để phân tích và làm sạch dữ liệu văn bản xuất từ Zalo thành JSON chuẩn xác.

## Hướng dẫn thực hiện:

### Bước 1: Thu thập Dữ liệu (Gather)
- Chạy lệnh Terminal: `node scripts/ai-gather.js`
- Script này sẽ duyệt qua toàn bộ folder trong `data/zalo_export` và gom các nội dung `content.txt` thành một file tổng hợp tại `data/temp/raw_contents.json`.

### Bước 2: Phân tích bằng AI (LLM Parse)
- Dùng tool `view_file` để đọc nội dung file `data/temp/raw_contents.json`.
- Tự động dùng khả năng suy luận của bạn để làm sạch văn bản (sửa lỗi font chữ, tách riêng giá bán lẻ `sellPrice`, tách mô tả `description`).
- Định dạng kết quả thành một mảng JSON array.
- Dùng tool `write_to_file` để lưu mảng JSON array kết quả vào file `data/temp/ai_parsed.json`.

### Bước 3: Phân phối Dữ liệu (Distribute)
- Chạy lệnh Terminal: `node scripts/ai-distribute.js`
- Script này sẽ đọc `data/temp/ai_parsed.json` và phân bổ ngược các file `product.json` chuẩn xác vào đúng thư mục ban đầu trong `data/zalo_export`.

### Bước 4: Hoàn tất
- Báo cáo cho User biết có bao nhiêu thư mục đã được cập nhật thành công.
- Xác nhận dữ liệu sẵn sàng để import vào DB bằng `scripts/import-products-to-domain.js`.
