import {Suspense} from "react";
import {prisma} from "@/lib/prisma";
import {requireUser} from "@/lib/session";
import {getDateRange} from "@/lib/finance";
import {transactionFilterSchema,type Filters} from "@/lib/validation";
import {TransactionFilters} from "./transaction-filters";
import {TransactionManager} from "./transaction-manager";
export default function TransactionsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 return <div className="space-y-6"><div><p className="muted-label">QUẢN LÝ DÒNG TIỀN</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Giao dịch</h1><p className="subtle-title mt-2">Thêm, xem, sửa, xóa và tìm kiếm thu chi theo URL.</p></div><Suspense fallback={<div role="status" className="panel p-8">Đang tải giao dịch...</div>}><Results searchParams={searchParams}/></Suspense></div>
}
async function Results({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){
 const user=await requireUser();
 const raw=await searchParams;
 const result=transactionFilterSchema.safeParse(raw);
 const filter:Filters=result.success?result.data:{range:"this-month"};
 const rows=await prisma.transaction.findMany({where:{userId:user.id,date:getDateRange(filter.range),
  type:filter.type,category:filter.category,
  ...(filter.q?{description:{contains:filter.q,mode:"insensitive" as const}}:{})},
  select:{id:true,type:true,amount:true,description:true,category:true,date:true},orderBy:{date:"desc"},take:500});
 return <><TransactionFilters filter={filter}/><TransactionManager rows={rows.map(r=>({...r,date:r.date.toISOString().slice(0,10)}))}/></>;
}
