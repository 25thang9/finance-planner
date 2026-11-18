"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { budgetSchema,readFields } from "@/lib/validation";

export type BudgetState={ok?:boolean;message?:string;errors?:Partial<Record<string,string[]>>;values?:Record<string,string>;nonce?:number};
export async function saveBudget(_previous:BudgetState,formData:FormData):Promise<BudgetState> {
 const user=await requireUser();
 const values=readFields(formData,["category","amount","month"]);
 // date input tháng: YYYY-MM. Đổi về ngày đầu tháng trước khi validate.
 const prepared={...values,month:/^\d{4}-\d{2}$/.test(values.month)?`${values.month}-01`:values.month};
 const parsed=budgetSchema.safeParse(prepared);
 if(!parsed.success)return {values,errors:z.flattenError(parsed.error).fieldErrors};
 const month=new Date(`${parsed.data.month}T00:00:00.000Z`);
 try {
  await prisma.budget.upsert({
   where:{userId_category_month:{userId:user.id,category:parsed.data.category,month}},
   create:{userId:user.id,category:parsed.data.category,month,amount:parsed.data.amount},
   update:{amount:parsed.data.amount},
  });
  revalidatePath("/budgets"); revalidatePath("/dashboard");
  return {ok:true,message:"Đã lưu ngân sách",nonce:Date.now()};
 } catch {return {values,message:"Không thể lưu ngân sách"};}
}
export async function removeBudget(formData:FormData){
 const user=await requireUser();
 const id=z.string().min(1).max(100).safeParse(formData.get("id"));
 if(!id.success)throw new Error("ID không hợp lệ");
 const deleted=await prisma.budget.deleteMany({where:{id:id.data,userId:user.id}});
 if(!deleted.count)throw new Error("Không tìm thấy ngân sách");
 revalidatePath("/budgets");
}
