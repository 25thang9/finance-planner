# AI_LOG – Nhật ký sử dụng AI

**Dự án:** Finance Planner – Đồ án cá nhân PHY10615  
**Công cụ AI:** ChatGPT  
**Repository:** https://github.com/25thang9/finance-planner

## 1. Quá trình thực hiện ban đầu

Finance Planner được bắt đầu từ các bài thực hành Tuần 8–10 trên WebLab của môn Phát triển ứng dụng web. Giai đoạn đầu tập trung vào thiết lập môi trường Next.js, kết nối PostgreSQL Neon, sử dụng Prisma và xây dựng các chức năng quản lý tài chính cơ bản.

Các nội dung thực hành theo WebLab được thực hiện và chạy thử trên máy cá nhân trước khi sử dụng AI để hoàn thiện đồ án. Ngày 17/11/2026, phiên bản local đã hiển thị Dashboard với tổng thu, tổng chi, số dư và thống kê theo danh mục. Trang Giao dịch cũng đã hiển thị dữ liệu mẫu và biểu mẫu thêm giao dịch.

Sau giai đoạn thực hành, ChatGPT được sử dụng để hỗ trợ bổ sung chức năng, điều chỉnh giao diện, xử lý lỗi, viết kiểm thử và hoàn thiện tài liệu. Các nội dung có sử dụng AI được ghi nhận trong nhật ký dưới đây.

## 2. Nhật ký sử dụng AI

| Ngày | Công cụ | Việc nhờ AI | Prompt (tóm tắt) | Kết quả dùng thế nào | Mình đã kiểm chứng / sửa gì | Commit/PR |
|---|---|---|---|---|---|---|
| 17–18/11/2026 | ChatGPT | Rà soát và hoàn thiện Finance Planner | Đối chiếu ứng dụng đã thực hành với yêu cầu đồ án; xác định các chức năng cần bổ sung | Sử dụng mã nguồn và hướng dẫn AI hỗ trợ để hoàn thiện ứng dụng | Tích hợp vào dự án, chạy thử trên localhost và kiểm tra giao diện | `7a806a8` |
| 17–18/11/2026 | ChatGPT | Hoàn thiện chức năng | Hỗ trợ CRUD giao dịch, Wishlist, biểu đồ, thông báo tiết kiệm, ngân sách và xác thực | Sử dụng và điều chỉnh các phần mã nguồn do AI hỗ trợ tạo | Kiểm tra việc hiển thị dữ liệu, thao tác giao dịch và đăng nhập trên local | `7a806a8` |
| 18/11/2026 | ChatGPT | Hỗ trợ kiểm thử và triển khai | Hướng dẫn xử lý lỗi, kiểm thử và triển khai ứng dụng qua GitHub, Vercel | Áp dụng hướng dẫn cấu hình và xử lý lỗi phát sinh | Kiểm tra hoạt động ứng dụng và kết quả GitHub Actions của phiên bản tại thời điểm đó | `7a806a8` |
| 19/11/2026 | ChatGPT | Thiết kế logo và cải thiện giao diện | Thiết kế logo VTTT Finance Planner; điều chỉnh Login và Sidebar theo phong cách phẳng, màu xanh teal | Sử dụng logo AI hỗ trợ tạo và chỉnh sửa các component giao diện | Kiểm tra bố cục, kích thước logo và giao diện sáng/tối trên localhost | `3214a6d` |
| 19/11/2026 | ChatGPT | Xử lý lỗi giao diện và TypeScript | Sửa trang Login xuất hiện thanh cuộn, màu chữ autofill và lỗi kiểu dữ liệu React | Áp dụng các chỉnh sửa CSS và cấu hình thư viện | Kiểm tra lại giao diện và chạy `npm.cmd run typecheck` | `3214a6d` |
| 19/11/2026 | ChatGPT | Rà soát tài liệu đồ án | Đối chiếu README, AI_LOG và AGENTS với đề PHY10615 | Biên tập tài liệu và bổ sung thông tin quá trình thực hiện | Đối chiếu yêu cầu môn học, ảnh local và lịch sử commit | `5a14b35`, `2f999a0` |
| 20/11/2026 | ChatGPT | Bổ sung chức năng Xuất CSV | Tạo Route Handler xuất giao dịch thành CSV, giữ bộ lọc URL và kiểm tra tài khoản đăng nhập | Sử dụng mã nguồn AI hỗ trợ cho API xuất CSV và nút tải dữ liệu | Phát hiện import `@/lib/dal` không phù hợp; sửa theo cơ chế `@/lib/session` của dự án. API xuất CSV phản hồi HTTP 200 | `1ddc554` |
| 20/11/2026 | ChatGPT | Điều chỉnh giao diện Xuất CSV | Đặt nút Xuất CSV ngang hàng với tiêu đề Giao dịch, thu gọn khoảng cách và đồng bộ màu sắc | Chỉnh sửa bố cục trang Giao dịch, tái sử dụng component Button | Kiểm tra trực tiếp giao diện trên localhost và điều chỉnh theo kết quả hiển thị | `1ddc554` |
| 21/11/2026 | ChatGPT | Bổ sung chức năng Nhập CSV | Tạo API nhập giao dịch, hộp thoại chọn file, tải file mẫu và bước kiểm tra trước khi lưu | Tích hợp Route Handler và component giao diện do AI hỗ trợ viết | Kiểm tra giao diện, cấu trúc file và xử lý các lỗi import/export trong quá trình tích hợp | `1ddc554` |
| 21/11/2026 | ChatGPT | Kiểm tra dữ liệu CSV bằng Zod | Kiểm tra định dạng ngày, loại giao dịch, số tiền, danh mục, mô tả và cấu trúc CSV | Tách logic xử lý thành `lib/csv-import.ts`, kết nối với API nhập giao dịch | Phát hiện lỗi thiếu module và nhầm nội dung giữa file Zod với component giao diện; điều chỉnh lại cấu trúc file | `1ddc554` |
| 21/11/2026 | ChatGPT | Bổ sung unit test cho CSV | Viết test kiểm tra dữ liệu CSV hợp lệ, dữ liệu sai, thiếu cột và vượt giới hạn | Bổ sung 13 trường hợp kiểm thử trong `__tests__/csv-import.test.ts` | Chạy `npx.cmd vitest run`: cả 13 test CSV đạt, tổng cộng 39/39 test PASS | `1ddc554` |
| 21/11/2026 | ChatGPT | Cập nhật tài liệu đồ án | Chuẩn hóa AI_LOG và README theo mẫu của môn học, bổ sung kết quả kiểm thử và commit CSV | Biên tập nội dung tài liệu, cập nhật lịch sử phát triển | Đối chiếu đề bài, kết quả Vitest trên local và commit GitHub thực tế | Commit tài liệu tiếp theo |

