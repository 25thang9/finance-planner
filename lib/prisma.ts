import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const singleton = globalThis as unknown as { prisma?: PrismaClient };
function makeClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL chưa được thiết lập trong .env");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
}
export const prisma = singleton.prisma ?? makeClient();
if (process.env.NODE_ENV !== "production") singleton.prisma = prisma;
