-- AlterTable
ALTER TABLE "DocumentContext" ALTER COLUMN "id" SET DEFAULT (concat('dc-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "memoryUpdate" JSONB;

-- AlterTable
ALTER TABLE "Snippet" ALTER COLUMN "id" SET DEFAULT (concat('snp-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "apiKey" SET DEFAULT (concat('gp-', gen_random_uuid()))::TEXT;

-- CreateTable
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL DEFAULT (concat('m-', gen_random_uuid()))::TEXT,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Memory_id_key" ON "Memory"("id");

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
