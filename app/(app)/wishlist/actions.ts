"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { wishlistSchema, readFields, type WishlistFormState } from "@/lib/validation";

const fields=["name","cost","priority"] as const;
const idSchema=z.string().min(1).max(100);
function refresh(){ revalidatePath("/wishlist");revalidatePath("/dashboard"); }
export async function saveWishlist(id:string|null,_prev:WishlistFormState,formData:FormData):Promise<WishlistFormState> {
 const user=await requireUser();
 const values=readFields(formData,fields);
 const valid=wishlistSchema.safeParse(values);
 if(!valid.success) return {values,errors:z.flattenError(valid.error).fieldErrors};
 if(id!==null&&!idSchema.safeParse(id).success) return {values,message:"ID không hợp lệ"};
 try{
  if(id){
   const result=await prisma.wishlistItem.updateMany({where:{id,userId:user.id},data:valid.data});
   if(!result.count) return {values,message:"Món đồ không thuộc tài khoản của bạn"};
  }else await prisma.wishlistItem.create({data:{...valid.data,userId:user.id}});
  refresh();
  return {ok:true,message:id?"Đã cập nhật mục tiêu":"Đã thêm mục tiêu mới",nonce:Date.now()};
 }catch{return {values,message:"Không thể lưu mục tiêu"};}
}
export async function deleteWishlist(formData:FormData) {
 const user=await requireUser();
 const id=idSchema.safeParse(formData.get("id"));
 if(!id.success) throw new Error("ID không hợp lệ");
 const deleted=await prisma.wishlistItem.deleteMany({where:{id:id.data,userId:user.id}});
 if(!deleted.count) throw new Error("Món đồ không thuộc tài khoản");
 refresh();
}
