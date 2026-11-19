# AI_LOG – NHẬT KÝ SỬ DỤNG AI

**Dự án:** Finance Planner  
**Học phần:** PHY10615 – Lập trình Web  
**Mức độ sử dụng AI:** Level 3 – AI cộng tác

## 1. Nhật ký sử dụng AI

| Ngày | Công cụ | Nội dung sử dụng AI | Cách sử dụng và kiểm chứng | Commit / PR |
|---|---|---|---|---|
| 17/11/2026 | ChatGPT | Phân tích yêu cầu đồ án, đối chiếu mã nguồn mẫu Tuần 7–9 và hỗ trợ xây dựng bộ mã nguồn Finance Planner ban đầu. | Sử dụng bộ mã nguồn AI hỗ trợ tạo, tiếp tục cấu hình môi trường, cơ sở dữ liệu và chạy thử các chức năng. | Bổ sung SHA |
| 19/11/2026 | ChatGPT, công cụ tạo ảnh AI | Thiết kế logo VTTT Finance Planner, điều chỉnh nhân vật minh họa, chữ physics trên áo, màu sắc, biểu tượng và bố cục thương hiệu. | So sánh nhiều phương án, phản hồi những chi tiết chưa phù hợp, lựa chọn logo cuối cùng và lưu vào `public/vttt-logo.png`. | Bổ sung SHA |
| 19/11/2026 | ChatGPT | Hỗ trợ thiết kế lại giao diện đăng nhập và đăng ký, tham khảo bố cục hai cột của một website thực tế. | Cập nhật `auth-form.tsx` và `login-showcase.tsx`. Chạy trên localhost, kiểm tra bố cục và điều chỉnh kích thước để hạn chế cuộn trang trên desktop. Giữ nguyên logic xác thực Better Auth. | Bổ sung SHA |
| 19/11/2026 | ChatGPT | Hỗ trợ thay đổi nhận diện trong Sidebar và Dashboard, thay logo mặc định, loại bỏ emoji ở tiêu đề. | Chỉnh sửa `app-shell.tsx` và tiêu đề Dashboard. Giữ nguyên menu điều hướng, thông tin người dùng, avatar, đăng xuất và Dark Mode. | Bổ sung SHA |
| 19/11/2026 | ChatGPT | Phân tích lỗi hiển thị màu chữ khi Chrome tự động điền và điều chỉnh biểu tượng GitHub. | Cập nhật `globals.css` và `auth-form.tsx`, kiểm tra lại giao diện trên trình duyệt. Xác nhận màu chữ trong ô nhập liệu rõ hơn. | Bổ sung SHA |
| 19/11/2026 | ChatGPT | Hỗ trợ phân tích lỗi TypeScript phát sinh trong quá trình chỉnh sửa mã nguồn. | Phát hiện file thư viện `node_modules/@types/react/index.d.ts` bị chứa nhầm mã JSX. Khôi phục thư viện bằng npm và chạy `npm.cmd run typecheck` thành công. | Bổ sung SHA |

## 2. Trường hợp kết quả AI chưa phù hợp và cách xử lý

Trong quá trình thiết kế lại giao diện đăng nhập, phiên bản ban đầu do AI đề xuất có kích thước logo và khoảng cách giữa các thành phần tương đối lớn, khiến nội dung không hiển thị đầy đủ trong một màn hình.

Vấn đề được phát hiện khi chạy thử website trên localhost. Dựa trên ảnh chụp màn hình thực tế, yêu cầu điều chỉnh được đưa ra nhằm thu nhỏ logo, giảm khoảng cách giữa các thành phần và tối ưu bố cục hai cột.

Ngoài ra, khi Chrome tự động điền thông tin đăng nhập, ô Email xuất hiện nền xám và màu chữ khó đọc. Sau khi kiểm tra, CSS được điều chỉnh để xử lý trạng thái autofill và tăng độ tương phản.

Những trường hợp này cho thấy mã nguồn và phương án thiết kế do AI đề xuất cần được kiểm chứng trực tiếp trên môi trường thực tế. Kết quả chỉ được sử dụng sau khi đã kiểm tra và điều chỉnh phù hợp.

## 3. Kết quả thực hiện ngày 19/11/2026

Hoàn thiện logo thương hiệu VTTT Finance Planner, tích hợp vào trang đăng nhập và phần Sidebar của các trang chức năng.

Giao diện Login/Register được thiết kế lại theo bố cục hai cột, với phần nhận diện thương hiệu và giới thiệu chức năng ở bên trái, khu vực xác thực ở bên phải. Bố cục được thu gọn để phù hợp hơn với màn hình desktop.

Khắc phục lỗi hiển thị màu chữ trong ô nhập liệu khi trình duyệt tự động điền thông tin. Cập nhật biểu tượng GitHub và điều chỉnh nhận diện Dashboard, đồng thời giữ nguyên các chức năng hiện có.

Trong quá trình chỉnh sửa, lỗi thư viện React TypeScript được phát hiện và xử lý. Lệnh `npm.cmd run typecheck` hoàn thành không có lỗi.

Các thay đổi giao diện đã được Commit và Push bằng GitHub Desktop. Kết quả CI và kiểm thử chức năng trên bản Production sau lần cập nhật này cần được kiểm tra bổ sung.