*Các prompt được ghi dưới dạng tóm tắt nội dung trao đổi với AI. Kết quả kiểm chứng chỉ phản ánh những thao tác và kết quả đã được ghi nhận.*

## 3. Minh chứng và kết quả kiểm thử

### 3.1. Minh chứng thực hành trên local

Ngày 17/11/2026, ứng dụng được chạy thử trên `localhost:3000` trong giai đoạn thực hành theo WebLab.

**Hình 1. Dashboard trên localhost**

![Dashboard local](./docs/images/dashboard-local.png)

**Hình 2. Trang Giao dịch trên localhost**

![Transactions local](./docs/images/transactions-local.png)

Hai ảnh ghi nhận kết quả thực hành ban đầu. Ảnh giao diện của phiên bản hoàn chỉnh sẽ được bổ sung sau khi kết thúc quá trình phát triển và kiểm tra bản Production.

### 3.2. Kết quả kiểm thử

Ngày 21/11/2026, bộ kiểm thử được chạy bằng lệnh:

`npx.cmd vitest run`

Kết quả ghi nhận:

| File kiểm thử | Số test | Kết quả |
|---|---:|---|
| `finance.test.ts` | 16 | PASS |
| `validation.test.ts` | 9 | PASS |
| `csv-import.test.ts` | 13 | PASS |
| `empty-state.test.tsx` | 1 | PASS |
| **Tổng cộng** | **39** | **39/39 PASS** |

Trong đó có 38 unit test và 1 component test. Các bài kiểm thử tập trung vào logic tài chính, validation, xử lý dữ liệu CSV và hiển thị component khi không có dữ liệu.

