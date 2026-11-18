import type { NextRequest } from "next/server";
import { getUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { transactionFilterSchema } from "@/lib/validation";
import { getDateRange } from "@/lib/finance";
export async function GET(request:NextRequest) {
 const user=await getUser();
 if(!user)return Response.json({error:"Cần đăng nhập"},{status:401});
 const raw=Object.fromEntries(request.nextUrl.searchParams);
 const parsed=transactionFilterSchema.safeParse(raw);
 if(!parsed.success)return Response.json({error:"Tham số lọc không hợp lệ"},{status:400});
 const f=parsed.data;
 const transactions=await prisma.transaction.findMany({
  where:{userId:user.id,date:getDateRange(f.range),type:f.type,category:f.category,
   ...(f.q?{description:{contains:f.q,mode:"insensitive" as const}}:{})},
  select:{id:true,amount:true,type:true,description:true,category:true,date:true},
  orderBy:{date:"desc"},take:1000,
 });
 return Response.json(transactions,{headers:{"Cache-Control":"private, no-store"}});
}
