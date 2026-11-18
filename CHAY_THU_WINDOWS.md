# HƯỚNG DẪN CHẠY THỬ – DỄ LÀM (Windows)

## Cách chạy ZIP này

1. **Giải nén** ZIP thành thư mục mới `finance-planner-hoan-chinh`. **Không xóa project cũ**.
2. Mở VS Code → **File → Open Folder** → chọn thư mục mới.
3. Mở Terminal → gõ `node -v` (khuyến nghị **Node 24**). Nếu Node 26 trên máy gây lỗi package, chuyển Node 24 LTS.
4. Gõ `npm.cmd install` (cần Internet; cài package có thể mất thời gian).
5. Sao chép `.env.example` thành `.env`. Trong `.env`, thay:
   - `DATABASE_URL` = URL Neon **pooled** (có `-pooler` trong hostname).
   - `DATABASE_URL_UNPOOLED` = URL Neon **direct** (không `-pooler`).
   - `BETTER_AUTH_SECRET` = chuỗi ngẫu nhiên đủ dài, **không để mẫu mặc định**.
   - `BETTER_AUTH_URL=http://localhost:3000`.
   - Nếu muốn demo cố định: `DEMO_EMAIL=demo@financeplanner.local` và `DEMO_PASSWORD` đủ mạnh (không được commit).
6. **Sao lưu project Neon trước bước migrate.** Mở Neon → Database → Backup (nếu có) hoặc export database.
7. Trong Terminal, gõ lần lượt:

```powershell
npx.cmd prisma migrate status
npx.cmd prisma migrate deploy
npx.cmd prisma generate
npx.cmd prisma db seed
npm.cmd run dev
```

8. Mở trình duyệt `http://localhost:3000/login`; đăng nhập demo (password bạn đã đặt trước khi seed, hoặc password Terminal in ra khi tạo user lần đầu). Nếu bạn không seed: bấm Đăng ký để tạo tài khoản mới; tài khoản mới sẽ bắt đầu trống.
9. Thử 4 menu: **Tổng quan**, **Giao dịch**, **Mục tiêu tiết kiệm**, **Ngân sách**.

**Nếu migration báo drift hoặc reset:** DỪNG, không gõ `prisma migrate reset`. Bạn cần xem schema Neon trước, tránh mất 31 giao dịch cũ.

## Chạy kiểm tra

```powershell
npm.cmd run lint
npm.cmd run typecheck
npx.cmd vitest run
npm.cmd run build
```

Sau khi `npm.cmd install` tạo `package-lock.json`, **commit file đó lên GitHub** để CI có thể tái lập bộ package.

## Lỗi thường gặp

- `npm.ps1 cannot be loaded`: dùng `npm.cmd`, `npx.cmd` như trên.
- `P1001`: kiểm tra kết nối Neon và URL direct, quyền truy cập Internet.
- `P1012`: kiểm tra `schema.prisma`, không dán code TypeScript (`import`) vào schema.
- `Unknown argument description`: bạn đang chạy project/schema cũ; project mới đã chuẩn hóa tên `description`.
- `401` ở `/api/transactions`: **đúng khi chưa đăng nhập**, vì đồ án cuối bắt buộc bảo mật.
- Login GitHub bị vô hiệu: bạn chưa đặt `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`; không phải lỗi email/password.
- Không còn thấy giao dịch cũ sau khi đăng nhập mới: đó là dữ liệu của user lab cũ; không được xem sang user khác. Mọi giao dịch nằm trong database, chưa bị xóa.
- `Route ... prerender`: gói này chủ động đặt `cacheComponents: false`, khác code mẫu lab ban đầu.

## Cần làm trước khi nộp

1. Chạy test thành công, tự hiểu code và ghi AI_LOG đúng thực tế.
2. Tạo GitHub repo public, commit thường xuyên, tag `fp1`, `fp2`, `fp3`, `v1.0` **theo các mốc thực tế**; không sửa lịch sử để giả mạo thời điểm.
3. Deploy Vercel production, thêm biến môi trường và OAuth callback GitHub production.
4. Dùng cửa sổ ẩn danh kiểm tra link production và tài khoản demo, chụp ảnh điền README.
5. Không đưa `.env`, mật khẩu Neon hoặc GitHub OAuth secret vào repo hoặc ảnh chụp gửi công khai.
