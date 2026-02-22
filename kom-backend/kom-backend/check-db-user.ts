// check-user.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('Usage: npx ts-node check-user.ts <email> <password>');
    return;
  }

  console.log(`Checking user: ${email}...`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ User found');
  console.log('ID:', user.id);
  console.log('Role:', user.role);
  console.log('Banned:', user.isBanned);
  console.log('Active:', user.isActive);
  console.log('Password Hash (first 20 chars):', user.passwordHash?.substring(0, 20));

  console.log('Validating password...');
  if (!user.passwordHash) {
      console.log('❌ No password hash set for user');
      return;
  }
  
  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (isValid) {
    console.log('✅ Password VALID');
  } else {
    console.log('❌ Password INVALID');
  }
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
