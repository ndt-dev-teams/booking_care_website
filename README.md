# Booking Care Website

Dự án Hệ thống Đặt Lịch Khám Bệnh (Booking Care Website) với đầy đủ tính năng dành cho Bệnh nhân, Bác sĩ và Quản trị viên.

Dự án có thể được trải nghiệm trực tiếp trên môi trường production đã được deploy, hoặc bạn có thể tự cài đặt và chạy ở dưới local thông qua Docker.

---

## Cách 1: Sử dụng Web trực tiếp (Production)

Toàn bộ dự án đã được deploy hoàn chỉnh lên các nền tảng Render, Vercel và Supabase. Bạn không cần phải cài đặt hay setup gì cả, chỉ cần một thiết bị có kết nối Internet, mở trình duyệt và truy cập vào đường link dưới đây:

**[https://booking.simonthuan.dev](https://booking.simonthuan.dev)**

Trang web đã được cấu hình đầy đủ chứng chỉ bảo mật (HTTPS) và kết nối sẵn đến Database thật. Bạn có thể đăng ký tài khoản, đăng nhập và trải nghiệm luồng đặt lịch khám bệnh như một hệ thống thực tế trên thị trường.

---

## Cách 2: Chạy dự án bằng Docker (Local)

Đây là cách để bạn đóng gói và chạy toàn bộ hệ thống (Database, Backend, Frontend) trên máy tính cá nhân (hoặc trên server của nhà trường) chỉ với vài câu lệnh thông qua Docker.

### Yêu cầu hệ thống
- Máy tính đã cài đặt [Docker](https://www.docker.com/products/docker-desktop/) và Docker Compose.
- Cài đặt sẵn Node.js trên máy (để chạy seed dữ liệu mẫu).

### Các bước khởi chạy

**Bước 1: Thiết lập biến môi trường**
Tại thư mục gốc của dự án, bạn copy file `.env.example` thành file `.env`:
```bash
cp .env.example .env
```
Sau đó, mở file `.env` vừa tạo và điền các thông tin cấu hình còn thiếu (Ví dụ: `RESEND_API_KEY`, `CLOUDINARY_CLOUD_NAME`, khóa bí mật cho JWT, Google OAuth...). 

*Lưu ý: Nếu chỉ cần kiểm tra giao diện và các luồng chức năng cơ bản, bạn có thể tự tạo một chuỗi ngẫu nhiên cho các khóa JWT và giữ nguyên các config khác.*

**Bước 2: Khởi động hệ thống bằng Docker Compose**
Mở terminal tại thư mục gốc của dự án (nơi có file `docker-compose.yaml`) và chạy lệnh:
```bash
docker compose up -d --build
```
Lệnh này sẽ tự động tải các base image, build source code frontend/backend, cấu hình Nginx và khởi động tất cả lên. Ở lần khởi động đầu tiên, container backend sẽ tự động chạy lệnh cập nhật cấu trúc bảng cho Database (`npx prisma db push`).

**Bước 3: Khởi tạo dữ liệu mẫu (Seed Data)**
Để website có sẵn dữ liệu của các bác sĩ, chuyên khoa, bệnh viện cho bạn test chức năng đặt lịch, bạn mở terminal ở thư mục `backend/` và chạy lệnh sau (chạy từ máy ngoài host) - phải đảm bảo DATABASE_URL trong .env của backend phải trùng khớp với .env bên ngoài thư mục gốc:
```bash
cd backend
npm install
npx prisma db seed
```

**Bước 4: Trải nghiệm ứng dụng tại Local**
Khi quá trình khởi động và seed dữ liệu hoàn tất, bạn có thể truy cập các dịch vụ tại:
- **Trang chủ Frontend:** [http://localhost:3564](http://localhost:3564)
- **API Backend:** [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

*Khi không sử dụng nữa, để tắt toàn bộ hệ thống Docker, bạn chạy lệnh:*
```bash
docker compose down
```
