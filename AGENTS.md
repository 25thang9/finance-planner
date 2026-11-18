# Luật dự án (PHY10615 – Phát triển ứng dụng web)

## Phiên bản & công nghệ
- Next.js 16.4 App Router, React 19, TypeScript. Không dùng Pages Router, getServerSideProps hoặc next/router.
- Tailwind CSS v4 cấu hình qua CSS (@theme); shadcn/ui (Radix), next-themes.
- Prisma ORM 7 (không nâng v8), generator `prisma-client` có output, adapter `@prisma/adapter-pg`. URL kết nối trong `prisma.config.ts`.
- Better Auth 1.7, Zod 4, Vitest và React Testing Library.

## Bảo mật bắt buộc
- Mọi Server Action và Route Handler cần session và phân quyền theo `userId` lấy từ session.
- Với sửa/xóa, luôn kiểm tra `{ id, userId }`, và kiểm tra `count` kết quả.
- Zod validate ở server; không tin dữ liệu gửi từ client.
- Không commit `.env`, không đặt bí mật trong `NEXT_PUBLIC_*`, không dùng query raw không an toàn.

## Quy trình
- Trước nộp chạy `npm run lint`, `npm run typecheck`, `npx vitest run`, `npm run build`.
- Mọi thay đổi nghiệp vụ kèm test.
- Nếu thêm gói npm mới, nêu lý do trước khi cài.
- Ghi nhật ký AI trung thực trong `AI_LOG.md`, sinh viên phải hiểu và tự kiểm chứng mã nguồn.
