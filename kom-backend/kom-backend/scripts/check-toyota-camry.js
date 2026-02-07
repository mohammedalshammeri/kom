const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const listings = await prisma.listing.findMany({
    where: { status: 'APPROVED' },
    include: { carDetails: true },
    take: 100,
  });

  console.log('APPROVED listings:', listings.length);

  const matches = listings.filter((l) =>
    l.carDetails &&
    String(l.carDetails.make || '').includes('تويوتا') &&
    String(l.carDetails.model || '').includes('كامري')
  );

  console.log('Toyota Camry matches:', matches.length);
  matches.forEach((l) => {
    console.log({
      id: l.id,
      title: l.title,
      make: l.carDetails?.make,
      model: l.carDetails?.model,
    });
  });
}

main()
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
