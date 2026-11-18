import "server-only";
import { prisma } from "@/lib/prisma";
import { wishlistProgress, crossedMilestones } from "@/lib/finance";

export async function userBalance(userId:string) {
 const [income,expense]=await Promise.all([
  prisma.transaction.aggregate({_sum:{amount:true},where:{userId,type:"INCOME"}}),
  prisma.transaction.aggregate({_sum:{amount:true},where:{userId,type:"EXPENSE"}}),
 ]);
 return {income:income._sum.amount??0,expense:expense._sum.amount??0,balance:(income._sum.amount??0)-(expense._sum.amount??0)};
}

// Việc ghi milestone xảy ra sau thao tác giao dịch thành công; DB unique ngăn lặp.
export async function recordCrossedMilestones(userId:string,before:number,after:number) {
 if (after<=before) return [] as string[];
 const wishlist=await prisma.wishlistItem.findMany({where:{userId},select:{id:true,name:true,cost:true}});
 const messages:string[]=[];
 for(const item of wishlist) {
  const thresholds=crossedMilestones(wishlistProgress(before,item.cost),wishlistProgress(after,item.cost));
  for(const milestone of thresholds) {
   const result=await prisma.savingMilestone.createMany({data:[{userId,wishlistId:item.id,milestone}],skipDuplicates:true});
   if(result.count===1) messages.push(`Bạn đã tiết kiệm được ${milestone}% cho ${item.name}!`);
  }
 }
 return messages;
}
