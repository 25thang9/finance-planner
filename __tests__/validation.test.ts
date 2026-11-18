import {describe,it,expect} from "vitest";
import {transactionSchema,wishlistSchema,transactionFilterSchema,budgetSchema} from "@/lib/validation";
const good={type:"EXPENSE",amount:"5000",description:"Mua nước",category:"FOOD",date:"2026-11-17"};
describe("Zod 4 – validate ở server",()=>{
 it("giao dịch hợp lệ được chuyển amount về number",()=>{const result=transactionSchema.safeParse(good);expect(result.success).toBe(true);if(result.success)expect(result.data.amount).toBe(5000)});
 it("từ chối tiền âm",()=>expect(transactionSchema.safeParse({...good,amount:"-5"}).success).toBe(false));
 it("từ chối số thập phân",()=>expect(transactionSchema.safeParse({...good,amount:"5.5"}).success).toBe(false));
 it("từ chối mô tả rỗng",()=>expect(transactionSchema.safeParse({...good,description:"  "}).success).toBe(false));
 it("từ chối mô tả trên 120 ký tự",()=>expect(transactionSchema.safeParse({...good,description:"x".repeat(121)}).success).toBe(false));
 it("từ chối ngày sai",()=>expect(transactionSchema.safeParse({...good,date:"2026-99-99"}).success).toBe(false));
 it("chặn bộ lọc type không hợp lệ",()=>expect(transactionFilterSchema.safeParse({type:"XYZ"}).success).toBe(false));
 it("wishlist cần giá dương",()=>expect(wishlistSchema.safeParse({name:"Laptop",cost:"0",priority:"HIGH"}).success).toBe(false));
 it("ngân sách cần số nguyên dương",()=>expect(budgetSchema.safeParse({category:"FOOD",amount:"-100",month:"2026-11-01"}).success).toBe(false));
});
