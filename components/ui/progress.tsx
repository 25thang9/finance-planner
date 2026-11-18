"use client";
import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import {cn} from "@/lib/utils";
export function Progress({value=0,className,...props}:React.ComponentProps<typeof ProgressPrimitive.Root>){return <ProgressPrimitive.Root value={Math.max(0,Math.min(100,value??0))} className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]",className)} {...props}><ProgressPrimitive.Indicator className="h-full w-full rounded-full bg-[#4f9ea7] transition-transform" style={{transform:`translateX(-${100-Math.max(0,Math.min(100,value??0))}%)`}}/></ProgressPrimitive.Root>}
