
import Image from "next/image";
import {
  Wallet,
  Target,
  ChartNoAxesColumnIncreasing,
  CalendarCheck2,
} from "lucide-react";

const features = [
  {
    title: "Giao dịch",
    description: "Ghi nhận thu chi",
    icon: Wallet,
  },
  {
    title: "Mục tiêu",
    description: "Theo dõi tiết kiệm",
    icon: Target,
  },
  {
    title: "Báo cáo",
    description: "Thống kê chi tiêu",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    title: "Ngân sách",
    description: "Lập kế hoạch chi tiêu",
    icon: CalendarCheck2,
  },
];

export function LoginShowcase() {
  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#074856] via-[#00616b] to-[#073e50] px-6 py-5 text-center text-white">
      {/* Trang trí nền */}
      <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-teal-300/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-28 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-[590px]">
        {/* Logo thương hiệu */}
        <Image
          src="/vttt-logo.png"
          alt="VTTT Finance Planner"
          width={1000}
          height={390}
          priority
          className="mx-auto h-auto w-full max-w-[330px] object-contain"
        />

        {/* Thông điệp */}
        <h1 className="mt-4 text-[26px] font-bold leading-[1.22] tracking-tight xl:text-[30px]">
          Làm chủ tài chính.
          <span className="mt-1 block text-[#88e7d8]">
            Theo đuổi điều bạn muốn.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-[470px] text-[13px] leading-5 text-[#d4ecec] xl:text-sm">
          Theo dõi thu chi, lập kế hoạch ngân sách và biến
          mục tiêu tiết kiệm thành hiện thực.
        </p>

        {/* 4 ô tính năng */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/15 bg-white/[0.09] px-4 py-3 text-left transition-colors hover:bg-white/[0.14]"
              >
                <Icon
                  size={23}
                  strokeWidth={1.9}
                  className="mb-2 text-[#8cf4dc]"
                  aria-hidden="true"
                />

                <h2 className="text-sm font-bold text-white">
                  {feature.title}
                </h2>

                <p className="mt-1 text-xs leading-4 text-[#c8e7e8]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trang trí cuối nền */}
      <div className="pointer-events-none absolute -bottom-20 left-[-15%] h-32 w-[130%] -rotate-3 rounded-[50%] bg-[#41cfc0]/10 blur-2xl" />
    </section>
  );
}
