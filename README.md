
# Finance Planner

**Đồ án cá nhân – PHY10615 | HK1 2026–2027**

Finance Planner là ứng dụng web quản lý tài chính cá nhân, hỗ trợ theo dõi thu nhập, chi tiêu, quản lý ngân sách và mục tiêu tiết kiệm.

Ứng dụng được xây dựng bằng Next.js, Prisma và PostgreSQL Neon, có giao diện tiếng Việt, hỗ trợ responsive và chế độ sáng/tối.

## 1. Thông tin dự án

- **GitHub:** https://github.com/25thang9/finance-planner
- **Website:** https://finance-planner-25thang9.vercel.app
- **Mức sử dụng AI:** Mức 3 – AI cộng tác

## 2. Công nghệ sử dụng

- Next.js 16.4, React 19, TypeScript
- Tailwind CSS 4, shadcn/ui
- Prisma ORM 7, PostgreSQL Neon
- Better Auth, Zod 4
- Recharts, Sonner
- Vitest, React Testing Library
- GitHub Actions, Vercel

## 3. Chức năng

| Chức năng | Trạng thái |
|---|---|
| Đăng ký, đăng nhập và đăng xuất | ✅ |
| Đăng nhập bằng GitHub | ✅ |
| Quản lý giao dịch thu chi | ✅ |
| Lọc và tìm kiếm giao dịch | ✅ |
| Dashboard và biểu đồ thống kê | ✅ |
| Quản lý mục tiêu tiết kiệm (Wishlist) | ✅ |
| Thông báo các mốc tiết kiệm | ✅ |
| Quản lý ngân sách theo tháng | ✅ |
| Cảnh báo khi đạt 80% và 100% ngân sách | ✅ |
| Giao diện responsive và Light/Dark Mode | ✅ |
| Unit test và component test | ✅ |
| GitHub Actions và triển khai Vercel | ✅ |

## 4. Hướng dẫn chạy local

Yêu cầu: Node.js 24 và cơ sở dữ liệu PostgreSQL Neon.

**Bước 1: Cài đặt thư viện**

```powershell
npm.cmd ci
```

**Bước 2: Cấu hình môi trường**

Tạo file `.env` từ `.env.example` và điền thông tin kết nối cơ sở dữ liệu, Better Auth và GitHub OAuth.

**Bước 3: Khởi tạo Prisma**

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate status
npx.cmd prisma migrate deploy
```

**Bước 4: Chạy ứng dụng**

```powershell
npm.cmd run dev
```

Truy cập http://localhost:3000.

## 5. Kiểm thử

```powershell
npm.cmd run lint
npm.cmd run typecheck
npx.cmd vitest run
npm.cmd run build
```

Dự án sử dụng Vitest và React Testing Library để kiểm tra logic nghiệp vụ và component. GitHub Actions được cấu hình để kiểm tra mã nguồn tự động.

## 6. Quyết định kỹ thuật

- Sử dụng kiểu `Int` để lưu giá trị tiền VND.
- Kiểm tra dữ liệu đầu vào bằng Zod.
- Sử dụng session và `userId` để bảo vệ dữ liệu người dùng.
- Lưu bộ lọc giao dịch trên URL bằng `searchParams`.
- Sử dụng Server Actions để xử lý các thao tác dữ liệu.

## 7. Giới hạn hiện tại

- Ứng dụng cần kết nối với PostgreSQL Neon.
- GitHub OAuth cần cấu hình thông tin xác thực.
- Chưa tích hợp kiểm thử E2E bằng Playwright.
- Chưa hỗ trợ thông báo tiết kiệm qua email hoặc push notification.

## 8. Tài liệu liên quan

Dự án được phát triển từ các bài thực hành Tuần 8–10 trên [WebLab](https://weblab.koomaru.com/) và tiếp tục được hoàn thiện với sự hỗ trợ của ChatGPT.

- [AI_LOG.md](./AI_LOG.md) – Nhật ký sử dụng AI.
- [AGENTS.md](./AGENTS.md) – Quy tắc kỹ thuật của dự án.

---

**Finance Planner – PHY10615**
