
# AI_LOG – Nhật ký sử dụng AI

**Dự án:** Finance Planner – Đồ án cá nhân PHY10615  
**Mức sử dụng AI:** Mức 3 – AI cộng tác  
**Công cụ AI:** ChatGPT

## 1. Quá trình thực hiện trước khi sử dụng AI

Giai đoạn đầu, dự án Finance Planner được thực hiện theo các bài hướng dẫn Tuần 8, 9 và 10 trên trang WebLab của môn học: https://weblab.koomaru.com/.

Các nội dung thực hành được viết và chạy thử trên máy cá nhân, bao gồm kết nối cơ sở dữ liệu, sử dụng Prisma, xây dựng Dashboard và các chức năng quản lý giao dịch. Giai đoạn thực hành theo WebLab không sử dụng AI để làm thay bài học.

Ngày 17/11/2026, phiên bản local đã hiển thị Dashboard với tổng thu, tổng chi, số dư và thống kê theo danh mục. Trang Transactions hiển thị danh sách 30 giao dịch và biểu mẫu thêm giao dịch. Kết quả được ghi nhận bằng ảnh chụp màn hình.

Sau giai đoạn thực hành, ChatGPT được sử dụng để hỗ trợ hoàn thiện ứng dụng theo yêu cầu của đồ án.

## 2. Nhật ký sử dụng AI

| Ngày | Công cụ | Việc nhờ AI | Prompt (tóm tắt) | Kết quả sử dụng | Kiểm chứng / điều chỉnh | Commit |
|---|---|---|---|---|---|---|
| 17–18/11/2026 | ChatGPT | Rà soát và hoàn thiện Finance Planner | Đối chiếu ứng dụng đã làm theo WebLab với đề đồ án, bổ sung các yêu cầu còn thiếu | Sử dụng mã nguồn và hướng dẫn của AI để hoàn thiện các chức năng | Tích hợp vào dự án, chạy thử trên localhost và kiểm tra giao diện | `7a806a8` |
| 17–18/11/2026 | ChatGPT | Hỗ trợ hoàn thiện chức năng | Hỗ trợ CRUD giao dịch, Wishlist, biểu đồ, thông báo tiết kiệm, ngân sách và xác thực | Điều chỉnh mã nguồn để bổ sung các chức năng theo yêu cầu | Chạy thử chức năng, kiểm tra đăng nhập và dữ liệu giữa các tài khoản | `7a806a8` |
| 18/11/2026 | ChatGPT | Hỗ trợ kiểm thử và triển khai | Hướng dẫn xử lý lỗi, chạy kiểm thử và triển khai trên GitHub, Vercel | Sử dụng hướng dẫn để cấu hình và hoàn thiện ứng dụng | Kiểm tra GitHub Actions; workflow của commit `7a806a8` chạy thành công | `7a806a8` |
| 19/11/2026 | ChatGPT | Thiết kế logo và cải thiện giao diện | Thiết kế logo VTTT Finance Planner, cập nhật Login và Sidebar theo phong cách phẳng, màu xanh teal | Sử dụng logo được AI hỗ trợ tạo và chỉnh sửa các component giao diện | Kiểm tra giao diện trên localhost, điều chỉnh kích thước logo, bố cục và giữ nguyên avatar người dùng | `3214a6d` |
| 19/11/2026 | ChatGPT | Hỗ trợ sửa lỗi giao diện và TypeScript | Sửa trang Login bị cuộn, màu chữ khi autofill và lỗi thư viện React TypeScript | Áp dụng hướng dẫn chỉnh sửa CSS và khôi phục thư viện | Kiểm tra lại giao diện; chạy `npm.cmd run typecheck` thành công | `3214a6d` |
| 19/11/2026 | ChatGPT | Hỗ trợ cập nhật tài liệu | Rà soát README, AI_LOG và AGENTS theo đề PHY10615 | Biên tập và bổ sung nội dung tài liệu | Đối chiếu đề bài, ảnh chạy local và lịch sử Commit thực tế | `5a14b35`; tiếp tục cập nhật |

