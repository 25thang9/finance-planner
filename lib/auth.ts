import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const github = githubId && githubSecret
 ? { github: { clientId: githubId, clientSecret: githubSecret } }
 : {};

export const auth = betterAuth({
  appName: "Finance Planner",
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  socialProviders: github,
  plugins: [nextCookies()],
});
