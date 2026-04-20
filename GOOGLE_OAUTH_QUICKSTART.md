# Google OAuth Integration - Quick Start

## Các bước nhanh để bắt đầu

### 1. Lấy Google Credentials

1. Truy cập: https://console.cloud.google.com/
2. Tạo dự án mới hoặc chọn dự án hiện tại
3. Vào **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
4. Chọn **Web application**
5. Thêm URIs:
   - JavaScript origins: `http://localhost:3000`
   - Redirect URIs: `http://localhost:3000`, `http://localhost:4000`
6. Copy **Client ID**

### 2. Cấu hình Backend

```bash
cd backend
```

**Tạo/Cập nhật `.env`:**
```env
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Khởi động:**
```bash
npm run dev
```

### 3. Cấu hình Frontend

```bash
cd frontend/elearning
```

**Tạo `.env.local`:**
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
```

**Khởi động:**
```bash
npm run dev
```

### 4. Kiểm tra

- Đăng nhập: http://localhost:3000/login
- Đăng ký: http://localhost:3000/signup

---

## Những gì đã được thay đổi

### 📁 Backend Changes

| File | Thay đổi |
|------|---------|
| `src/auth/auth.service.ts` | ✅ Thêm `verifyGoogleToken()` |
| `src/auth/auth.controller.ts` | ✅ Thêm `googleLogin()` handler |
| `src/auth/auth.route.ts` | ✅ Thêm route `POST /auth/google-login` |

### 📁 Frontend Changes

| File | Thay đổi |
|------|---------|
| `app/layout.tsx` | ✅ Wrap app với `GoogleOAuthProvider` |
| `app/login/page.tsx` | ✅ Thêm Google login button |
| `app/signup/page.tsx` | ✅ Thêm Google signup button |
| `.env.local.example` | ✅ Template cho environment variables |

---

## API Endpoint

### POST `/auth/google-login`

**Body:**
```json
{
  "token": "google_id_token",
  "role": "student"
}
```

**Success Response (200):**
```json
{
  "message": "Google login/signup successfully!",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "role": "student",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

---

## Quy trình Đăng nhập / Đăng ký

### Đăng Nhập

1. User click "Đăng nhập bằng Google"
2. Google popup mở
3. User chọn tài khoản
4. Frontend nhận Google token
5. Frontend gửi token đến backend
6. Backend xác minh token
7. Backend kiểm tra user có tồn tại không
8. Trả về JWT + user data
9. Frontend lưu user vào sessionStorage & Recoil
10. Redirect tới dashboard

### Đăng Ký

1. User click "Đăng ký với Google"
2. Tương tự như Đăng Nhập (bước 2-5)
3. Backend kiểm tra email
4. Nếu email chưa tồn tại, tạo user mới
5. Nếu là Teacher, tạo teacher account
6. Trả về JWT + user data
7. Frontend lưu user
8. Redirect tới dashboard

---

## Dependencies đã có

✅ `@react-oauth/google` - Frontend  
✅ `google-auth-library` - Backend  
✅ `jsonwebtoken` - Cả hai  
✅ `bcrypt` - Backend (hashing password)  

---

## Mô tả code

### auth.service.ts

**Thêm:**
```typescript
// Verify Google token using google-auth-library
public verifyGoogleToken = async (token: string) => {
  const ticket = await this.googleClient.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  return { id, email, firstName, lastName, picture }
}
```

### auth.controller.ts

**Thêm:**
```typescript
// Google login/signup handler
public googleLogin = async (req: Request, res: Response) => {
  // 1. Verify token
  // 2. Check if user exists
  // 3. Create user if not exists
  // 4. Generate JWT
  // 5. Return user + token
}
```

### Frontend Login Page

**Thêm:**
```typescript
<GoogleLogin 
  onSuccess={handleLoginSuccess}
  onError={() => alert("Thất bại")}
/>

const handleLoginSuccess = async (response) => {
  // Send Google token to backend
  // Save user to Recoil & sessionStorage
  // Redirect to dashboard
}
```

---

## Nếu có lỗi

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|---------|
| "Invalid Google token" | Token hết hạn hoặc Client ID sai | Kiểm tra `GOOGLE_CLIENT_ID` ở .env backend |
| CORS Error | Origin không được phép | Thêm `http://localhost:3000` vào Google Console |
| Google button không hiển thị | Client ID không được set | Kiểm tra `.env.local` ở frontend |
| User không được tạo | Database error | Kiểm tra database connection, console backend |

---

## Tiếp theo

- Thêm tính năng "Liên kết tài khoản"
- Thêm Social login khác (Facebook, GitHub)
- Thêm Two-factor authentication
- Customize error messages
- Thêm loading states

---

**Last Updated:** 2026-04-21
