# E-Learning Frontend (Next.js 14)

Frontend cho hệ thống e-learning trong monorepo `BTLDBS`, xây dựng bằng **Next.js 14 + TypeScript + Tailwind CSS**.

## Mục lục

1. [Tổng quan](#tổng-quan)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
4. [Cài đặt và chạy local](#cài-đặt-và-chạy-local)
5. [Biến môi trường](#biến-môi-trường)
6. [Scripts](#scripts)
7. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
8. [Các route chính](#các-route-chính)
9. [Chạy bằng Docker](#chạy-bằng-docker)

## Tổng quan

Ứng dụng frontend cung cấp giao diện cho:

- Đăng nhập/đăng ký.
- Học viên: xem khóa học, lộ trình, quiz, điểm.
- Giảng viên: quản lý khóa học, section, quiz, roadmap, doanh thu, chứng chỉ.

Frontend gọi backend API thông qua biến `NEXT_PUBLIC_API_BASE_URL`.

## Công nghệ sử dụng

- `next@14.2.14`
- `react@18`
- `typescript`
- `tailwindcss`
- `axios`
- `recoil`
- `react-hook-form` + `zod`
- `chart.js` + `react-chartjs-2`

## Yêu cầu hệ thống

- Node.js `>= 20`
- npm `>= 9`

## Cài đặt và chạy local

Từ thư mục monorepo `BTLDBS`:

```bash
cd frontend/elearning
npm install
```

Tạo file môi trường local:

```bash
cp .env.example .env.local
```

Chạy môi trường development:

```bash
npm run dev
```

Mặc định app chạy tại: `http://localhost:3000`.

## Biến môi trường

File: `.env.local`

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

Ghi chú:

- Biến `NEXT_PUBLIC_*` sẽ được expose ra client-side.
- Đảm bảo backend đang chạy và cho phép CORS từ frontend domain.

## Scripts

- `npm run dev`: chạy development server.
- `npm run build`: build production.
- `npm run start`: chạy production server sau khi build.
- `npm run lint`: chạy ESLint.

## Cấu trúc thư mục

```text
frontend/elearning/
|-- app/                  # App Router pages
|   |-- teacher/          # Màn hình cho giảng viên
|   |-- student/          # Màn hình cho học viên
|   |-- login/ signup/    # Xác thực
|   `-- axios/            # API client config
|-- components/           # UI components dùng lại
|-- lib/                  # Utility functions
|-- types/                # Type declarations
|-- public assets in app/public/
`-- README.md
```

## Các route chính

- `/`: trang chủ.
- `/login`, `/signup`
- `/quizzes`
- `/student/mycourse`, `/student/roadmap`, `/student/tablescore`
- `/teacher`, `/teacher/courses`, `/teacher/create`, `/teacher/roadmap`, `/teacher/revenue`, `/teacher/certificate`

## Chạy bằng Docker

Trong thư mục `frontend/elearning`:

```bash
docker build -t elearning-frontend --build-arg NEXT_PUBLIC_API_BASE_URL=http://localhost:4000 .
docker run -p 3000:3000 elearning-frontend
```

Nếu chạy full stack, ưu tiên dùng `docker-compose.prod.yml` ở root monorepo.
