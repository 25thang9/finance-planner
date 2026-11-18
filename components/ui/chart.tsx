"use client";
import type {ReactElement,CSSProperties} from "react";
import {ResponsiveContainer} from "recharts";
export type ChartConfig=Record<string,{label:string;color?:string}>;
// Kiểu ChartContainer theo giao diện shadcn Chart; bảng số liệu bên ngoài bảo đảm a11y.
export function ChartContainer({config,children,className=""}:{config:ChartConfig;children:ReactElement;className?:string}){
 const style=Object.fromEntries(Object.entries(config).map(([key,v])=>[`--color-${key}`,v.color??"#4e9ca9"]));
 return <div className={`h-64 min-w-0 w-full ${className}`} style={style as CSSProperties}><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>;
}
