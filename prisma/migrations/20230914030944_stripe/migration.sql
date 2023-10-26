-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- AlterTable
ALTER TABLE "DocumentContext" ALTER COLUMN "id" SET DEFAULT (concat('dc-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Memory" ALTER COLUMN "id" SET DEFAULT (concat('m-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "Snippet" ALTER COLUMN "id" SET DEFAULT (concat('snp-', gen_random_uuid()))::TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "subscription" "Subscription",
ALTER COLUMN "apiKey" SET DEFAULT (concat('gp-', gen_random_uuid()))::TEXT;
