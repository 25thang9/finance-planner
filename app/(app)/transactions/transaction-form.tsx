"use client";
import {useActionState,useEffect} from "react";
import {toast} from "sonner";
import {Loader2,Save,Plus} from "lucide-react";
import {Category} from "@/generated/prisma/enums";
import {CATEGORY_NAMES} from "@/lib/labels";
import {type TransactionFormState,type TransactionValues} from "@/lib/validation";
import {createTransaction,updateTransaction} from "./actions";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
export type TransactionInitial={id:string;type:"INCOME"|"EXPENSE";amount:number;description:string;category:Category;date:string};
export function TransactionForm({initial,onSaved}:{initial?:TransactionInitial;onSaved?:()=>void}){
 const action=initial?updateTransaction.bind(null,initial.id):createTransaction;
 const [state,formAction,pending]=useActionState< TransactionFormState,FormData>(action,{});
 useEffect(()=>{if(state.ok){toast.success(state.message);state.notifications?.forEach(x=>toast.success(x,{duration:6000}));onSaved?.();}else if(state.message)toast.error(state.message);},[state.nonce,state.ok,state.message]);
 const v:TransactionValues=state.values??{};
 const e:NonNullable<TransactionFormState["errors"]>=state.errors??{};
 const field=(name:keyof TransactionValues)=>e[name]?.[0]?<p role="alert" className="mt-1.5 text-xs font-semibold text-rose-600">{e[name]?.[0]}</p>:null;
 const label="mb-1.5 block text-sm font-semibold";
 const select="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 text-sm text-[var(--foreground)] focus:border-[#5eafb8] focus:outline-none focus:ring-2 focus:ring-[#5eafb833]";
 return <form action={formAction} className="space-y-4"><div className="grid gap-4 sm:grid-cols-2"><div><label className={label} htmlFor={`${initial?.id??"new"}-type`}>Loại giao dịch</label><select id={`${initial?.id??"new"}-type`} name="type" className={select} defaultValue={v.type??initial?.type??"EXPENSE"}><option value="EXPENSE">Chi tiêu</option><option value="INCOME">Thu nhập</option></select>{field("type")}</div><div><label className={label} htmlFor={`${initial?.id??"new"}-amount`}>Số tiền (VND)</label><Input id={`${initial?.id??"new"}-amount`} name="amount" inputMode="numeric" type="number" step="any" placeholder="Ví dụ: 250000" defaultValue={v.amount??initial?.amount??""}/>{field("amount")}</div></div><div><label className={label} htmlFor={`${initial?.id??"new"}-description`}>Mô tả giao dịch</label><Input id={`${initial?.id??"new"}-description`} name="description" maxLength={120} placeholder="Ví dụ: Ăn trưa, tiền lương..." defaultValue={v.description??initial?.description??""}/>{field("description")}</div><div className="grid gap-4 sm:grid-cols-2"><div><label className={label} htmlFor={`${initial?.id??"new"}-category`}>Danh mục</label><select id={`${initial?.id??"new"}-category`} name="category" className={select} defaultValue={v.category??initial?.category??"FOOD"}>{Object.values(Category).map(x=><option key={x} value={x}>{CATEGORY_NAMES[x]}</option>)}</select>{field("category")}</div><div><label className={label} htmlFor={`${initial?.id??"new"}-date`}>Ngày giao dịch</label><Input id={`${initial?.id??"new"}-date`} name="date" type="date" defaultValue={v.date??initial?.date??new Date().toISOString().slice(0,10)}/>{field("date")}</div></div><Button disabled={pending} type="submit" className="w-full">{pending?<Loader2 size={17} className="animate-spin"/>:initial?<Save size={17}/>:<Plus size={17}/>} {pending?"Đang lưu...":initial?"Cập nhật giao dịch":"Thêm giao dịch"}</Button></form>
}
