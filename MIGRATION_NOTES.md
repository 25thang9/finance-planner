# Nâng cấp database: từ code mẫu Tuần 8 lên đồ án cuối

## Vì sao có 2 migration?

Bản `finance-planner.rar` ban đầu của bạn có migration `20261110031947_init_finance_schema`, mô hình:

- `Transaction.note` (String?), `Transaction.amount` (Float), ngày có default.
- `WishlistItem.price` (Float), `isBought` Boolean.
- `User` mới có id/email/name.
- 4 danh mục FOOD, TRANSPORT, SALARY, OTHER.

Đề cá nhân yêu cầu `Transaction.description`, `amount Int`, `WishlistItem.cost Int`, thêm 4 danh mục và Better Auth. Vì vậy:

1. Migration `20261110031947_init_finance_schema` giữ **đúng SQL đã có** từ dự án gốc.
2. Migration `202611170001_full_finance_planner` **đổi tên cột và đổi kiểu dữ liệu**, thêm auth, wishlist milestone, budget; giữ nguyên bản ghi hiện có và giữ cả `isBought` của lab.

## Trước khi chạy

- Backup Neon. Chắc chắn đang dùng **cùng branch**, `neondb`, pooled cho app và direct cho migrations.
- Kiểm tra `npx.cmd prisma migrate status` trước.
- Nếu migration trước đó ở Neon có tên/checksum khác file trong ZIP, **dừng lại** để đối chiếu. Không dùng `migrate reset` hay `db push --force-reset`.
- Khi chuyển Float sang Int, SQL dùng `ROUND`: ví dụ `5000.7 → 5001`. Tiền thực tế VND cần kiểm tra lại.
- Schema bổ sung cột `isBought` (dữ liệu cũ, không được dùng trong form) để không mất trạng thái cũ.

## Sau migrate

Chạy `npx.cmd prisma generate`, rồi `npx.cmd prisma db seed` để tạo tài khoản demo mới có Better Auth. Không xóa `User` cũ vì họ có thể còn 31 giao dịch từ Tuần 8/9.

> Đây là kế hoạch nâng cấp dựa trên bản migration đã đọc từ file `.rar` gốc. Khi database Neon thực tế đã bị sửa ngoài file migration (drift), cần chỉnh kế hoạch cho đúng trạng thái database thay vì chạy ép.
