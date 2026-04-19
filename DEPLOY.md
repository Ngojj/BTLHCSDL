# Deploy Guide

## 1) Chuẩn bị biến môi trường

### Backend (`backend/.env`)
Tham khảo từ `backend/.env.example`:

- `PORT`
- `TOKEN_SECRET`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE`
- `CORS_ORIGIN` (domain frontend, hỗ trợ nhiều domain phân tách bằng dấu phẩy)

### Frontend (`frontend/elearning/.env.local`)
Tham khảo từ `frontend/elearning/.env.example`:

- `NEXT_PUBLIC_API_BASE_URL`

## 2) Deploy nhanh bằng Docker Compose (VPS hoặc local)

Từ thư mục `BTLDBS`:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Sau khi chạy:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- MySQL: `localhost:3306`

## 3) Deploy tách dịch vụ (gợi ý cloud)

### Backend
- Dùng Railway/Render.
- Root directory: `backend`
- Build: `npm ci --omit=dev`
- Start: `node index.js`
- Khai báo đầy đủ ENV backend.

### Frontend
- Dùng Vercel.
- Root directory: `frontend/elearning`
- Build: `npm run build`
- Start: `npm run start`
- Set `NEXT_PUBLIC_API_BASE_URL` trỏ về backend production.

## 4) Lưu ý quan trọng

- Không commit `.env` chứa secret thật.
- Đổi toàn bộ password/token mặc định trước khi public.
- Nếu đổi domain frontend, cập nhật `CORS_ORIGIN` ở backend.
