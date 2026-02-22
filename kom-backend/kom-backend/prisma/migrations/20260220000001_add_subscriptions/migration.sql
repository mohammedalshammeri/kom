-- Add new MerchantType values
ALTER TYPE "MerchantType" ADD VALUE IF NOT EXISTS 'SPARE_PARTS';
ALTER TYPE "MerchantType" ADD VALUE IF NOT EXISTS 'PLATES';
ALTER TYPE "MerchantType" ADD VALUE IF NOT EXISTS 'MOTORCYCLES';

-- Add new NotificationType values
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'LISTING_EXPIRY_WARNING';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'SUBSCRIPTION_EXPIRY_WARNING';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'SUBSCRIPTION_EXPIRED';

-- Add SubscriptionStatus enum
DO $$ BEGIN
  CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create SubscriptionPackage table
CREATE TABLE IF NOT EXISTS "SubscriptionPackage" (
  "id"           TEXT NOT NULL,
  "name"         TEXT NOT NULL,
  "description"  TEXT,
  "priceMonthly" DECIMAL(10,3) NOT NULL,
  "currency"     "Currency" NOT NULL DEFAULT 'BHD',
  "maxListings"  INTEGER NOT NULL,
  "durationDays" INTEGER NOT NULL DEFAULT 30,
  "isActive"     BOOLEAN NOT NULL DEFAULT true,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SubscriptionPackage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SubscriptionPackage_isActive_idx" ON "SubscriptionPackage"("isActive");

-- Create Subscription table
CREATE TABLE IF NOT EXISTS "Subscription" (
  "id"           TEXT NOT NULL,
  "userId"       TEXT NOT NULL,
  "packageId"    TEXT NOT NULL,
  "status"       "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "startDate"    TIMESTAMP(3) NOT NULL,
  "endDate"      TIMESTAMP(3) NOT NULL,
  "listingsUsed" INTEGER NOT NULL DEFAULT 0,
  "paidAmount"   DECIMAL(10,3) NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Subscription_userId_key" UNIQUE ("userId"),
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Subscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "SubscriptionPackage"("id")
);

CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");
CREATE INDEX IF NOT EXISTS "Subscription_endDate_idx" ON "Subscription"("endDate");

-- Seed default packages
INSERT INTO "SubscriptionPackage" ("id", "name", "description", "priceMonthly", "maxListings", "durationDays", "sortOrder", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'الباقة الأساسية', 'حتى 5 إعلانات نشطة شهرياً', 9.900, 5, 30, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'الباقة المتقدمة', 'حتى 15 إعلانات نشطة شهرياً', 19.900, 15, 30, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'الباقة الاحترافية', 'حتى 50 إعلانات نشطة شهرياً', 39.900, 50, 30, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
