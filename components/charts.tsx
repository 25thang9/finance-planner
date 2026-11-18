"use client";
import {PieChart,Pie,Cell,Tooltip,BarChart,Bar,XAxis,YAxis,CartesianGrid} from "recharts";
import {ChartContainer} from "@/components/ui/chart";
import {formatVND} from "@/lib/finance";
export function ExpensePie({data}:{data:{name:string;value:number;color:string}[]}) {
 if(data.length===0)return <div className="flex h-64 items-center justify-center text-sm text-[var(--muted-foreground)]">Chưa có chi tiêu tháng này</div>;
 return <ChartContainer config={{expense:{label:"Chi tiêu",color:"#5d99b0"}}}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={65} outerRadius={100} paddingAngle={3} strokeWidth={0}>{data.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip formatter={v=>formatVND(Number(v))} contentStyle={{borderRadius:12,borderColor:"#d8e5ed",color:"#233548"}}/></PieChart></ChartContainer>;
}
export function TrendChart({data}:{data:{month:string;income:number;expense:number}[]}){
 return <ChartContainer className="h-70" config={{income:{label:"Thu nhập",color:"#4b9e89"},expense:{label:"Chi tiêu",color:"#ef9f8e"}}}><BarChart data={data} margin={{left:-12,right:5,top:15,bottom:0}}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e3eaf0"/><XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#8295a3"}}/><YAxis tickLine={false} axisLine={false} tickFormatter={v=>`${Math.round(Number(v)/1_000_000)}tr`} tick={{fontSize:11,fill:"#8295a3"}}/><Tooltip formatter={v=>formatVND(Number(v))} contentStyle={{borderRadius:12,borderColor:"#d8e5ed",color:"#233548"}}/><Bar dataKey="income" name="Thu" fill="#4b9e89" radius={[5,5,0,0]} maxBarSize={28}/><Bar dataKey="expense" name="Chi" fill="#ef9f8e" radius={[5,5,0,0]} maxBarSize={28}/></BarChart></ChartContainer>
}
