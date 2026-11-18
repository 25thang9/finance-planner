"use client";
import {useState} from "react";
import {Trash2,Loader2} from "lucide-react";
import {toast} from "sonner";
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
export function DeleteConfirm({id,label,action}:{id:string;label:string;action:(formData:FormData)=>Promise<void|{notifications?:string[]}>}) {
 const [open,setOpen]=useState(false),[pending,setPending]=useState(false);
 async function remove(){setPending(true);try{const form=new FormData();form.set("id",id);const result=await action(form);toast.success("Đã xóa thành công");if(result && result.notifications){result.notifications.forEach(x=>toast.success(x,{duration:6000}));}setOpen(false);}catch(error){toast.error(error instanceof Error?error.message:"Xóa thất bại")}finally{setPending(false)}}
 return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="ghost" size="icon" aria-label={`Xóa ${label}`} title="Xóa" className="text-rose-600"><Trash2 size={17}/></Button></DialogTrigger><DialogContent><DialogTitle className="pr-7 text-xl font-bold">Bạn chắc chắn muốn xóa?</DialogTitle><DialogDescription className="mt-2">Bạn sắp xóa <strong>{label}</strong>. Thao tác này không thể hoàn tác.</DialogDescription><div className="mt-7 flex justify-end gap-3"><Button variant="outline" onClick={()=>setOpen(false)} disabled={pending}>Hủy</Button><Button variant="destructive" onClick={remove} disabled={pending}>{pending&&<Loader2 className="animate-spin" size={17}/>} Xóa</Button></div></DialogContent></Dialog>
}
