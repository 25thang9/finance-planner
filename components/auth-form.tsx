
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Mail,
  LockKeyhole,
  UserRound,
  Github,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginShowcase } from "@/components/login-showcase";

type AuthFormProps = {
  mode: "login" | "register";
  githubEnabled: boolean;
};

export function AuthForm({
  mode,
  githubEnabled,
}: AuthFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const isLogin = mode === "login";

  // Đăng nhập / đăng ký bằng email
  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");
    setPending(true);

    const data = new FormData(event.currentTarget);

    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");

    try {
      const res = isLogin
        ? await authClient.signIn.email({
            email,
            password,
          })
        : await authClient.signUp.email({
            name: String(data.get("name") || ""),
            email,
            password,
          });

      if (res.error) {
        setError(
          res.error.message ??
            "Không thể xác thực tài khoản"
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(
        "Không thể kết nối máy chủ. Hãy thử lại."
      );
    } finally {
      setPending(false);
    }
  }

  // Đăng nhập bằng GitHub
  async function github() {
    setError("");
    setPending(true);

    try {
      const res = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });

      if (res.error) {
        setError(
          res.error.message || "Lỗi GitHub OAuth"
        );
      }
    } catch {
      setError(
        "GitHub OAuth chưa được cấu hình đúng"
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="auth-page grid min-h-dvh grid-cols-1 bg-[#075363] lg:h-dvh lg:overflow-hidden lg:grid-cols-2">
      {/* PHẦN GIỚI THIỆU BÊN TRÁI */}
      <div className="hidden h-full min-h-0 lg:block">
        <LoginShowcase />
      </div>

      {/* KHUNG ĐĂNG NHẬP BÊN PHẢI */}
      <section className="flex min-h-dvh items-center justify-center px-4 py-6 sm:px-8 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:px-8 lg:py-3">
        <div className="w-full max-w-[530px] rounded-[26px] border border-[#e4ebed] bg-white px-6 py-6 shadow-[0_18px_50px_rgba(0,29,43,0.12)] sm:px-9 lg:py-5">

          {/* Logo khi xem trên điện thoại */}
          <div className="mb-5 flex justify-center lg:hidden">
            <Image
              src="/vttt-logo.png"
              alt="VTTT Finance Planner"
              width={1000}
              height={390}
              priority
              className="h-auto w-[235px] max-w-full object-contain"
            />
          </div>

          {/* TIÊU ĐỀ */}
          <div className="mb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#617789]">
              BẮT ĐẦU TỪ HÔM NAY
            </p>

            <h1 className="mt-2 text-[28px] font-bold leading-tight tracking-tight text-[#102f40] sm:text-[32px]">
              {isLogin
                ? "Chào mừng quay lại"
                : "Tạo tài khoản mới"}
            </h1>

            <p className="mt-2 text-[13px] leading-5 text-[#647b8d]">
              {isLogin
                ? "Đăng nhập để tiếp tục hành trình tài chính của bạn."
                : "Bắt đầu với kế hoạch tài chính của riêng bạn."}
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={submit}
            className="space-y-3"
          >
            {/* Họ tên khi đăng ký */}
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold text-[#203e50]"
                >
                  Họ và tên
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#567485]"
                  />

                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    minLength={2}
                    required
                    className="h-11 rounded-xl border-[#cbdce5] bg-white pl-11 text-[#183247]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-semibold text-[#203e50]"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#567485]"
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="email@example.com"
                  required
                  className="h-11 rounded-xl border-[#cbdce5] bg-white pl-11 text-[#183247]"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-semibold text-[#203e50]"
              >
                Mật khẩu
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#567485]"
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    isLogin
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={8}
                  required
                  placeholder="Ít nhất 8 ký tự"
                  className="h-11 rounded-xl border-[#cbdce5] bg-white pl-11 text-[#183247]"
                />
              </div>
            </div>

            {/* Thông báo lỗi */}
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Nút đăng nhập / đăng ký */}
            <Button
              disabled={pending}
              type="submit"
              size="lg"
              className="mt-2 h-11 w-full rounded-xl bg-[#007669] font-semibold text-white hover:bg-[#005e57]"
            >
              {pending && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {isLogin
                ? "Đăng nhập"
                : "Đăng ký tài khoản"}

              <ArrowRight size={17} />
            </Button>
          </form>

          {/* Phân cách */}
          <div className="my-4 flex items-center gap-3 text-xs text-[#80909d]">
            <span className="h-px flex-1 bg-[#dce7ec]" />
            hoặc
            <span className="h-px flex-1 bg-[#dce7ec]" />
          </div>

          {/* Nút GitHub OAuth */}
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full rounded-xl border-[#cbdce5] bg-white text-[#183247] hover:bg-[#eef7f6]"
            disabled={!githubEnabled || pending}
            onClick={github}
          >
            <Github
              size={20}
              strokeWidth={2.2}
              aria-hidden="true"
            />

            <span>
              {githubEnabled
                ? "Đăng nhập với GitHub"
                : "GitHub chưa cấu hình OAuth"}
            </span>
          </Button>

          {/* Chuyển trang đăng nhập/đăng ký */}
          <p className="mt-4 text-center text-sm text-[#64788a]">
            {isLogin
              ? "Chưa có tài khoản?"
              : "Đã có tài khoản?"}{" "}

            <Link
              href={isLogin ? "/register" : "/login"}
              className="font-bold text-[#007b6c] hover:underline"
            >
              {isLogin
                ? "Đăng ký ngay"
                : "Đăng nhập"}
            </Link>
          </p>

          {/* Thông tin bảo mật */}
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-[#899aa6]">
            <ShieldCheck size={14} />
            Mật khẩu không được lưu dạng văn bản thuần
          </p>
        </div>
      </section>
    </main>
  );
}
