import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";
import {BudgetManager} from "./budget-manager";
export default async function BudgetsPage(){
 const user=await requireUser();
 const budgets=await prisma.budget.findMany({where:{userId:user.id},orderBy:[{month:"desc"},{category:"asc"}],take:36});
 const from=budgets.length?budgets.reduce((min,b)=>b.month<min?b.month:min,budgets[0].month):new Date();
 const transactions=await prisma.transaction.findMany({where:{userId:user.id,type:"EXPENSE",date:{gte:from}},select:{amount:true,category:true,date:true}});
 const spent=(category:string,month:Date)=>transactions.filter(t=>t.category===category&&t.date.getUTCFullYear()===month.getUTCFullYear()&&t.date.getUTCMonth()===month.getUTCMonth()).reduce((n,t)=>n+t.amount,0);
 return <BudgetManager budgets={budgets.map(b=>({id:b.id,category:b.category,amount:b.amount,spent:spent(b.category,b.month),month:`${b.month.getUTCMonth()+1}/${b.month.getUTCFullYear()}`}))}/>;
}
