import { PrismaClient, ListingStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Count by status
  const expired = await prisma.listing.count({ where: { status: ListingStatus.EXPIRED } });
  const approved = await prisma.listing.count({ where: { status: ListingStatus.APPROVED } });
  const pending = await prisma.listing.count({ where: { status: ListingStatus.PENDING_REVIEW } });

  console.log(`Current counts:`);
  console.log(`  APPROVED: ${approved}`);
  console.log(`  EXPIRED:  ${expired}`);
  console.log(`  PENDING:  ${pending}`);

  if (expired === 0) {
    console.log('No expired listings found.');
    return;
  }

  // Restore expired listings: reset postedAt to now (so they won't expire for another 35 days)
  const result = await prisma.listing.updateMany({
    where: { status: ListingStatus.EXPIRED },
    data: {
      status: ListingStatus.APPROVED,
      postedAt: new Date(),
      approvedAt: new Date(),
    },
  });

  console.log(`\n✅ Restored ${result.count} listings from EXPIRED → APPROVED`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
