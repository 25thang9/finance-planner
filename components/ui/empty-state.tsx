import { Inbox } from "lucide-react";
export function EmptyState({title="Chưa có dữ liệu",description="Hãy thêm mục đầu tiên để bắt đầu."}:{title?:string;description?:string}){
 return <section aria-label={title} className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--border)] px-6 py-12 text-center"><span className="mb-4 rounded-2xl bg-[var(--muted)] p-4 text-[#437d8e]"><Inbox size={28}/></span><h3 className="font-bold">{title}</h3><p className="mt-1 max-w-xs text-sm text-[var(--muted-foreground)]">{description}</p></section>
}
