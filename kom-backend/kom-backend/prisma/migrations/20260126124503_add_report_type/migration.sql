-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('LISTING', 'COMPLAINT');

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_listingId_fkey";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "type" "ReportType" NOT NULL DEFAULT 'LISTING',
ALTER COLUMN "listingId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Report_type_idx" ON "Report"("type");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
