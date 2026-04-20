# Hướng dẫn Tích hợp Google OAuth

## Giới thiệu

Hướng dẫn này sẽ giúp bạn tích hợp tính năng đăng ký và đăng nhập bằng Google vào ứng dụng e-learning.

## Yêu cầu

- Node.js >= 14
- npm hoặc yarn
- Tài khoản Google Cloud Console
- Frontend: Next.js 14.2.14
- Backend: Express.js

## 1. Cấu hình Google Cloud Console

### 1.1 Tạo dự án trong Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo dự án mới hoặc chọn dự án hiện có
3. Bật API: **Google+ API** hoặc **Identity and Access Management (IAM) API**

### 1.2 Tạo OAuth 2.0 Client ID

1. Vào **Credentials** (Thông tin xác thực)
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. Chọn **Web application**
4. Thêm Authorized redirect URIs:
   - `http://localhost:3000` (Frontend)
   - `http://localhost:4000` (Backend)
   - Production URLs (nếu có)
5. Lưu **Client ID** và **Client Secret**

## 2. Cấu hình Backend

### 2.1 Cài đặt Dependencies

```bash
cd backend
npm install
# google-auth-library đã có trong package.json
```

### 2.2 Cấu hình Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến sau:

```env
# Existing variables
PORT=4000
NODE_ENV=development
DATABASE_URL=mysql://username:password@localhost:3306/database_name
TOKEN_SECRET=your_jwt_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_from_google_cloud.apps.googleusercontent.com
```

### 2.3 Backend Endpoints

#### POST `/auth/google-login`

**Request:**
```json
{
  "token": "google_id_token_here",
  "role": "student" // hoặc "teacher"
}
```

**Response (Success):**
```json
{
  "message": "Google login/signup successfully!",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "bankName": "",
    "bankAccount": ""
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid Google token"
}
```

## 3. Cấu hình Frontend

### 3.1 Environment Variables

Tạo file `.env.local`:

```bash
cd frontend/elearning
cp .env.local.example .env.local
```

Cập nhật:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_from_google_cloud.apps.googleusercontent.com
```

### 3.2 Components đã được cập nhật

#### Login Page (`app/login/page.tsx`)
- GoogleLogin component được thêm vào
- Xử lý `handleLoginSuccess` khi đăng nhập bằng Google thành công
- User tự động lưu vào Recoil state và sessionStorage

#### Signup Page (`app/signup/page.tsx`)
- GoogleLogin component được thêm vào
- Xử lý `handleGoogleSignup`
- User có thể đăng ký bằng Google hoặc form truyền thống

#### Layout (`app/layout.tsx`)
- GoogleOAuthProvider được bao bọc toàn bộ app
- Client ID được truyền từ environment variables

## 4. Kiểm Tra Chức Năng

### 4.1 Khởi động Backend

```bash
cd backend
npm run dev
```

Kiểm tra: Backend chạy trên `http://localhost:4000`

### 4.2 Khởi động Frontend

```bash
cd frontend/elearning
npm run dev
```

Kiểm tra: Frontend chạy trên `http://localhost:3000`

### 4.3 Kiểm tra tính năng

1. Truy cập `http://localhost:3000/login`
2. Click vào **Đăng nhập bằng Google**
3. Chọn tài khoản Google
4. Kiểm tra xem có redirect về dashboard không
5. Kiểm tra sessionStorage có user data không

### 4.4 Kiểm tra Signup

1. Truy cập `http://localhost:3000/signup`
2. Click vào **Đăng ký với Google**
3. Chọn vai trò (Student/Teacher)
4. Kiểm tra xem có tạo user mới không
5. Kiểm tra redirect về dashboard

## 5. Cách hoạt động

### Frontend Flow

```
User clicks Google Login
    ↓
GoogleLogin component opens Google Sign-in
    ↓
User authenticates with Google
    ↓
Google returns ID Token to frontend
    ↓
Frontend sends token to backend: POST /auth/google-login
    ↓
Backend verifies token
    ↓
User stored in sessionStorage & Recoil state
    ↓
Redirect to dashboard
```

### Backend Flow

```
POST /auth/google-login (token, role)
    ↓
Verify Google token with google-auth-library
    ↓
Extract email, firstName, lastName from token
    ↓
Check if user exists by email
    ↓
If not exists:
  - Generate random username
  - Create new user with Google data
  - If teacher, create teacher account
    ↓
Generate JWT token
    ↓
Return user data + JWT token
```

## 6. Mô tả các File đã thay đổi/tạo mới

### Backend
- **`src/auth/auth.service.ts`** - Thêm `verifyGoogleToken()` method
- **`src/auth/auth.controller.ts`** - Thêm `googleLogin()` handler
- **`src/auth/auth.route.ts`** - Thêm route POST `/google-login`

### Frontend
- **`app/layout.tsx`** - Bao bọc app với `GoogleOAuthProvider`
- **`app/login/page.tsx`** - Thêm Google login button & handler
- **`app/signup/page.tsx`** - Thêm Google signup button & handler
- **`.env.local.example`** - Template environment variables

## 7. Troubleshooting

### Lỗi "Invalid Google token"
- Kiểm tra `GOOGLE_CLIENT_ID` ở backend có đúng không
- Đảm bảo token được gửi từ frontend là hợp lệ
- Kiểm tra thời gian hệ thống (token có thể hết hạn)

### Lỗi CORS
- Thêm `http://localhost:3000` vào Authorized JavaScript origins ở Google Cloud
- Kiểm tra backend CORS configuration

### User không được tạo
- Kiểm tra database connection
- Xem lại console backend để xem error message
- Đảm bảo email chưa tồn tại trong database

### Google button không hiển thị
- Kiểm tra `NEXT_PUBLIC_GOOGLE_CLIENT_ID` ở `.env.local`
- Đảm bảo `GoogleOAuthProvider` được wrap xung quanh app
- Xem console browser để xem error

## 8. Mở rộng

### Thêm Provider khác
Bạn có thể thêm Facebook, GitHub, v.v... bằng cách:
1. Cài các library tương ứng
2. Tạo endpoint backend cho từng provider
3. Thêm button và handler ở frontend

### Cải thiện UX
- Thêm loading state khi đang authenticate
- Thêm error toast notifications
- Hiển thị user avatar từ Google
- Cho phép link/unlink Google account

## 9. Bảo mật

### Các biện pháp bảo mật đã có:
- Xác minh Google token trên backend
- JWT token có thời hạn
- Mật khẩu được hash với bcrypt
- Stored procedure cho database

### Các biện pháp nên thêm:
- HTTPS cho production
- Refresh token mechanism
- Rate limiting trên endpoints
- Input validation & sanitization
- CSRF protection

---

**Tác giả:** GitHub Copilot  
**Ngày cập nhật:** 2026-04-21
