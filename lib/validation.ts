import * as z from "zod";
import { Category, Priority, TransactionType } from "@/generated/prisma/enums";
const positiveVND = z.coerce.number<number>({error:"Vui lòng nhập số tiền"}).int({error:"Số tiền phải là số nguyên"}).positive({error:"Số tiền phải lớn hơn 0"}).max(2_000_000_000,{error:"Số tiền quá lớn"});
export const transactionSchema = z.object({
 type:z.enum(TransactionType,{error:"Chọn loại giao dịch"}),
 amount:positiveVND,
 description:z.string().trim().min(1,{error:"Nhập mô tả"}).max(120,{error:"Mô tả tối đa 120 ký tự"}),
 category:z.enum(Category,{error:"Chọn danh mục"}),
 date:z.iso.date({error:"Ngày không hợp lệ"}),
});
export const wishlistSchema = z.object({
 name:z.string().trim().min(1,{error:"Nhập tên món đồ"}).max(120,{error:"Tối đa 120 ký tự"}),
 cost:positiveVND,
 priority:z.enum(Priority,{error:"Chọn mức ưu tiên"}),
});
export const budgetSchema=z.object({category:z.enum(Category),amount:positiveVND,month:z.iso.date()});
export const transactionFilterSchema = z.object({
 range:z.enum(["this-month","last-month","all"]).default("this-month"),
 type:z.enum(TransactionType).optional(),
 category:z.enum(Category).optional(),
 q:z.string().trim().max(80).optional(),
});
export type Filters = z.infer<typeof transactionFilterSchema>;
export type TransactionValues = Partial<Record<keyof z.infer<typeof transactionSchema>,string>>;
export type TransactionFormState={ok?:boolean;message?:string;errors?:Partial<Record<keyof TransactionValues,string[]>>;values?:TransactionValues;notifications?:string[];nonce?:number};
export type WishlistFormState={ok?:boolean;message?:string;errors?:Partial<Record<string,string[]>>;values?:Record<string,string>;nonce?:number};
export function readFields(formData:FormData,names:readonly string[]) {
 return Object.fromEntries(names.map(f=>[f,String(formData.get(f)??"")]));
}
export function readTransactionValues(formData:FormData):TransactionValues {
 return readFields(formData,["type","amount","description","category","date"]);
}
