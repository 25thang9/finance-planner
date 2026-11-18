export const dynamic = "force-dynamic";
import {redirect} from "next/navigation";
import {getUser} from "@/lib/session";
export default async function HomePage(){const user=await getUser();redirect(user?"/dashboard":"/login")}
