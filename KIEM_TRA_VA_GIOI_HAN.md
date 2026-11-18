# Bàn giao bản ZIP – kiểm tra và giới hạn

## Đã kiểm tra trong môi trường tạo ZIP
- Đọc PDF đề bài cá nhân và code mẫu Tuần 7/8/9.
- Soát kiến trúc tất cả route, Server Actions, trường Prisma và luồng quyền sở hữu.
- Đã parse cú pháp 54 file TS/TSX/MTS bằng TypeScript compiler toàn cục, không gặp syntax error.
- Đã thực thi 8 smoke tests hàm thuần tài chính bằng Node: số dư, thống kê, chuyển năm, wishlist và ngân sách: **8/8 đạt**.
- Đã xác nhận import nội bộ không thiếu đường dẫn, ngoại trừ `generated/prisma/*` phải được sinh qua `prisma generate`.

## Chưa thể xác nhận ở môi trường tạo ZIP
- `npm install`, `next build`, chạy Vitest và kết nối Neon thật vì môi trường đóng gói không truy cập được registry npm và không có .env thực.
- Đăng nhập GitHub OAuth, Vercel production/CI, tài khoản demo thực và từng test với database thật.
- Các bước trên cần bạn chạy trên máy có Internet, gửi log lỗi (nếu có) để xử lý đúng phiên bản.

## Lưu ý bảo mật và học thuật
- Không đưa mật khẩu Neon, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_SECRET` vào ZIP.
- Cô yêu cầu AI Mức 3 và hiểu code; hãy dùng bộ mã này làm cơ sở học, tự kiểm tra và ghi AI_LOG trung thực.
- Không tự đánh dấu pass hay khai báo tag Git/CI/Vercel trước khi thực sự kiểm tra.
