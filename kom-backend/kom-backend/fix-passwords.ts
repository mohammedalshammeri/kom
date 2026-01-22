import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const newPassword = 'Test123!';
  const hashedPassword = await bcrypt.hash(newPassword, 12);

  console.log('🔧 Updating test user passwords...');

  // Update individual user password
  await prisma.user.update({
    where: { email: 'individual@test.com' },
    data: { passwordHash: hashedPassword },
  });
  console.log('✅ individual@test.com password updated to: Test123!');

  // Update showroom user password
  await prisma.user.update({
    where: { email: 'showroom@test.com' },
    data: { passwordHash: hashedPassword },
  });
  console.log('✅ showroom@test.com password updated to: Test123!');

  // Update admin test user password
  await prisma.user.update({
    where: { email: 'admin@test.com' },
    data: { passwordHash: hashedPassword },
  });
  console.log('✅ admin@test.com password updated to: Test123!');

  console.log('\n🎉 All passwords updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
