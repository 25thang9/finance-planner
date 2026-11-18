"use server";
import * as z from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { userBalance, recordCrossedMilestones } from "@/lib/data";
import { transactionSchema, readTransactionValues, type TransactionFormState } from "@/lib/validation";

const idSchema=z.string().trim().min(1).max(100);
function invalidate() {
 revalidatePath("/transactions"); revalidatePath("/dashboard"); revalidatePath("/wishlist"); revalidatePath("/budgets");
}
function payload(data:z.infer<typeof transactionSchema>) {
 return {type:data.type,amount:data.amount,description:data.description,category:data.category,date:new Date(`${data.date}T12:00:00.000Z`)};
}
export async function createTransaction(_previous:TransactionFormState,formData:FormData):Promise<TransactionFormState> {
 const user=await requireUser();
 const values=readTransactionValues(formData);
 const result=transactionSchema.safeParse(values);
 if(!result.success) return {values,errors:z.flattenError(result.error).fieldErrors};
 try {
  const before=(await userBalance(user.id)).balance;
  await prisma.transaction.create({data:{...payload(result.data),userId:user.id}});
  const after=(await userBalance(user.id)).balance;
  const notifications=await recordCrossedMilestones(user.id,before,after);
  invalidate();
  return {ok:true,message:"Đã thêm giao dịch",notifications,nonce:Date.now()};
 } catch {return {values,message:"Không thể lưu giao dịch. Vui lòng thử lại."};}
}
export async function updateTransaction(id:string,_previous:TransactionFormState,formData:FormData):Promise<TransactionFormState> {
 const user=await requireUser();
 const values=readTransactionValues(formData);
 const result=transactionSchema.safeParse(values);
 if(!result.success) return {values,errors:z.flattenError(result.error).fieldErrors};
 if(!idSchema.safeParse(id).success) return {values,message:"ID không hợp lệ"};
 try {
  const before=(await userBalance(user.id)).balance;
  const updated=await prisma.transaction.updateMany({where:{id,userId:user.id},data:payload(result.data)});
  if(!updated.count) return {values,message:"Không tìm thấy giao dịch thuộc tài khoản của bạn"};
  const after=(await userBalance(user.id)).balance;
  const notifications=await recordCrossedMilestones(user.id,before,after);
  invalidate();
  return {ok:true,message:"Đã cập nhật giao dịch",nonce:Date.now(),notifications};
 } catch {return {values,message:"Không thể cập nhật giao dịch"};}
}
export async function deleteTransaction(formData:FormData) {
 const user=await requireUser();
 const parsed=idSchema.safeParse(formData.get("id"));
 if(!parsed.success) throw new Error("ID không hợp lệ");
 const before=(await userBalance(user.id)).balance;
 const deleted=await prisma.transaction.deleteMany({where:{id:parsed.data,userId:user.id}});
 if(!deleted.count) throw new Error("Không tìm thấy giao dịch thuộc tài khoản");
 const after=(await userBalance(user.id)).balance;
 const notifications=await recordCrossedMilestones(user.id,before,after);
 invalidate();
 return {notifications};
}
