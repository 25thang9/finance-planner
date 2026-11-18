"use client";
import {useState} from "react";
import {ArrowDownRight,ArrowUpRight,Pencil,Plus} from "lucide-react";
import {formatVND} from "@/lib/finance";
import {CATEGORY_NAMES} from "@/lib/labels";
import {TransactionForm,type TransactionInitial} from "./transaction-form";
import {deleteTransaction} from "./actions";
import {DeleteConfirm} from "@/components/delete-confirm";
import {EmptyState} from "@/components/ui/empty-state";
import {Dialog,DialogContent,DialogTrigger,DialogTitle,DialogDescription} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
export type TransactionRow=TransactionInitial;
export function TransactionManager({rows}:{rows:TransactionRow[]}){
 const [adding,setAdding]=useState(false);
 return <section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-5 sm:px-6"><div><h2 className="text-lg font-bold">Danh sách giao dịch</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Tìm thấy <strong>{rows.length}</strong> giao dịch theo bộ lọc</p></div><Dialog open={adding} onOpenChange={setAdding}><DialogTrigger asChild><Button><Plus size={16}/>Thêm giao dịch</Button></DialogTrigger><DialogContent><DialogTitle className="text-xl font-bold">Thêm giao dịch mới</DialogTitle><DialogDescription className="mt-1 mb-5">Nhập thông tin; số tiền phải là số nguyên dương.</DialogDescription><TransactionForm onSaved={()=>setAdding(false)}/></DialogContent></Dialog></div>{rows.length===0?<div className="p-6"><EmptyState title="Không tìm thấy giao dịch" description="Thử chọn thời gian hoặc danh mục khác, hoặc thêm giao dịch mới."/></div>:<div className="divide-y divide-[var(--border)]">{rows.map(r=><TransactionItem key={r.id} data={r}/>)}</div>}</section>
}
function TransactionItem({data:r}:{data:TransactionRow}){
 const [editing,setEditing]=useState(false);
 return <div className="flex flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-[var(--muted)]/30 sm:px-6"><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.type==="INCOME"?"bg-emerald-50 text-emerald-700":"bg-rose-50 text-rose-700"}`}>{r.type==="INCOME"?<ArrowUpRight size={21}/>:<ArrowDownRight size={21}/>}</span><div className="min-w-[110px] flex-1"><p className="truncate text-sm font-bold">{r.description}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{CATEGORY_NAMES[r.category]} · {new Date(`${r.date}T00:00:00Z`).toLocaleDateString("vi-VN",{timeZone:"UTC"})}</p></div><div className="ml-auto text-right"><p className={`whitespace-nowrap text-sm font-bold sm:text-base ${r.type==="INCOME"?"text-emerald-700 dark:text-emerald-400":""}`}>{r.type==="INCOME"?"+":"−"}{formatVND(r.amount)}</p><p className="mt-1 text-xs text-[var(--muted-foreground)]">{r.type==="INCOME"?"Thu nhập":"Chi tiêu"}</p></div><div className="flex items-center gap-1"><Dialog open={editing} onOpenChange={setEditing}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={`Sửa ${r.description}`} title="Sửa"><Pencil size={17}/></Button></DialogTrigger><DialogContent><DialogTitle className="text-xl font-bold">Sửa giao dịch</DialogTitle><DialogDescription className="mb-5 mt-1">Chỉnh sửa nội dung và lưu để cập nhật.</DialogDescription><TransactionForm initial={r} onSaved={()=>setEditing(false)}/></DialogContent></Dialog><DeleteConfirm id={r.id} label={r.description} action={deleteTransaction}/></div></div>
}
