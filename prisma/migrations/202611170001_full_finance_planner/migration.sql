-- NÂNG CẤP TỪ SCHEMA BÀI LAB TUẦN 8 CỦA NGƯỜI DÙNG.
-- Lưu ý: sao lưu Neon trước khi deploy migration; migration không xoá dữ liệu giao dịch.
ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'ENTERTAINMENT';
ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'SHOPPING';
ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'BILLS';
ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'INVESTMENT';

ALTER TABLE "User"
  ADD COLUMN "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "image" TEXT,
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Transaction" RENAME COLUMN "note" TO "description";
UPDATE "Transaction" SET "description" = 'Không có mô tả' WHERE "description" IS NULL;
ALTER TABLE "Transaction" ALTER COLUMN "description" SET NOT NULL;
ALTER TABLE "Transaction" ALTER COLUMN "amount" TYPE INTEGER USING ROUND("amount")::INTEGER;
ALTER TABLE "Transaction" ALTER COLUMN "date" DROP DEFAULT;
ALTER TABLE "Transaction" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date");

ALTER TABLE "WishlistItem" RENAME COLUMN "price" TO "cost";
ALTER TABLE "WishlistItem" ALTER COLUMN "cost" TYPE INTEGER USING ROUND("cost")::INTEGER;
ALTER TABLE "WishlistItem" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "WishlistItem_userId_idx" ON "WishlistItem"("userId");

CREATE TABLE "Session" (
 "id" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "token" TEXT NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "ipAddress" TEXT, "userAgent" TEXT, "userId" TEXT NOT NULL,
 CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Account" (
 "id" TEXT NOT NULL, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL,
 "userId" TEXT NOT NULL, "accessToken" TEXT, "refreshToken" TEXT, "idToken" TEXT,
 "accessTokenExpiresAt" TIMESTAMP(3), "refreshTokenExpiresAt" TIMESTAMP(3),
 "scope" TEXT, "password" TEXT,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Verification" (
 "id" TEXT NOT NULL, "identifier" TEXT NOT NULL, "value" TEXT NOT NULL,
 "expiresAt" TIMESTAMP(3) NOT NULL,
 "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SavingMilestone" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "wishlistId" TEXT NOT NULL,
 "milestone" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "SavingMilestone_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SavingMilestone_userId_wishlistId_milestone_key" ON "SavingMilestone"("userId", "wishlistId", "milestone");
ALTER TABLE "SavingMilestone" ADD CONSTRAINT "SavingMilestone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SavingMilestone" ADD CONSTRAINT "SavingMilestone_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "WishlistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "Budget" (
 "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "category" "Category" NOT NULL,
 "month" TIMESTAMP(3) NOT NULL, "amount" INTEGER NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Budget_userId_category_month_key" ON "Budget"("userId", "category", "month");
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
