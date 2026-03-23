# Quy ước Git Pipeline

## 1) Branching strategy
- `main`: nhánh ổn định, luôn có thể release.
- `develop`: nhánh tích hợp (khuyến nghị dùng cho môi trường staging).
- Tạo nhánh từ `develop` (hoặc `main` nếu chưa dùng develop):
  - `feature/<ten-ngan-gon>`
  - `fix/<ten-ngan-gon>`
  - `hotfix/<ten-ngan-gon>`

## 2) Commit message
Khuyến nghị theo Conventional Commits:
- `feat:` thêm tính năng
- `fix:` sửa lỗi
- `refactor:` cải tổ code, không đổi hành vi
- `docs:` cập nhật tài liệu
- `test:` thêm/sửa test
- `chore:` việc kỹ thuật khác

Ví dụ:
- `feat: thêm API lấy thống kê đăng ký theo giảng viên`
- `fix: xử lý validate GPA trong cập nhật tiến độ`

## 3) Pull Request
- Không push trực tiếp vào `main`.
- Mọi thay đổi đi qua PR.
- PR cần mô tả rõ:
  - Mục tiêu
  - Phạm vi ảnh hưởng
  - Test plan
  - Rủi ro và rollback

## 4) CI bắt buộc
Workflow tại `.github/workflows/ci.yml` chạy:
- Backend: install, lint (nếu có), build, test:ci (nếu có)
- Frontend: install, lint, build, test:ci (nếu có)

Khuyến nghị thêm script test CI:
- `backend/package.json`: `test:ci`
- `frontend/elearning/package.json`: `test:ci`

## 5) Merge policy
- Chỉ merge khi:
  - CI pass
  - Có ít nhất 1 approval
  - Không còn conflict
- Khuyến nghị dùng **Squash merge** để lịch sử commit gọn.
