import * as React from "react";
import {cn} from "@/lib/utils";
export function Card({className,...props}:React.ComponentProps<"section">){return <section className={cn("panel p-5 sm:p-6",className)} {...props}/>}
export function CardTitle({className,...props}:React.ComponentProps<"h2">){return <h2 className={cn("text-lg font-bold tracking-tight",className)} {...props}/>}
export function CardDescription({className,...props}:React.ComponentProps<"p">){return <p className={cn("text-sm text-[var(--muted-foreground)]",className)} {...props}/>}
