
# Luật dự án (PHY10615 – Phát triển ứng dụng web)

## 1. Phiên bản & công nghệ
- Next.js 16.4 App Router, React 19, TypeScript.
- Không dùng Pages Router, getServerSideProps hoặc next/router.
- Tailwind CSS v4 cấu hình qua CSS (@theme), shadcn/ui (Radix), next-themes.
- Prisma ORM 7, generator prisma-client, adapter @prisma/adapter-pg.
- URL kết nối cơ sở dữ liệu được cấu hình trong prisma.config.ts.
- Better Auth 1.7, Zod 4, Vitest và React Testing Library.

## 2. Bảo mật bắt buộc
- Các Server Action và Route Handler xử lý dữ liệu cá nhân phải xác thực session và kiểm tra quyền truy cập.
- userId phải lấy từ session, không tin userId do client gửi lên.
- Khi sửa hoặc xóa dữ liệu, phải kiểm tra quyền sở hữu bằng id và userId.
- Kiểm tra kết quả thao tác để xử lý trường hợp bản ghi không tồn tại hoặc không có quyền.
- Dùng Zod để kiểm tra dữ liệu đầu vào tại server.
- Không commit file .env hoặc đưa khóa bí mật vào NEXT_PUBLIC_*.
- Không sử dụng truy vấn SQL raw không an toàn.
- Các endpoint xác thực công khai của Better Auth được xử lý theo cơ chế bảo mật của Better Auth.

## 3. Quy tắc giao diện
- Giữ phong cách giao diện hiện tại của Finance Planner.
- Sử dụng logo VTTT tại public/vttt-logo.png.
- Giữ nguyên giao diện sáng/tối và khả năng hiển thị trên điện thoại.
- Ưu tiên bố cục gọn gàng, dễ đọc và nhất quán giữa các trang.
- Khi chỉnh sửa UI, không tự ý thay đổi logic nghiệp vụ, xác thực hoặc cấu trúc cơ sở dữ liệu.
- Không thay avatar hoặc thông tin tài khoản bằng logo thương hiệu.
- Hạn chế thêm thư viện và hiệu ứng nặng làm giảm hiệu năng.

## 4. Quy trình phát triển
- Trước khi nộp, chạy:
  - npm run lint
  - npm run typecheck
  - npx vitest run
  - npm run build
- Thay đổi nghiệp vụ cần có kiểm thử tương ứng.
- Kiểm tra lại các chức năng liên quan sau khi sửa code.
- Nếu thêm package npm mới, cần nêu rõ lý do.
- Không chỉnh sửa trực tiếp các file trong node_modules.
- Ghi nhật ký sử dụng AI trung thực trong AI_LOG.md.
- Mã nguồn do AI hỗ trợ phải được kiểm chứng và có khả năng giải thích khi bảo vệ đồ án.

# Luật dự án (PHY10615 – Phát triển ứng dụng web)

## 1. Phiên bản & công nghệ
- Next.js 16.4 App Router, React 19, TypeScript.
- Không dùng Pages Router, getServerSideProps hoặc next/router.
- Tailwind CSS v4 cấu hình qua CSS (@theme), shadcn/ui (Radix), next-themes.
- Prisma ORM 7, generator prisma-client, adapter @prisma/adapter-pg.
- URL kết nối cơ sở dữ liệu được cấu hình trong prisma.config.ts.
- Better Auth 1.7, Zod 4, Vitest và React Testing Library.

## 2. Bảo mật bắt buộc
- Các Server Action và Route Handler xử lý dữ liệu cá nhân phải xác thực session và kiểm tra quyền truy cập.
- userId phải lấy từ session, không tin userId do client gửi lên.
- Khi sửa hoặc xóa dữ liệu, phải kiểm tra quyền sở hữu bằng id và userId.
- Kiểm tra kết quả thao tác để xử lý trường hợp bản ghi không tồn tại hoặc không có quyền.
- Dùng Zod để kiểm tra dữ liệu đầu vào tại server.
- Không commit file .env hoặc đưa khóa bí mật vào NEXT_PUBLIC_*.
- Không sử dụng truy vấn SQL raw không an toàn.
- Các endpoint xác thực công khai của Better Auth được xử lý theo cơ chế bảo mật của Better Auth.

## 3. Quy tắc giao diện
- Giữ phong cách giao diện hiện tại của Finance Planner.
- Sử dụng logo VTTT tại public/vttt-logo.png.
- Giữ nguyên giao diện sáng/tối và khả năng hiển thị trên điện thoại.
- Ưu tiên bố cục gọn gàng, dễ đọc và nhất quán giữa các trang.
- Khi chỉnh sửa UI, không tự ý thay đổi logic nghiệp vụ, xác thực hoặc cấu trúc cơ sở dữ liệu.
- Không thay avatar hoặc thông tin tài khoản bằng logo thương hiệu.
- Hạn chế thêm thư viện và hiệu ứng nặng làm giảm hiệu năng.

## 4. Quy trình phát triển
- Trước khi nộp, chạy:
  - npm run lint
  - npm run typecheck
  - npx vitest run
  - npm run build
- Thay đổi nghiệp vụ cần có kiểm thử tương ứng.
- Kiểm tra lại các chức năng liên quan sau khi sửa code.
- Nếu thêm package npm mới, cần nêu rõ lý do.
- Không chỉnh sửa trực tiếp các file trong node_modules.
- Ghi nhật ký sử dụng AI trung thực trong AI_LOG.md.
- Mã nguồn do AI hỗ trợ phải được kiểm chứng và có khả năng giải thích khi bảo vệ đồ án.
