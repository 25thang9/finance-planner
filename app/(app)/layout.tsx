export const dynamic = "force-dynamic";
import {requireUser} from "@/lib/session";
import {AppShell} from "@/components/app-shell";
export default async function AuthenticatedLayout({children}:{children:React.ReactNode}){
 const user=await requireUser();
 return <AppShell name={user.name} email={user.email}>{children}</AppShell>
}
