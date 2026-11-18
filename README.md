# Finance Planner · PHY10615 · Đồ án cá nhân

Ứng dụng **quản lý tài chính cá nhân** với Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS 4, shadcn/ui kiểu Radix, Prisma ORM 7 và PostgreSQL Neon. Giao diện tiếng Việt, responsive và hỗ trợ light/dark mode.

> **Lưu ý:** Đây là mã tham khảo được AI hỗ trợ theo đề bài. Người học phải tự cài đặt, kiểm thử, giải thích được code và điền AI_LOG trung thực theo quy định **Mức AI 3**. **Chưa có link production, tài khoản demo thực tế, lịch sử Git tag hay kết quả CI được xác nhận.**

## Tính năng

| Yêu cầu đồ án | Mã nguồn |
|---|---|
| Email/mật khẩu + GitHub OAuth (Better Auth) | ✅ Có; GitHub chỉ chạy khi cấu hình OAuth |
| Bảo vệ page, action, route theo session + `userId` | ✅ Có |
| Thêm/xem/sửa/xóa giao dịch bằng Server Actions + Zod | ✅ Có |
| 8 danh mục, số tiền nguyên dương, lỗi ở từng ô | ✅ Có |
| Lọc tháng/loại/danh mục/mô tả trên URL | ✅ Có |
| API JSON trả 401 chưa login, 400 filter sai | ✅ Có |
| Dashboard số dư, biểu đồ tròn + bảng dữ liệu a11y | ✅ Có |
| Biểu đồ cột xu hướng 6 tháng | ✅ Có |
| Wishlist CRUD, mức ưu tiên, tiến độ 0–100% | ✅ Có |
| Lưu mốc tiết kiệm 50/75/100% duy nhất + Sonner toast | ✅ Có (kích hoạt khi thêm/sửa/xóa giao dịch làm tăng số dư vượt mốc) |
| Tính năng mở rộng: ngân sách theo tháng/danh mục, cảnh báo 80%/100% | ✅ Có |
| ≥8 unit test, ≥1 RTL component test | ✅ Có mã test; cần chạy kiểm chứng |
| GitHub Actions lint/typecheck/test/build | ✅ Có workflow; cần đẩy lên GitHub để kiểm chứng |
| Live production Vercel và OAuth GitHub | ⏳ Bạn tự kết nối, không nằm trong ZIP |
| Git tags `fp1`, `fp2`, `fp3`, `v1.0` | ⏳ Cần tạo trên Git, không giả mạo mốc cũ |

## Chạy local trên Windows (PowerShell)

**Khuyến nghị Node.js 24**; chạy các lệnh trong thư mục chứa `package.json`.

1. `npm.cmd install`
2. Tạo `.env` bằng cách **copy** `.env.example`, điền hai URL từ **cùng Neon project/branch/database** (pooler + direct). Giữ nguyên tên biến `DATABASE_URL` và `DATABASE_URL_UNPOOLED`.
3. Tạo `BETTER_AUTH_SECRET` tối thiểu 32 ký tự (PowerShell: `[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`) và `BETTER_AUTH_URL=http://localhost:3000`.
4. **Sao lưu Neon trước migration.** Chạy `npx.cmd prisma migrate status`, rồi `npx.cmd prisma migrate deploy`. Nếu báo drift, sửa migration hợp lệ trước; **không chạy `migrate reset`**.
5. `npx.cmd prisma generate`
6. Tùy chọn: đặt `DEMO_PASSWORD` đủ mạnh trong `.env`, rồi `npx.cmd prisma db seed`. Nếu bỏ trống, lệnh seed tạo mật khẩu ngẫu nhiên **và in ra Terminal chỉ ở lần đầu tạo user**; lưu riêng mật khẩu đó. Lệnh seed không xóa giao dịch hiện có.
7. `npm.cmd run dev` → mở `http://localhost:3000` → đăng nhập hoặc đăng ký.

**Lưu ý database cũ:** Code mẫu Tuần 8 của bạn lưu `note`/`price` kiểu `Float`. Bộ migration này giữ migration ban đầu và nâng cấp tên cột lên `description`/`cost` kiểu `Int`, bổ sung 8 danh mục và bảng xác thực. Các giao dịch trước đó vẫn thuộc **user cũ**; không tự hiển thị trong user mới đăng ký (đúng phân quyền).

