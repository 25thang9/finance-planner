"use client";
import {useState} from "react";
import {Target,Pencil,Plus,CheckCircle2,Sparkles} from "lucide-react";
import {formatVND,wishlistProgress} from "@/lib/finance";
import {PRIORITY_NAMES} from "@/lib/labels";
import {deleteWishlist} from "./actions";
import {WishlistForm,type WishlistInitial} from "./wishlist-form";
import {DeleteConfirm} from "@/components/delete-confirm";
import {Progress} from "@/components/ui/progress";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogTrigger} from "@/components/ui/dialog";
import {EmptyState} from "@/components/ui/empty-state";
export function WishlistManager({items,balance}:{items:WishlistInitial[];balance:number}){
 const [add,setAdd]=useState(false);
 return <><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="muted-label">MỤC TIÊU TƯƠNG LAI</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Wishlist của tôi</h1><p className="subtle-title mt-2">Theo dõi tiến độ tiết kiệm dựa trên số dư hiện tại: <strong>{formatVND(balance)}</strong>.</p></div><Dialog open={add} onOpenChange={setAdd}><DialogTrigger asChild><Button><Plus size={17}/> Thêm mục tiêu</Button></DialogTrigger><DialogContent><DialogTitle className="text-xl font-bold">Mục tiêu mới</DialogTitle><DialogDescription className="mb-5 mt-1">Đặt một mục tiêu tiết kiệm để theo dõi tiến độ.</DialogDescription><WishlistForm onSaved={()=>setAdd(false)}/></DialogContent></Dialog></div>{items.length===0?<div className="mt-8"><EmptyState title="Chưa có wishlist" description="Thêm món đồ bạn đang muốn tiết kiệm để mua."/></div>:<div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map(item=><WishlistCard key={item.id} item={item} balance={balance}/>)}</div>}<div className="panel mt-7 flex items-start gap-3 p-5"><Sparkles size={20} className="shrink-0 text-[#46949b]"/><div><p className="font-semibold">Mốc động viên 50% · 75% · 100%</p><p className="mt-1 text-sm text-[var(--muted-foreground)]">Khi số dư vượt một mốc sau thao tác giao dịch, bạn sẽ nhận thông báo chúc mừng. Mỗi mốc của mỗi mục tiêu chỉ được báo một lần, có lưu trong database.</p></div></div></>;
}
function WishlistCard({item,balance}:{item:WishlistInitial;balance:number}){
 const [edit,setEdit]=useState(false),percent=wishlistProgress(balance,item.cost),remaining=Math.max(0,item.cost-Math.max(0,balance));
 return <article className="panel p-6"><div className="flex items-start justify-between"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e0f1f0] text-[#367e84]"><Target size={23}/></span><Badge>{PRIORITY_NAMES[item.priority]}</Badge></div><h2 className="mt-5 line-clamp-2 text-xl font-bold">{item.name}</h2><p className="mt-1 text-sm text-[var(--muted-foreground)]">Giá mục tiêu: {formatVND(item.cost)}</p><div className="mt-6 flex items-end justify-between"><span className="text-sm font-semibold">Tiến độ tiết kiệm</span><strong className="text-2xl text-[#34838a]">{percent}%</strong></div><Progress className="mt-2" value={percent}/><p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">{percent>=100?<><CheckCircle2 size={14} className="text-emerald-500"/>Đã đủ số dư để mua mục tiêu này</>:<>Còn cần {formatVND(remaining)} để đạt mục tiêu</>}</p><div className="mt-6 flex justify-end gap-2 border-t border-[var(--border)] pt-4"><Dialog open={edit} onOpenChange={setEdit}><DialogTrigger asChild><Button variant="outline" size="sm"><Pencil size={15}/> Sửa</Button></DialogTrigger><DialogContent><DialogTitle className="text-xl font-bold">Sửa mục tiêu</DialogTitle><DialogDescription className="mb-5 mt-1">Cập nhật giá, tên hoặc mức độ ưu tiên.</DialogDescription><WishlistForm initial={item} onSaved={()=>setEdit(false)}/></DialogContent></Dialog><DeleteConfirm id={item.id} label={item.name} action={deleteWishlist}/></div></article>;
}
