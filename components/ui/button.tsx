import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const variants=cva("inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f9dab] disabled:pointer-events-none disabled:opacity-50",{
 variants:{variant:{default:"bg-[#215f72] text-white hover:bg-[#17495a] dark:bg-[#5db1ba] dark:text-[#092131]",outline:"border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)]",ghost:"hover:bg-[var(--muted)]",destructive:"bg-red-600 text-white hover:bg-red-700",secondary:"bg-[var(--muted)] text-[var(--foreground)] hover:opacity-80"},size:{default:"h-10 px-4 py-2",sm:"h-9 px-3",lg:"h-12 px-5",icon:"h-10 w-10"}},defaultVariants:{variant:"default",size:"default"}
});
export function Button({className,variant,size,asChild=false,...props}:React.ComponentProps<"button">&VariantProps<typeof variants>&{asChild?:boolean}){
 const Comp=asChild?Slot:"button";return <Comp data-slot="button" className={cn(variants({variant,size,className}))} {...props}/>;
}
