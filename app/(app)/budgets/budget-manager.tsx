"use client";
import {useState} from "react";
import {Plus,AlertTriangle,CheckCircle2,PiggyBank} from "lucide-react";
import {Category} from "@/generated/prisma/enums";
import {CATEGORY_NAMES} from "@/lib/labels";
import {budgetProgress,budgetStatus,formatVND} from "@/lib/finance";
import {BudgetForm} from "./budget-form";
import {removeBudget} from "./actions";
import {DeleteConfirm} from "@/components/delete-confirm";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {EmptyState} from "@/components/ui/empty-state";
import {Dialog,DialogContent,DialogDescription,DialogTitle,DialogTrigger} from "@/components/ui/dialog";
export type BudgetItem={id:string;category:Category;amount:number;spent:number;month:string};
export function BudgetManager({budgets}:{budgets:BudgetItem[]}){
 const [open,setOpen]=useState(false);
 return <><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="muted-label">TÍNH NĂNG MỞ RỘNG</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Ngân sách theo danh mục</h1><p className="subtle-title mt-2">Thiết lập hạn mức tháng và nhận cảnh báo khi dùng 80% hoặc 100% ngân sách.</p></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button><Plus size={16}/> Thiết lập ngân sách</Button></DialogTrigger><DialogContent><DialogTitle className="text-xl font-bold">Thiết lập hạn mức</DialogTitle><DialogDescription className="mb-5 mt-1">Nếu đã có danh mục trong tháng, số tiền mới sẽ cập nhật ngân sách hiện tại.</DialogDescription><BudgetForm onSaved={()=>setOpen(false)}/></DialogContent></Dialog></div><div className="mt-7">{budgets.length===0?<EmptyState title="Chưa có ngân sách" description="Hãy thiết lập ngân sách cho từng danh mục để chủ động kiểm soát chi tiêu."/>:<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{budgets.map(b=>{const percent=budgetProgress(b.spent,b.amount),status=budgetStatus(b.spent,b.amount);return <section key={b.id} className="panel p-6"><div className="mb-5 flex items-start justify-between"><span className="rounded-2xl bg-[#e4f1f1] p-3 text-[#2b7c87]"><PiggyBank size={21}/></span><Badge className={status==="over"?"bg-red-100 text-red-700":status==="warning"?"bg-amber-100 text-amber-800":"bg-emerald-100 text-emerald-800"}>{status==="over"?"Vượt / hết hạn mức":status==="warning"?"Cảnh báo 80%":"Trong hạn mức"}</Badge></div><p className="text-lg font-bold">{CATEGORY_NAMES[b.category]}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">Tháng {b.month}</p><p className="mt-5 text-sm text-[var(--muted-foreground)]">Đã chi <strong className="text-[var(--foreground)]">{formatVND(b.spent)}</strong> / {formatVND(b.amount)}</p><div className="mt-2"><Progress value={Math.min(100,percent)} className={status==="over"?"[&>div]:bg-red-500":status==="warning"?"[&>div]:bg-amber-500":""}/></div><p className="mt-2 flex items-center gap-1.5 text-xs font-semibold">{status==="safe"?<CheckCircle2 size={14} className="text-emerald-600"/>:<AlertTriangle size={14} className={status==="over"?"text-red-600":"text-amber-600"}/>} {percent}% ngân sách sử dụng</p><div className="mt-4 flex justify-end border-t border-[var(--border)] pt-3"><DeleteConfirm id={b.id} label={`ngân sách ${CATEGORY_NAMES[b.category]}`} action={removeBudget}/></div></section>})}</div>}</div></>
}