*Các prompt được ghi dưới dạng tóm tắt nội dung trao đổi với AI.*

## 3. Kiểm chứng và lịch sử phát triển

### 3.1. Minh chứng chạy thử trên local

Ngày 17/11/2026, ứng dụng đã được chạy thử trên `localhost:3000` trước khi mã nguồn hoàn chỉnh được cập nhật lên GitHub.

**Hình 1. Dashboard chạy trên localhost**

![Dashboard local](./docs/images/dashboard-local.png)

**Hình 2. Trang Transactions chạy trên localhost**

![Transactions local](./docs/images/transactions-local.png)

Hai ảnh ghi nhận kết quả hiển thị các màn hình Dashboard và Transactions tại thời điểm chạy local.

### 3.2. Lịch sử Git

| Ngày | Commit | Nội dung |
|---|---|---|
| 10/11/2026 | `59db203` | Khởi tạo dự án Next.js |
| 18/11/2026 | `7a806a8` | Tích hợp và cập nhật mã nguồn Finance Planner |
| 19/11/2026 | `3214a6d` | Cập nhật logo và giao diện đăng nhập |
| 19/11/2026 | `5a14b35` | Cập nhật AI_LOG |

Các nội dung thực hành Tuần 8–10 đã được thực hiện và chạy thử trên local trước khi cập nhật mã nguồn tập trung lên GitHub ngày 18/11/2026.

Do chưa chia Commit theo từng mốc tuần học, tại thời điểm rà soát ngày 19/11/2026, repository chưa có các Git tag `fp1`, `fp2` và `fp3`. Lịch sử Git được giữ nguyên theo thời điểm Commit thực tế.

## 4. Tự đánh giá việc sử dụng AI

**Phần thực hiện không sử dụng AI**

- Thực hành các bài học Tuần 8–10 theo hướng dẫn trên WebLab.
- Viết và chạy thử mã nguồn trên môi trường local.
- Kiểm tra kết quả hiển thị Dashboard, Transactions và dữ liệu mẫu.
- Thực hiện các thao tác cấu hình, chạy ứng dụng và kiểm tra kết quả trên máy cá nhân.

**Phần AI hỗ trợ**

- Rà soát yêu cầu đồ án và hỗ trợ hoàn thiện các chức năng.
- Hỗ trợ tạo, chỉnh sửa và giải thích mã nguồn.
- Hỗ trợ xử lý lỗi trong quá trình cài đặt, kiểm thử và triển khai.
- Hỗ trợ thiết kế logo, cải thiện giao diện và rà soát tài liệu.

**Một trường hợp AI đưa ra kết quả chưa phù hợp**

Trong quá trình cải thiện giao diện Login, bố cục ban đầu xuất hiện thanh cuộn không mong muốn và chữ trong ô nhập liệu tự động điền chưa dễ đọc. Các vấn đề được phát hiện khi kiểm tra trực tiếp trên trình duyệt.

Sau đó, giao diện và CSS được điều chỉnh theo phản hồi, đồng thời kiểm tra lại kết quả trên localhost.

Ngoài ra, quá trình chỉnh sửa dự án phát sinh lỗi liên quan đến tệp khai báo kiểu TypeScript của React. Lỗi được xử lý bằng cách khôi phục thư viện và chạy lại kiểm tra TypeScript.

**Nội dung tiếp tục hoàn thiện**

- Hoàn thiện README và các minh chứng kiểm thử.
- Tiếp tục kiểm tra phiên bản Production.
- Hoàn thiện đồ án trước khi tạo tag `v1.0`.
- Cập nhật nhật ký khi có thay đổi hoặc tiếp tục sử dụng AI.

---

**Tài liệu thực hành:** https://weblab.koomaru.com/  
**Repository:** https://github.com/25thang9/finance-planner
