import * as React from "react";
import {cn} from "@/lib/utils";
export function Input({className,...props}:React.ComponentProps<"input">){return <input className={cn("h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--foreground)] shadow-sm outline-none placeholder:text-[var(--muted-foreground)] focus:border-[#5eafb8] focus:ring-2 focus:ring-[#5eafb833]",className)} {...props}/>}
