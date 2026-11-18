import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
export const metadata:Metadata={title:"Finance Planner · Quản lý tài chính",description:"Quản lý thu chi, ngân sách và mục tiêu tiết kiệm thông minh."};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="vi" suppressHydrationWarning><body className="antialiased"><ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>{children}<Toaster richColors position="top-right" closeButton /></ThemeProvider></body></html>;
}
