# AGENTS.md – Finance Planner

## Luật dự án (PHY10615 – Phát triển ứng dụng web)

Các quy tắc dưới đây được áp dụng khi phát triển, chỉnh sửa và kiểm thử mã nguồn Finance Planner, bao gồm những thay đổi có AI hỗ trợ.

### 1. Phiên bản & công nghệ (không tự ý thay đổi)

- Duy trì **Next.js 16.4.6 (App Router)**, **React 19**, **TypeScript** và cấu trúc thư mục `app/` hiện tại. Không chuyển sang Pages Router, `getServerSideProps` hoặc `next/router`. Nếu cần xử lý ở tầng proxy, dùng `proxy.ts` theo Next.js 16, không tạo `middleware.ts` theo hướng dẫn cũ.
- Dùng **Tailwind CSS v4** cấu hình trong CSS với `@theme`, **shadcn/ui dựa trên Radix**, **next-themes** cho giao diện sáng/tối, **Recharts** cho biểu đồ và **Sonner** cho thông báo. Không tạo `tailwind.config.js` theo cấu trúc Tailwind v3; khi cần thêm thành phần giao diện, ưu tiên `npx shadcn@latest add <component>` sau khi được đồng ý.
- Giữ **Prisma ORM 7.10.1** và **PostgreSQL trên Neon**. Trong `prisma/schema.prisma`, sử dụng generator `prisma-client` có `output`, kết nối qua `@prisma/adapter-pg` và cấu hình URL trong `prisma.config.ts`. Thay đổi mô hình dữ liệu phải đi kèm migration; không tự nâng Prisma lên 8.
- Duy trì **Better Auth 1.7** cho email/mật khẩu và đăng nhập GitHub; không chuyển sang NextAuth/Auth.js. Session được lấy ở server qua `auth.api.getSession({ headers: await headers() })`, dùng các hàm `getUser()` và `requireUser()` trong `lib/session.ts` tùy loại endpoint.
- Dùng **Zod 4** để kiểm tra dữ liệu đầu vào phía server (`safeParse`, `z.flattenError()` và các API Zod 4 phù hợp). Không chỉ dựa vào validation ở trình duyệt.
- Sử dụng **Vitest 5** và **React Testing Library** cho unit test/component test. Playwright chỉ dùng cho E2E nếu có cấu hình và bài kiểm thử thực tế; không ghi nhận là đã triển khai khi chưa có.

### 2. Bảo mật & xử lý dữ liệu (bắt buộc)

- Các trang riêng tư và **Server Action** phải xác thực người dùng ở phía server bằng `requireUser()` trước khi đọc hoặc thay đổi dữ liệu. **Route Handler** xử lý dữ liệu riêng tư kiểm tra phiên bằng `getUser()` và trả HTTP `401` khi chưa đăng nhập. Các endpoint công khai như callback Better Auth hoặc API tỷ giá được xử lý riêng, nhưng vẫn phải kiểm tra đầu vào và không làm lộ bí mật.
- Mọi truy vấn giao dịch, mục tiêu tiết kiệm, ngân sách và mốc thông báo phải giới hạn theo **`userId` lấy từ session**; không nhận `userId` do client gửi lên làm căn cứ phân quyền.
- Khi sửa hoặc xóa bản ghi, kiểm tra đồng thời `id` và `userId`; với thao tác phù hợp, dùng `updateMany`/`deleteMany` và kiểm tra `count`. Riêng ngân sách được cập nhật theo khóa duy nhất gồm `userId`, danh mục và tháng.
- Dữ liệu đầu vào của form và API phải được kiểm tra bằng Zod ở server. Số tiền giao dịch lưu dưới dạng **số nguyên VND dương**; mô tả giao dịch phải tuân theo giới hạn của schema. Bộ lọc giao dịch dùng `searchParams` và xử lý phía server; tham số không hợp lệ phải trả lỗi rõ ràng.
- CSV nhập vào phải được kiểm tra định dạng và dữ liệu; CSV xuất ra chỉ chứa dữ liệu của tài khoản đang đăng nhập. API quy đổi USD/EUR sang VND chỉ nhận loại tiền được hỗ trợ, lấy tỷ giá ở server và không thay đổi dữ liệu giao dịch VND.
- Không commit `.env` hoặc đưa `DATABASE_URL`, `BETTER_AUTH_SECRET`, `GITHUB_CLIENT_SECRET` vào mã nguồn hay biến `NEXT_PUBLIC_*`. Không dùng `dangerouslySetInnerHTML` hoặc `$queryRawUnsafe`.

### 3. Quy trình chỉnh sửa, kiểm thử & sử dụng AI

- Giữ tên ứng dụng **Finance Planner**, giao diện tiếng Việt, logo VTTT và bố cục hiện tại. Khi chỉnh sửa giao diện, không tự ý thay đổi logic nghiệp vụ, cơ chế đăng nhập hoặc Prisma schema. Đọc phiên bản file đang dùng trước khi sửa, tránh ghi đè bằng mã từ phiên bản cũ.
- Khi thay đổi CRUD giao dịch, Wishlist, Budget, công thức số dư/tiến độ, thông báo tiết kiệm, CSV hoặc quy đổi tiền tệ, phải cập nhật hoặc bổ sung bài kiểm thử tương ứng. Sau khi sửa, kiểm tra lại các chức năng có liên quan.
- Trước khi hoàn tất một thay đổi, chạy các bước kiểm tra sau (trên PowerShell có thể dùng `npm.cmd` thay `npm`):

  ```powershell
  npm run lint
  npm run typecheck
  npx vitest run
  npm run build
  ```

- Duy trì GitHub Actions thực hiện lint, typecheck, test và build. Không kết luận bản cập nhật đạt chỉ từ kết quả CI của commit trước đó.
- Không tự cài package npm mới. Khi cần thêm gói, nêu **tên gói, lý do, đường dẫn npm** và chờ xác nhận trước khi cài. Không sửa trực tiếp `node_modules/`, `.next/` hoặc Prisma Client sinh tự động.
- Mã và nội dung do AI gợi ý phải được đọc, kiểm chứng và chỉnh sửa cho phù hợp với dự án. Sau mỗi lần dùng AI, ghi tóm tắt **nhiệm vụ, cách sử dụng, kết quả kiểm thử/chỉnh sửa và commit liên quan** vào `AI_LOG.md`; không ghi các bước chưa thực hiện như đã hoàn thành.