Kết quả trên xác nhận bộ kiểm thử Vitest hoạt động thành công ở môi trường local. Trạng thái lint, typecheck, production build và GitHub Actions của phiên bản cuối cùng vẫn cần được kiểm tra riêng trước khi nộp.

### 3.3. Lịch sử Git

| Ngày | Commit | Nội dung |
|---|---|---|
| 10/11/2026 | `59db203` | Khởi tạo dự án Next.js |
| 18/11/2026 | `7a806a8` | Tích hợp mã nguồn Finance Planner |
| 19/11/2026 | `3214a6d` | Cập nhật logo và giao diện đăng nhập |
| 19/11/2026 | `5a14b35` | Cập nhật nhật ký sử dụng AI |
| 19/11/2026 | `2f999a0` | Bổ sung minh chứng thực hành trên local |
| 21/11/2026 | `1ddc554` | Bổ sung tính năng Nhập/Xuất CSV có kiểm tra dữ liệu |

Các chức năng ban đầu được thực hành và chạy thử trên local trước khi tích hợp tập trung vào repository.

Các mốc Git tag `fp1`, `fp2` và `fp3` chưa được ghi nhận đầy đủ theo từng tuần trong lịch sử phát triển ban đầu. Việc bổ sung tag cần phản ánh đúng trạng thái và thời điểm thực tế của repository.

## Tự đánh giá cuối bài

**Phần thực hiện độc lập**

- Thực hành các nội dung Tuần 8–10 theo hướng dẫn trên WebLab trong giai đoạn đầu.
- Cấu hình môi trường phát triển và chạy ứng dụng trên máy cá nhân.
- Kiểm tra Dashboard, giao dịch và dữ liệu mẫu trên localhost.
- Thực hiện các thao tác Git, Commit, Push và theo dõi lịch sử thay đổi.
- Quan sát giao diện thực tế, phát hiện vấn đề trong quá trình tích hợp và yêu cầu điều chỉnh.

**Phần AI hỗ trợ nhiều nhất và mức độ hiểu nội dung**

ChatGPT hỗ trợ nhiều nhất trong quá trình hoàn thiện chức năng và xử lý lỗi. Phần hỗ trợ bao gồm tạo và chỉnh sửa mã nguồn, cải thiện giao diện, triển khai Route Handler và xây dựng các trường hợp kiểm thử.

Đối với tính năng Nhập/Xuất CSV, quá trình tích hợp giúp làm rõ vai trò của các thành phần: Route Handler tiếp nhận và xử lý yêu cầu, Zod kiểm tra dữ liệu đầu vào, Prisma truy vấn và lưu giao dịch theo `userId`, còn Vitest kiểm tra tự động các trường hợp hợp lệ và không hợp lệ.

Việc sử dụng AI rút ngắn thời gian xây dựng chức năng nhưng không thay thế bước đối chiếu mã nguồn với cấu trúc thực tế của dự án. Các thay đổi cần được kiểm tra trên local trước khi đưa lên GitHub.

**Một lần AI sai và cách phát hiện**

Khi triển khai chức năng Xuất CSV, mã nguồn AI đề xuất sử dụng `requireUser` từ `@/lib/dal`. Tuy nhiên, Finance Planner sử dụng cơ chế xác thực trong `@/lib/session`, nên TypeScript và production build báo lỗi không tìm thấy module.

Lỗi được xác định bằng cách đối chiếu thông báo từ Terminal với API giao dịch đang hoạt động. Phần xử lý xác thực sau đó được sửa theo cấu trúc thực tế của dự án.

Trong quá trình bổ sung Nhập CSV, một lỗi khác phát sinh do nhầm nội dung giữa file xử lý Zod và component giao diện, dẫn đến thông báo `CsvImportDialog has no exported member`. Việc kiểm tra bảng Problems và log Next.js giúp xác định sai vị trí mã nguồn, từ đó tách lại các file đúng chức năng.

Các trường hợp trên cho thấy kết quả AI đề xuất cần được đọc, kiểm tra và điều chỉnh thay vì sử dụng trực tiếp mà không xác minh.

---

**Tài liệu thực hành:** https://weblab.koomaru.com/  
**Repository:** https://github.com/25thang9/finance-planner