### Đăng nhập bằng GitHub
1. Vào GitHub Developer Settings → OAuth Apps → New OAuth App.
2. Homepage URL: `http://localhost:3000`.
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`.
4. Thêm `GITHUB_CLIENT_ID` và `GITHUB_CLIENT_SECRET` vào `.env`. Khởi động lại Next.js.
5. Sau khi deploy Vercel, dùng domain production cho Homepage/callback (tạo OAuth App production riêng nếu cần) và chỉnh `BETTER_AUTH_URL` thành URL thật.
6. **Không** commit client secret lên GitHub.

## Kiểm thử và CI

```powershell
npx.cmd prisma generate
npm.cmd run lint
npm.cmd run typecheck
npx.cmd vitest run
npm.cmd run build
```

Các bài test gồm business logic số dư, thống kê, lọc năm/tháng, wishlist, mốc và ngân sách; Zod validation; một component test RTL. Workflow ở `.github/workflows/ci.yml` chạy cùng các bước trên sau khi được push.

### Checklist tự test thủ công
- [ ] Đăng ký, đăng nhập, đăng xuất email + mật khẩu.
- [ ] GitHub OAuth khi đủ biến cấu hình.
- [ ] Không login → `/api/transactions?range=all` trả `401`; không đọc được dashboard.
- [ ] Login → `/api/transactions?type=XYZ` trả `400`; hợp lệ trả `200` và **không có** userId người khác.
- [ ] Thêm 5.000đ, giao dịch tăng 1; thử -5000 và mô tả rỗng → có lỗi dưới ô và DB không đổi.
- [ ] Sửa, xóa giao dịch; dùng user B không được sửa/xóa ID của user A.
- [ ] Lọc `range=last-month&type=EXPENSE&category=FOOD`; copy URL sang tab khác vẫn ra đúng.
- [ ] Dashboard tổng thu − tổng chi = số dư; bảng số liệu khớp biểu đồ.
- [ ] Wishlist thêm/sửa/xóa; kiểm tra tiến độ 0–100, số dư âm là 0.
- [ ] Khi thu nhập khiến số dư vượt 50/75/100% wishlist, toast chỉ xuất hiện lần đầu (unique DB).
- [ ] Ngân sách đạt 80%/100% có cảnh báo; thử đổi tháng.
- [ ] Giao diện trên điện thoại, phím Tab, nhãn form; dark mode.
- [ ] CI xanh và Vercel production mở trong cửa sổ ẩn danh.

## Nộp bài
- Repo GitHub **public** thuộc tài khoản cá nhân, dùng `git` và commit trung thực. Tag `fp1`, `fp2`, `fp3`, `v1.0` **sau khi thực sự hoàn thành từng giai đoạn** (không backdate).
- Link **Vercel production**, không nộp Preview URL; cấu hình environment variables + chạy migration bằng kết nối direct, không dùng `migrate reset` trên production.
- Một email/password demo **do bạn quản lý**, ghi theo kênh nộp bài của cô (không public mật khẩu trong repo).
- README mô tả, cách chạy, ảnh chụp 3 trang (điền sau), checklist; AI_LOG.md cập nhật có bằng chứng thực tế.
- Mức AI 3: khai báo chính xác cách bạn dùng công cụ, phải giải thích được code và sửa được khi bị hỏi.

### Quyết định kỹ thuật
- Tiền VND lưu `Int`, không dùng số thực để tránh sai số số học.
- `requireUser()` chạy trong page/action; action `updateMany/deleteMany` ràng buộc `{ id,userId }`.
- Không dùng Zustand: URL `searchParams` là nguồn sự thật cho các bộ lọc.
- Tắt `cacheComponents` của Next 16 để giảm vấn đề prerender khi truy vấn dữ liệu tài chính luôn phụ thuộc session.
- Thêm migration từ cấu trúc lab Tuần 8, không xóa dữ liệu Neon đang có.

### Giới hạn đã biết
- Website cần Neon online; không có database offline đi kèm.
- OAuth GitHub không dùng được khi chưa có GitHub OAuth credentials, không tự kích hoạt.
- Lưu mốc chỉ tạo toast sau thao tác **thêm/sửa/xóa** giao dịch làm tăng số dư vượt mốc; không gửi email/push ngoài ứng dụng.
- Seed tài khoản demo cũ từ lab (không có password Better Auth) không thể đăng nhập đến khi tự tạo tài khoản auth mới.
- Cần `npm install` để tạo `package-lock.json` trên máy có Internet trước khi đẩy GitHub để chạy `npm install` hoặc `npm ci` trong workflow.
- Không có kiểm thử E2E Playwright (đề khuyến khích, không bắt buộc).
- Mã nguồn chưa được xác nhận build/test trong môi trường tạo ZIP do registry npm không truy cập được; xem file `KIEM_TRA_VA_GIOI_HAN.md`.

## Tham chiếu và nhật ký
- Code mẫu Tuần 7/8/9 và PDF đề bài cô cung cấp; mô hình `getDateRange`, `wishlistProgress`, `crossedMilestones` được giữ theo bài giảng.
- [AI_LOG.md](./AI_LOG.md)
- [AGENTS.md](./AGENTS.md)
