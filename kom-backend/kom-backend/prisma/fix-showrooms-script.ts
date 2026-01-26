import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing active showrooms...');
  
  const result = await prisma.user.updateMany({
    where: {
      role: UserRole.USER_SHOWROOM,
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });

  console.log(`Updated ${result.count} showrooms to inactive status.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
