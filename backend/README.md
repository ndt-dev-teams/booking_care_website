# Backend Setup

Đây là hướng dẫn chạy dự án backend (NestJS) môi trường development.

## Yêu cầu môi trường
- Node.js
- Docker & Docker Compose
- npm

## Các bước chạy

1. **Cài đặt thư viện**
   ```bash
   npm install
   ```

2. **Khởi động Database**
   Dự án sử dụng PostgreSQL chạy qua Docker.
   ```bash
   docker-compose up -d
   ```

3. **Cấu hình môi trường**
   Copy file `.env.example` thành `.env` (nếu có) và cập nhật các thông số kết nối Database (theo ý).
   ```bash
   cp .env.example .env
   ```

4. **Chạy ứng dụng**
   ```bash
   npm run start:dev
   ```
   Server mặc định sẽ chạy ở cổng được cấu hình trong file `.env` (hoặc mặc định là `http://localhost:8000`).
