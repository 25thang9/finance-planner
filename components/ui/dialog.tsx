"use client";
import * as React from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import {cn} from "@/lib/utils";
export const Dialog=D.Root;
export const DialogTrigger=D.Trigger;
export const DialogClose=D.Close;
export function DialogContent({children,className,...props}:React.ComponentProps<typeof D.Content>){return <D.Portal><D.Overlay className="fixed inset-0 z-50 bg-[#091d35aa] backdrop-blur-[3px]"/><D.Content className={cn("fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(94vw,530px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-2xl",className)} {...props}><D.Close aria-label="Đóng" className="absolute right-4 top-4 rounded-lg p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"><X size={18}/></D.Close>{children}</D.Content></D.Portal>}
export const DialogTitle=D.Title;
export const DialogDescription=D.Description;
