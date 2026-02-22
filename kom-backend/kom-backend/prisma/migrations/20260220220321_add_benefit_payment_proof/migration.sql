/*
  Warnings:

  - Added the required column `userId` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'PAYMENT_PROOF_SUBMITTED';
ALTER TYPE "NotificationType" ADD VALUE 'PAYMENT_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'PAYMENT_REJECTED';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'PENDING_PROOF';

-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "adminNote" TEXT,
ADD COLUMN     "paymentType" TEXT NOT NULL DEFAULT 'LISTING_FEE',
ADD COLUMN     "proofImageUrl" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT,
ADD COLUMN     "subscriptionId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "listingId" DROP NOT NULL,
ALTER COLUMN "provider" SET DEFAULT 'benefit';

-- CreateIndex
CREATE INDEX "PaymentTransaction_userId_idx" ON "PaymentTransaction"("userId");

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
