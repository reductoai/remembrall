-- CreateEnum
CREATE TYPE "Role" AS ENUM ('assistant', 'user');

-- AlterTable
ALTER TABLE "DocumentContext" ALTER COLUMN "id" SET DEFAULT (concat('dc-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Memory" ALTER COLUMN "id" SET DEFAULT (concat('m-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Snippet" ALTER COLUMN "id" SET DEFAULT (concat('snp-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "apiKey" SET DEFAULT (concat('gp-', gen_random_uuid()))::TEXT;

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "History_id_key" ON "History"("id");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
