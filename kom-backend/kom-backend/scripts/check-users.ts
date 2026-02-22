import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.user.count();
  const byRole = await prisma.user.groupBy({ by: ['role'], _count: { id: true } });
  const active = await prisma.user.count({ where: { isActive: true } });
  const banned = await prisma.user.count({ where: { isBanned: true } });

  console.log('=== Users in Database ===');
  console.log('Total:', total);
  console.log('Active:', active);
  console.log('Banned:', banned);
  console.log('\nBy Role:');
  byRole.forEach(r => console.log(' ', r.role, ':', r._count.id));

  // Show last 5 users
  const recent = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { email: true, role: true, isActive: true, createdAt: true }
  });
  console.log('\nRecent users:');
  recent.forEach(u => console.log(' ', u.email, `[${u.role}]`, u.isActive ? '✓' : '✗'));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
