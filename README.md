# Bách Khoa E-Learning

Nền tảng học trực tuyến gồm khóa học, bài giảng, quiz chấm điểm, lộ trình học và thanh toán — đồ án môn Hệ cơ sở dữ liệu (HCMUT).

| Thành phần | Công nghệ |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Chart.js — `frontend/elearning` |
| Backend | Node.js 20, Express, TypeScript, Drizzle ORM, mysql2 — `backend` |
| Database | MySQL 8 (CTE, window function, trigger, CHECK constraint) |
| Thanh toán | PayOS (link thanh toán + webhook có chữ ký) |
| Kiểm thử / CI | Vitest + Supertest trên MySQL thật, GitHub Actions |

## Mục lục

1. [Điểm nổi bật của backend](#điểm-nổi-bật-của-backend)
2. [Kiến trúc](#kiến-trúc)
3. [Mô hình phân quyền](#mô-hình-phân-quyền)
4. [Luồng thanh toán](#luồng-thanh-toán)
5. [Chạy dự án local](#chạy-dự-án-local)
6. [Kiểm thử](#kiểm-thử)
7. [Biến môi trường](#biến-môi-trường)
8. [Cấu trúc thư mục](#cấu-trúc-thư-mục)
9. [Triển khai production](#triển-khai-production)
10. [Đóng góp](#đóng-góp)

## Điểm nổi bật của backend

- **Chấm quiz phía server.** Trình duyệt chỉ gửi lựa chọn của sinh viên (`POST /quiz/:id/submit`); điểm được tính trong một transaction, có khóa dòng ghi danh để các lượt nộp song song không vượt giới hạn số lần làm. Đáp án đúng không bao giờ được gửi tới sinh viên; xem lại bài chỉ hiện đáp án đúng khi đã dùng hết lượt.
- **Thanh toán không thể làm giả.** Giá lấy từ database (không tin client), ghi danh chỉ xảy ra sau khi PayOS xác nhận qua webhook đã xác thực chữ ký hoặc server tự hỏi lại PayOS. Xử lý idempotent: webhook gửi lặp hoặc chạy song song với trang kiểm tra trạng thái vẫn chỉ ghi danh một lần.
- **Phân quyền theo vai trò và quyền sở hữu.** Mọi route ghi đều cần JWT; giảng viên chỉ sửa được tài nguyên thuộc khóa học của mình; sinh viên chỉ đọc được bài giảng / quiz của khóa đã ghi danh.
- **Thống kê bằng SQL.** `GET /analytics/teacher/overview` dùng recursive CTE (chuỗi tháng liên tục), `LAG()` (tăng trưởng theo tháng), `RANK()` (xếp hạng khóa học theo doanh thu) thay vì tải toàn bộ bản ghi về trình duyệt để cộng.
- **Ràng buộc nghiệp vụ nằm trong database.** Trigger giới hạn tối đa 3 khóa đang học; CHECK constraint cho điểm, tiến độ, trạng thái. Hệ thống kiểm tra giới hạn này *trước khi thu tiền*, và đánh dấu `ENROLL_FAILED` nếu vẫn bị chặn do đua luồng.
- **Tìm kiếm khóa học phía server** (`GET /course/search`): lọc, sắp xếp, phân trang, escape ký tự `%` `_`, sort key dùng whitelist.
- **Vận hành.** Cấu hình env được validate khi khởi động, log JSON có request-id (pino), error handler tập trung, helmet, rate limit (chống brute-force đăng nhập), CORS có wildcard cho preview deployment, `/health` kiểm tra DB, tắt server an toàn, tài liệu OpenAPI tại `/docs`.
- **Migration và dữ liệu mẫu.** `npm run db:migrate` (hỗ trợ `DELIMITER` cho trigger, chạy lại an toàn) và `npm run db:seed` (30 sinh viên, 3 giảng viên, 7 khóa học, 12 tháng dữ liệu).
- **Tiến độ học theo bài giảng** và "học tiếp từ chỗ đang dở": mỗi bài giảng và mỗi quiz có trọng số như nhau; trình phát video báo vị trí đang xem, server nhớ để phát tiếp. Tính toán lại tiến độ chạy dưới khóa dòng ghi danh nên các yêu cầu song song không ghi đè nhau bằng số liệu cũ.
- **Chứng chỉ tự động có mã xác minh công khai.** Hoàn thành 100% và điểm trung bình quiz ≥ 5,0 thì hệ thống tự cấp chứng chỉ (mỗi sinh viên một chứng chỉ cho mỗi khóa, đảm bảo bằng ràng buộc UNIQUE), xuất PDF A4 có logo trường và mã QR, và có trang `/verify/<mã>` cho bất kỳ ai kiểm tra.
- **80 test tích hợp** chạy trên MySQL thật (kể cả các test đua luồng), CI chạy trên MySQL service.

## Kiến trúc

```text
[Next.js] ──JWT──> [Express API] ──> [MySQL 8]
                        │
                        ├── middleware: auth → role → ownership → validate (zod)
                        ├── modules: auth, course, quiz, payment, analytics, ...
                        └── PaymentGateway (PayOS) <── webhook (chữ ký)
```

Các module cũ theo mẫu `route → controller → service`; module mới (chấm quiz, thanh toán, thống kê) đặt logic trong service thuần để test được độc lập.

## Mô hình phân quyền

| Tài nguyên | Công khai | Sinh viên | Giảng viên |
|---|---|---|---|
| Danh sách / chi tiết / tìm kiếm khóa học, đề cương (section) | đọc | đọc | đọc |
| Bài giảng, quiz, câu hỏi, lựa chọn | — | đọc nếu **đã ghi danh** | đọc / ghi nếu **sở hữu khóa học** |
| Đáp án đúng của câu hỏi | — | không bao giờ | chỉ khóa học của mình |
| Nộp quiz, xem lại bài | — | khóa đã ghi danh | — |
| Ghi danh | — | khóa miễn phí trực tiếp; khóa trả phí qua thanh toán | — |
| Báo tiến độ bài giảng, xem tiến độ khóa học | — | khóa đã ghi danh | — |
| Sửa tiến độ / GPA bằng tay | — | — | khóa của mình |
| Xác minh chứng chỉ | có (không cần đăng nhập) | có | có |
| Tải PDF chứng chỉ | — | chỉ chứng chỉ của mình | — |
| Danh sách chứng chỉ đã cấp | — | — | khóa của mình |
| Thống kê dashboard | — | — | dữ liệu của chính mình |

Danh tính (`teacherId`, `studentId`) luôn lấy từ token, không lấy từ body request.

## Tiến độ và chứng chỉ

```text
trình phát video ──PUT /progress/lecture/:id {positionSeconds}──▶ ghi vị trí (mỗi ~10 giây)
                 └─ xem ≥ 90% hoặc hết video: {completed: true} ─▶ tính lại tiến độ khóa học
nộp quiz ───────────────────────────────────────────────────────▶ tính lại tiến độ khóa học
                                                                    │ khóa dòng ghi danh (FOR UPDATE)
                                                                    ▼
   tiến độ = (bài giảng đã học + quiz đã làm) / (tổng bài giảng + tổng quiz)
   GPA     = trung bình của điểm trung bình từng quiz (làm lại thì lấy trung bình các lượt)
   100% và GPA ≥ 5,0 (hoặc khóa không có quiz) ─▶ cấp chứng chỉ BK-XXXX-XXXX-XXXX, đúng một lần
```

- Mã chứng chỉ sinh từ CSPRNG (30^12 khả năng, không có ký tự dễ nhầm I/L/O/U/0/1); cơ sở dữ liệu là nguồn sự thật nên không cần giải mã hay ký lại.
- `GET /certificate/verify/:mã` công khai và có giới hạn tốc độ để không ai dò được không gian mã; chỉ trả tên người nhận, khóa học, giảng viên, ngày cấp và điểm.
- Giới hạn đã biết: việc "xem xong bài giảng" do trình phát báo lên, giống phần lớn LMS; một sinh viên cố tình có thể đánh dấu đã học mà không xem.

## Luồng thanh toán

```text
POST /payment/create-link {courseId}      giá lấy từ DB, tạo đơn PENDING, trả checkoutUrl
        │
        ▼  người dùng thanh toán trên PayOS
        ├── POST /payment/webhook          xác thực chữ ký → khóa dòng đơn → PAID + ghi danh (một lần)
        └── GET  /payment/order/:code      nếu vẫn PENDING, hỏi lại PayOS rồi xử lý như trên
```

Đăng ký webhook trong dashboard PayOS tới `https://<backend>/payment/webhook`. Khi chạy local không có URL công khai, trang `/payment-success` vẫn hoạt động nhờ nhánh "hỏi lại PayOS".

## Chạy dự án local

Yêu cầu: Node.js ≥ 20, MySQL ≥ 8.0.16.

### 1) Database

```bash
docker run --name bk-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=elearning_db -p 3306:3306 -d mysql:8.0
```

### 2) Backend

```bash
cd backend
npm install
cp .env.example .env.local        # .env.local được git bỏ qua; sửa DATABASE_* và TOKEN_SECRET
npm run db:migrate                # tạo bảng, trigger, ràng buộc
npm run db:seed                   # dữ liệu mẫu (thêm `-- --reset` để xóa và nạp lại)
npm run dev                       # http://localhost:4000  (tài liệu API: /docs)
```

Tài khoản mẫu (mật khẩu `Passw0rd!`): giảng viên `gv.an`, `gv.binh`, `gv.chau`; sinh viên `sv001` … `sv030`.

### 3) Frontend

```bash
cd frontend/elearning
npm install
cp .env.example .env.local        # NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
npm run dev                       # http://localhost:3000
```

## Kiểm thử

```bash
cd backend
npm run typecheck
npm test                          # cần MySQL; database kiểm thử `bk_test` được tạo lại từ migrations/ mỗi lần chạy
```

Đổi kết nối kiểm thử bằng `TEST_DB_HOST`, `TEST_DB_PORT`, `TEST_DB_USER`, `TEST_DB_PASSWORD`, `TEST_DB_NAME` (mặc định `127.0.0.1:3306`, `root`, mật khẩu rỗng).

Bộ test bao phủ: xác thực và JWT, RBAC, quyền sở hữu, ẩn đáp án, chấm điểm và giới hạn lượt (kể cả 6 request song song), thanh toán (webhook giả mạo, gửi lặp song song, sai số tiền, giới hạn 3 khóa), thống kê, tìm kiếm / SQL injection, trigger.

## Biến môi trường

### Backend (`backend/.env.local` hoặc `.env`)

| Biến | Ý nghĩa |
|---|---|
| `TOKEN_SECRET` | Secret ký JWT (bắt buộc, dùng chuỗi ngẫu nhiên dài ≥ 32 ký tự) |
| `DATABASE_HOST/PORT/USER/PASSWORD`, `DATABASE` | Kết nối MySQL |
| `DATABASE_SSL` | `true` với MySQL cloud bắt buộc TLS |
| `RUN_MIGRATIONS` | `true` để tự áp migration khi server khởi động |
| `CORS_ORIGIN` | Danh sách origin cách nhau bằng dấu phẩy, hỗ trợ `https://*.vercel.app` |
| `FRONTEND_URL` | Domain của frontend: PayOS đưa người dùng quay lại đây, và mã QR trên chứng chỉ trỏ tới `<FRONTEND_URL>/verify/<mã>` (production phải đặt đúng, nếu không QR sẽ trỏ về localhost) |
| `PAYOS_CLIENT_ID/API_KEY/CHECKSUM_KEY` | Thông tin PayOS |
| `GOOGLE_CLIENT_ID` | Đăng nhập Google |

### Frontend (`frontend/elearning/.env.local`)

- `NEXT_PUBLIC_API_BASE_URL`: URL API backend
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client id

## Cấu trúc thư mục

```text
BTLDBS/
├── backend/
│   ├── index.ts                  khởi động server, tắt an toàn
│   ├── src/
│   │   ├── app.ts                ghép middleware và router
│   │   ├── config/env.ts         validate biến môi trường
│   │   ├── middleware/           auth, access (sở hữu / ghi danh), validate, errorHandler
│   │   ├── quiz/quiz.attempt.ts  chấm điểm và xem lại bài
│   │   ├── payment/              gateway PayOS, service thanh toán, route
│   │   ├── analytics/            thống kê dashboard bằng SQL
│   │   ├── progress/             tiến độ học theo bài giảng, bước tiếp theo
│   │   ├── certificate/          cấp chứng chỉ, xác minh công khai, xuất PDF
│   ├── assets/                   font Be Vietnam Pro (OFL) và logo dùng cho PDF
│   │   └── <module>/             route / controller / service của từng tài nguyên
│   ├── migrations/               SQL migration (chạy bằng npm run db:migrate)
│   ├── scripts/seed.ts           dữ liệu mẫu
│   ├── docs/openapi.yaml         tài liệu API
│   └── tests/                    test tích hợp (Vitest + Supertest)
├── frontend/elearning/           Next.js
└── DEPLOY.md
```

## Triển khai production

Xem `DEPLOY.md`. Checklist nhanh:

- Đặt `TOKEN_SECRET` mạnh, không commit file `.env`
- Đặt `CORS_ORIGIN`, `FRONTEND_URL`, `NEXT_PUBLIC_API_BASE_URL` đúng domain
- Chạy migration: `npm run db:migrate` hoặc đặt `RUN_MIGRATIONS=true` cho lần khởi động đầu
- Đăng ký webhook PayOS tới `/payment/webhook`
- Kiểm tra `GET /health`

## Đóng góp

Vui lòng đọc `CONTRIBUTING.md` để nắm quy trình commit, branch và pull request.
