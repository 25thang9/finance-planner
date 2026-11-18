"use client";
import {useState,type FormEvent} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import {Search,RotateCcw} from "lucide-react";
import {Category} from "@/generated/prisma/enums";
import {CATEGORY_NAMES} from "@/lib/labels";
import {type Filters} from "@/lib/validation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
export function TransactionFilters({filter}:{filter:Filters}){
 const router=useRouter(),params=useSearchParams();const [q,setQ]=useState(filter.q??"");
 function update(key:string,value:string){const next=new URLSearchParams(params.toString());if(!value||value==="ALL")next.delete(key);else next.set(key,value);router.replace(`/transactions?${next.toString()}`)}
 function search(e:FormEvent){e.preventDefault();update("q",q.trim())}
 const cls="h-10 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-[var(--foreground)]";
 return <section aria-label="Bộ lọc giao dịch" className="panel p-4"><form onSubmit={search} className="mb-3 flex gap-2"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-3 text-[var(--muted-foreground)]"/><Input aria-label="Tìm theo mô tả" className="h-10 pl-10" value={q} onChange={e=>setQ(e.target.value)} maxLength={80} placeholder="Tìm theo mô tả giao dịch..."/></div><Button size="sm" type="submit">Tìm</Button></form><div className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"><select className={cls} aria-label="Lọc thời gian" value={filter.range} onChange={e=>update("range",e.target.value)}><option value="this-month">Tháng này</option><option value="last-month">Tháng trước</option><option value="all">Tất cả thời gian</option></select><select className={cls} aria-label="Lọc Thu Chi" value={filter.type??"ALL"} onChange={e=>update("type",e.target.value)}><option value="ALL">Thu và chi</option><option value="INCOME">Thu nhập</option><option value="EXPENSE">Chi tiêu</option></select><select className={cls} aria-label="Lọc danh mục" value={filter.category??"ALL"} onChange={e=>update("category",e.target.value)}><option value="ALL">Tất cả danh mục</option>{Object.values(Category).map(c=><option value={c} key={c}>{CATEGORY_NAMES[c]}</option>)}</select><Button variant="outline" size="icon" title="Bỏ bộ lọc" aria-label="Bỏ bộ lọc" onClick={()=>{setQ("");router.replace("/transactions?range=all")}}><RotateCcw size={17}/></Button></div></section>;
}
