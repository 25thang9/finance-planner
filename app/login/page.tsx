export const dynamic = "force-dynamic";
import {AuthForm} from "@/components/auth-form";
import {getUser} from "@/lib/session";
import {redirect} from "next/navigation";
export default async function Login(){if(await getUser())redirect("/dashboard");return <AuthForm mode="login" githubEnabled={Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)}/>}
