-- CreateEnum
CREATE TYPE "PlateType" AS ENUM ('PRIVATE', 'TRANSPORT', 'MOTORCYCLE');

-- CreateEnum
CREATE TYPE "MerchantType" AS ENUM ('CAR_SHOWROOM', 'GARAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "ListingStatus" ADD VALUE 'EXPIRED';

-- AlterEnum
ALTER TYPE "ListingType" ADD VALUE 'MOTORCYCLE';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'STORY_APPROVED';
ALTER TYPE "NotificationType" ADD VALUE 'STORY_REJECTED';

-- AlterTable
ALTER TABLE "CarDetails" ADD COLUMN     "bodyCondition" TEXT,
ADD COLUMN     "interiorColor" TEXT,
ADD COLUMN     "paintType" TEXT;

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PartDetails" ADD COLUMN     "deliveryAvailable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PlateDetails" ADD COLUMN     "plateType" "PlateType";

-- AlterTable
ALTER TABLE "ShowroomProfile" ADD COLUMN     "merchantType" "MerchantType" DEFAULT 'CAR_SHOWROOM';

-- CreateTable
CREATE TABLE "MotorcycleDetails" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "mileageKm" INTEGER,
    "transmission" "Transmission" NOT NULL,
    "condition" "CarCondition" NOT NULL,
    "color" TEXT,
    "engineSize" TEXT,
    "bodyType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotorcycleDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "duration" INTEGER,
    "status" "StoryStatus" NOT NULL DEFAULT 'PENDING',
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "postedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "commentsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryLike" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryComment" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "status" "CommentStatus" NOT NULL DEFAULT 'APPROVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminVideo" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "description" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MotorcycleDetails_listingId_key" ON "MotorcycleDetails"("listingId");

-- CreateIndex
CREATE INDEX "MotorcycleDetails_make_idx" ON "MotorcycleDetails"("make");

-- CreateIndex
CREATE INDEX "MotorcycleDetails_model_idx" ON "MotorcycleDetails"("model");

-- CreateIndex
CREATE INDEX "MotorcycleDetails_year_idx" ON "MotorcycleDetails"("year");

-- CreateIndex
CREATE INDEX "MotorcycleDetails_make_model_idx" ON "MotorcycleDetails"("make", "model");

-- CreateIndex
CREATE INDEX "Story_userId_idx" ON "Story"("userId");

-- CreateIndex
CREATE INDEX "Story_status_idx" ON "Story"("status");

-- CreateIndex
CREATE INDEX "Story_expiresAt_idx" ON "Story"("expiresAt");

-- CreateIndex
CREATE INDEX "StoryLike_storyId_idx" ON "StoryLike"("storyId");

-- CreateIndex
CREATE INDEX "StoryLike_userId_idx" ON "StoryLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryLike_storyId_userId_key" ON "StoryLike"("storyId", "userId");

-- CreateIndex
CREATE INDEX "StoryComment_storyId_idx" ON "StoryComment"("storyId");

-- CreateIndex
CREATE INDEX "StoryComment_userId_idx" ON "StoryComment"("userId");

-- CreateIndex
CREATE INDEX "StoryComment_createdAt_idx" ON "StoryComment"("createdAt");

-- CreateIndex
CREATE INDEX "StoryComment_status_idx" ON "StoryComment"("status");

-- CreateIndex
CREATE INDEX "AdminVideo_isActive_idx" ON "AdminVideo"("isActive");

-- CreateIndex
CREATE INDEX "AdminVideo_createdAt_idx" ON "AdminVideo"("createdAt");

-- AddForeignKey
ALTER TABLE "MotorcycleDetails" ADD CONSTRAINT "MotorcycleDetails_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryLike" ADD CONSTRAINT "StoryLike_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryLike" ADD CONSTRAINT "StoryLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryComment" ADD CONSTRAINT "StoryComment_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryComment" ADD CONSTRAINT "StoryComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
