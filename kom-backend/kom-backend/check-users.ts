import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Check all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  console.log('\n📋 Users in database:');
  console.log(JSON.stringify(users, null, 2));

  // Check if test users exist
  const individual = await prisma.user.findUnique({
    where: { email: 'individual@test.com' },
  });

  const showroom = await prisma.user.findUnique({
    where: { email: 'showroom@test.com' },
  });

  console.log('\n📊 Test users status:');
  console.log(`Individual (individual@test.com): ${individual ? '✅ EXISTS' : '❌ NOT FOUND'}`);
  console.log(`Showroom (showroom@test.com): ${showroom ? '✅ EXISTS' : '❌ NOT FOUND'}`);

  // Create test users if they don't exist
  if (!individual) {
    console.log('\n🔧 Creating individual test user...');
    const hashedPassword = await bcrypt.hash('Test123!', 12);
    await prisma.user.create({
      data: {
        email: 'individual@test.com',
        phone: '+97339001001',
        passwordHash: hashedPassword,
        role: 'USER_INDIVIDUAL',
        isActive: true,
        individualProfile: {
          create: {
            fullName: 'Test Individual User',
            governorate: 'Capital',
            city: 'Manama',
          },
        },
      },
    });
    console.log('✅ Individual test user created!');
  }

  if (!showroom) {
    console.log('\n🔧 Creating showroom test user...');
    const hashedPassword = await bcrypt.hash('Test123!', 12);
    await prisma.user.create({
      data: {
        email: 'showroom@test.com',
        phone: '+97339002002',
        passwordHash: hashedPassword,
        role: 'USER_SHOWROOM',
        isActive: true,
        showroomProfile: {
          create: {
            showroomName: 'Test Motors',
            crNumber: 'CR123456',
            governorate: 'Capital',
            city: 'Manama',
            address: 'Exhibition Road',
            contactPhones: {
              create: [
                { phone: '+97317001001', label: 'Main', isPrimary: true },
              ],
            },
          },
        },
      },
    });
    console.log('✅ Showroom test user created!');
  }

  // Final check
  const finalUsers = await prisma.user.findMany({
    select: {
      email: true,
      role: true,
    },
  });

  console.log('\n📋 Final users list:');
  finalUsers.forEach((u) => console.log(`  - ${u.email} (${u.role})`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
