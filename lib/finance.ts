import type { Category, TransactionType } from "@/generated/prisma/enums";
export const formatVND = (amount: number) => new Intl.NumberFormat("vi-VN", {style:"currency",currency:"VND",maximumFractionDigits:0}).format(amount);
export type Range = "this-month" | "last-month" | "all";
export function getDateRange(range:Range, now = new Date()) {
 if (range === "all") return undefined;
 const back = range === "last-month" ? 1 : 0;
 const y = now.getFullYear(), m = now.getMonth() - back;
 return { gte:new Date(y,m,1), lt:new Date(y,m+1,1) };
}
export function calculateBalance(rows: readonly {type:TransactionType;amount:number}[]) {
 return rows.reduce((balance,row)=> balance+(row.type === "INCOME" ? row.amount : -row.amount),0);
}
export function spendingByCategory(rows: readonly {type:TransactionType;category:Category;amount:number}[]) {
 const totals:Partial<Record<Category,number>>={};
 for(const row of rows) if(row.type === "EXPENSE") totals[row.category]=(totals[row.category]??0)+row.amount;
 return totals;
}
export function wishlistProgress(balance:number,cost:number) {
 if (cost<=0) return 100;
 return Math.min(100,Math.max(0,Math.floor(balance/cost*100)));
}
export const MILESTONES = [50,75,100] as const;
export function crossedMilestones(previous:number,next:number) {
 return MILESTONES.filter(m=>previous < m && next>=m);
}
export function budgetProgress(spent:number, budget:number) {
 if (budget<=0) return 100;
 return Math.max(0, Math.round(spent/budget*100));
}
export function budgetStatus(spent:number,budget:number):"safe"|"warning"|"over" {
 const n=budgetProgress(spent,budget);
 return n >= 100 ? "over" : n >= 80 ? "warning" : "safe";
}
export function monthKey(date:Date) {return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;}
