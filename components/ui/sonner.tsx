"use client";
import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";
export function Toaster(props:ComponentProps<typeof SonnerToaster>){const {resolvedTheme}=useTheme();return <SonnerToaster theme={resolvedTheme==="dark"?"dark":"light"} {...props}/>;}
