import "dotenv/config";
import { randomBytes } from "node:crypto";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { ROWS, WISHLIST } from "./seed-data";

async function main(){
 const email=process.env.DEMO_EMAIL?.trim()||"demo@financeplanner.local";
 let user=await prisma.user.findUnique({where:{email}});
 if(!user){
  const password=process.env.DEMO_PASSWORD||randomBytes(14).toString("base64url");
  const res=await auth.api.signUpEmail({body:{email,name:"Tài khoản Demo",password}});
  user=await prisma.user.findUnique({where:{email}});
  if(!user)throw new Error(`Không tạo được user demo: ${JSON.stringify(res)}`);
  console.log(`DEMO_EMAIL=${email}`);
  console.log(`DEMO_PASSWORD=${password} (lưu riêng; không commit; chỉ in khi tạo user)`);
 }else{
  console.log(`Đã có user demo ${email}. Nếu không có mật khẩu, dùng email khác trong DEMO_EMAIL để seed mới.`);
 }
 const transactionCount=await prisma.transaction.count({where:{userId:user.id}});
 if(transactionCount===0){
  await prisma.transaction.createMany({data:ROWS.map(row=>({...row,userId:user!.id}))});
  console.log(`Đã seed ${ROWS.length} giao dịch.`);
 }else console.log(`Giữ nguyên ${transactionCount} giao dịch đã có của demo (không xóa).`);
 const wishlistCount=await prisma.wishlistItem.count({where:{userId:user.id}});
 if(wishlistCount===0){
  await prisma.wishlistItem.createMany({data:WISHLIST.map(item=>({...item,userId:user!.id}))});
  console.log(`Đã seed ${WISHLIST.length} wishlist.`);
 }else console.log(`Giữ nguyên ${wishlistCount} wishlist đã có của demo.`);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(async()=>prisma.$disconnect());
