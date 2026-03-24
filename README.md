# BTLDBS - E-Learning Platform

Monorepo cho hệ thống học trực tuyến gồm:

- Frontend: `Next.js 14` (`frontend/elearning`)
- Backend API: `Express + TypeScript + Drizzle ORM` (`backend`)
- Database: `MySQL 8`

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc](#kiến-trúc)
3. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
4. [Chạy dự án local](#chạy-dự-án-local)
5. [Chạy bằng Docker](#chạy-bằng-docker)
6. [Biến môi trường](#biến-môi-trường)
7. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
8. [Triển khai production](#triển-khai-production)
9. [Đóng góp](#đóng-góp)

## Tổng quan

BTLDBS cung cấp nền tảng e-learning với các nhóm chức năng chính:

- Xác thực và phân quyền người dùng
- Quản lý học viên, giảng viên, khóa học, lộ trình học
- Quản lý bài giảng, quiz, câu hỏi, lựa chọn đáp án
- Theo dõi tiến độ học và dữ liệu tương tác

## Kiến trúc

```text
[Next.js Frontend] <-> [Express API] <-> [MySQL]
```

- Frontend gọi API qua `NEXT_PUBLIC_API_BASE_URL`
- Backend cấu hình CORS qua `CORS_ORIGIN`
- Backend kết nối MySQL bằng `mysql2` + `drizzle-orm`

## Yêu cầu hệ thống

- Node.js `>= 20`
- npm `>= 9`
- MySQL `8.x`
- Docker + Docker Compose (nếu chạy container)

## Chạy dự án local

### 1) Cài dependencies

```bash
# Root (nếu cần dùng các package chung)
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend/elearning
npm install
```

### 2) Cấu hình biến môi trường

- Backend: tạo `backend/.env` từ `backend/.env.example`
- Frontend: tạo `frontend/elearning/.env.local` từ `frontend/elearning/.env.example`

### 3) Chuẩn bị database

1. Tạo database MySQL theo tên trong `.env` (mặc định: `elearning_db`)
2. Import schema/dữ liệu ban đầu từ một trong các file SQL ở root:
- `BTL2.sql`
- `BTL2-task2.sql`

### 4) Chạy backend

```bash
cd backend
npm run dev
```

Mặc định backend chạy tại `http://localhost:4000`.

### 5) Chạy frontend

```bash
cd frontend/elearning
npm run dev
```

Mặc định frontend chạy tại `http://localhost:3000`.

## Chạy bằng Docker

Từ thư mục `BTLDBS`:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Sau khi chạy:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- MySQL: `localhost:3306`

## Biến môi trường

### Backend (`backend/.env`)

- `PORT`: cổng API (mặc định `4000`)
- `TOKEN_SECRET`: secret ký JWT (bắt buộc)
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE`
- `CORS_ORIGIN`: danh sách domain cách nhau bằng dấu phẩy

### Frontend (`frontend/elearning/.env.local`)

- `NEXT_PUBLIC_API_BASE_URL`: URL API backend

## Cấu trúc thư mục

```text
BTLDBS/
|-- backend/
|   |-- src/
|   |   |-- auth/
|   |   |-- course/
|   |   |-- student/
|   |   |-- teacher/
|   |   `-- ...
|   |-- migrations/
|   |-- drizzle/
|   `-- index.ts
|-- frontend/
|   `-- elearning/
|       |-- app/
|       |-- components/
|       `-- lib/
|-- docker-compose.prod.yml
|-- DEPLOY.md
`-- README.md
```

## Triển khai production

Xem hướng dẫn chi tiết tại `DEPLOY.md`.

Checklist nhanh trước khi deploy:

- Đổi toàn bộ password/secret mặc định
- Không commit file `.env`
- Cập nhật đúng `CORS_ORIGIN` và `NEXT_PUBLIC_API_BASE_URL`
- Kiểm tra kết nối DB và migration/schema

## Đóng góp

Vui lòng đọc `CONTRIBUTING.md` để nắm quy trình commit, branch và pull request.
