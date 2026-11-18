import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  // Không dùng cacheComponents: trang tài chính luôn phụ thuộc session/Neon,
  // tránh lỗi force-dynamic/Suspense của bài lab khi bật Cache Components.
  cacheComponents: false,
  reactStrictMode: true,
};
export default nextConfig;
