
import Image from "next/image";
import Link from "next/link";

export function VTTTLogo() {
  return (
    <Link
      href="/dashboard"
      aria-label="VTTT Finance Planner - Tổng quan"
      className="block w-fit max-w-full"
    >
      <Image
        src="/vttt-logo.png"
        alt="VTTT Finance Planner"
        width={1000}
        height={390}
        priority
        className="h-auto w-[205px] max-w-full object-contain"
      />
    </Link>
  );
}
