import { PrismaClient, ListingType, ListingStatus, UserRole, Transmission, FuelType, CarCondition, PartCondition, StorageProvider, MediaType, StoryStatus } from '@prisma/client';

console.log("Script loaded");

const prisma = new PrismaClient();

// Data Arrays for Random Generation (Arabic)
const brands = [
  { make: 'تويوتا', models: ['كامري', 'كورولا', 'لاند كروزر', 'هايلكس', 'سوبرا', 'يارس', 'أفالون', 'برادو'] },
  { make: 'نيسان', models: ['باترول', 'صني', 'ألتيما', 'جي تي آر', 'ماكسيما', 'إكس تريل', 'كيكس'] },
  { make: 'هوندا', models: ['سيفيك', 'أكورد', 'سي آر في', 'بايلوت', 'سيتي', 'جاز'] },
  { make: 'هيونداي', models: ['إلنترا', 'سوناتا', 'توسان', 'سنتافي', 'أكسنت', 'ازيرا'] },
  { make: 'فورد', models: ['موستنج', 'إف-150', 'إكسبلورر', 'توروس', 'إيدج'] },
  { make: 'بي إم دبليو', models: ['الفئة 3', 'الفئة 5', 'الفئة 7', 'X5', 'X6', 'M3'] },
  { make: 'مرسيدس', models: ['C-Class', 'E-Class', 'S-Class', 'G-Class', 'GLE', 'GLC'] },
  { make: 'لكزس', models: ['ES', 'LS', 'LX', 'RX', 'IS'] },
  { make: 'شيفروليه', models: ['تاهو', 'كورفيت', 'كمارو', 'ماليبو', 'سلفرادو'] },
  { make: 'كيا', models: ['سبورتاج', 'سورينتو', 'K5', 'تيلورايد', 'بيكانتو'] }
];

const motoBrands = [
  { make: 'هوندا', models: ['CBR1000RR', 'جولد وينج', 'CRF450', 'Rebel', 'Grom'] },
  { make: 'ياماها', models: ['R1', 'R6', 'MT-07', 'MT-09', 'Raptor'] },
  { make: 'كاواساكي', models: ['نينجا H2', 'نينجا 400', 'Z900', 'KX450'] },
  { make: 'سوزوكي', models: ['هايا بوزا', 'GSX-R1000', 'V-Strom'] },
  { make: 'هارلي ديفيدسون', models: ['سبورتستر', 'سوفتيل', 'تورينج', 'ستريت جلويد'] },
  { make: 'دوكاتي', models: ['بانيجال', 'مونستر', 'ملتي سترادا'] },
  { make: 'بي إم دبليو', models: ['S1000RR', 'R1250GS', 'K1600'] }
];

const colors = ['أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'أصفر', 'ذهبي', 'بني', 'برتقالي'];
const governorates = ['العاصمة', 'المحرق', 'الشمالية', 'الجنوبية'];
const areas = ['المنامة', 'الرفاع', 'مدينة عيسى', 'مدينة حمد', 'الحد', 'سار', 'الجفير', 'السيف', 'البديع'];
const bodyTypes = ['سيدان', 'دفع رباعي', 'كوبيه', 'كشف', 'هاتشباك', 'بيك أب', 'فان'];
const motoBodyTypes = ['رياضية', 'كروزر', 'سكوتر', 'تيورنج', 'أخرى'];
const partCategories = ['محرك', 'قير', 'هيكل', 'داخلية', 'عجلات', 'إلكترونيات', 'نظام تعليق', 'فرامل'];
const plateCategories = ['خصوصي', 'تجاري', 'دراجة نارية', 'دبلوماسي'];

// Helpers
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
  console.log('🚀 Starting bulk data generation (Arabic)...');

  // 1. Get or Create a User to own these listings
  const userEmail = 'mock-data@test.com';
  let user = await prisma.user.findUnique({ where: { email: userEmail } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userEmail,
        // Hash for "Test1234!" - just a placeholder as we might not log in with it, but good to have
        passwordHash: '$2b$12$eX6.jX6.jX6.jX6.jX6.jX6.jX6.jX6.jX6.jX6.jX6.jX6.jX6.j', 
        role: UserRole.USER_SHOWROOM,
        isActive: true,
        phone: '+97333333333',
        showroomProfile: {
          create: {
            showroomName: 'معرض السيارات التجريبي',
            governorate: 'العاصمة',
            city: 'المنامة',
          }
        }
      }
    });
    console.log(`👤 Created user: ${user.email}`);
  } else {
    console.log(`👤 Using existing user: ${user.email}`);
  }

  const userId = user.id;
  const ownerType = user.role;

  // 0. CLEANUP: Delete existing listings for this user to avoid duplicates
  console.log('🧹 Cleaning up old mock listings...');
  const deleted = await prisma.listing.deleteMany({
    where: { ownerId: userId }
  });
  console.log(`🗑️ Deleted ${deleted.count} old listings.`);

  // 2. Generate 50 Cars
  console.log('🚗 Generating 50 Cars...');
  for (let i = 0; i < 50; i++) {
    try {
      // console.log(`Debug car ${i}`);
      const brand = getRandom(brands);
      const model = getRandom(brand.models);
      const year = getRandomInt(2015, 2026);
      const price = getRandomInt(3000, 25000);
      const mileage = getRandomInt(0, 150000);

      const condition = mileage === 0 ? CarCondition.NEW : CarCondition.USED;
      const descCondition = condition === CarCondition.NEW ? 'جديدة' : 'مستعملة';

      await prisma.listing.create({
        data: {
          ownerId: userId,
          ownerType: ownerType,
          type: ListingType.CAR,
          title: `${brand.make} ${model} ${year}`,
          description: `استمتع بقيادة هذه الـ ${brand.make} ${model}. السيارة ${descCondition} وبحالة ممتازة. فرصة رائعة بسعر مغري. تواصل معنا للمزيد من الصور والتفاصيل.`,
          price: price,
          currency: 'BHD',
          locationGovernorate: getRandom(governorates),
          locationArea: getRandom(areas),
          status: ListingStatus.APPROVED,
          postedAt: new Date(),
          approvedAt: new Date(),
          carDetails: {
            create: {
              make: brand.make,
              model: model,
              year: year,
              mileageKm: mileage,
              transmission: getRandom(Object.values(Transmission)),
              fuel: getRandom(Object.values(FuelType)),
              condition: condition,
              color: getRandom(colors),
              bodyType: getRandom(bodyTypes),
              engineSize: `${getRandomInt(1600, 6000)}cc`
            }
          },
          // Add a placeholder image
          media: {
            create: {
              type: MediaType.IMAGE,
              storageProvider: StorageProvider.S3, // Mock provider
              objectKey: `mock/car/${i}`,
              url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Generic car image
              sortOrder: 0,
              mimeType: 'image/jpeg',
              width: 1000,
              height: 750,
              fileSize: 102400
            }
          }
        }
      });
      // console.log(`Created car ${i}`);
    } catch (error) {
      console.log(`Failed to create car ${i}:`);
      console.log(error);
      // throw error; // Re-throw to see it
    }
  }

  // 3. Generate 50 Motorcycles
  console.log('🏍️ Generating 50 Motorcycles...');
  for (let i = 0; i < 50; i++) {
    const brand = getRandom(motoBrands);
    const model = getRandom(brand.models);
    const year = getRandomInt(2018, 2026);
    const price = getRandomInt(1000, 8000);
    const mileage = getRandomInt(0, 50000);

    try {
    await prisma.listing.create({
      data: {
        ownerId: userId,
        ownerType: ownerType,
        type: ListingType.MOTORCYCLE,
        title: `${brand.make} ${model} ${year}`,
        description: `دراجة ${brand.make} ${model} قوية وجاهزة للطريق. ممشى قليل ${mileage} كم.`,
        price: price,
        currency: 'BHD',
        locationGovernorate: getRandom(governorates),
        locationArea: getRandom(areas),
        status: ListingStatus.APPROVED,
        postedAt: new Date(),
        approvedAt: new Date(),
        motorcycleDetails: {
          create: {
            make: brand.make,
            model: model,
            year: year,
            mileageKm: mileage,
            transmission: getRandom(Object.values(Transmission)),
            condition: mileage === 0 ? CarCondition.NEW : CarCondition.USED,
            color: getRandom(colors),
            bodyType: getRandom(motoBodyTypes),
            engineSize: `${getRandomInt(250, 1300)}cc`
          }
        },
        media: {
          create: {
            type: MediaType.IMAGE,
            storageProvider: StorageProvider.S3,
            objectKey: `mock/moto/${i}`,
            url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Generic moto image
            sortOrder: 0,
            mimeType: 'image/jpeg',
            width: 1000,
            height: 750,
            fileSize: 102400
          }
        }
      }
    });
    } catch (error) {
        console.error(`Failed to create moto ${i}:`, error);
    }
  }

  // 4. Generate 50 Plates
  console.log('🔢 Generating 50 Plates...');
  for (let i = 0; i < 50; i++) {
    const plateNum = getRandomInt(100, 999999);
    const price = getRandomInt(500, 50000);

    await prisma.listing.create({
      data: {
        ownerId: userId,
        ownerType: ownerType,
        type: ListingType.PLATE,
        title: `لوحة مميزة ${plateNum}`,
        description: `رقم مميز ${plateNum} للبيع. جاهز للتحويل فوراً.`,
        price: price,
        currency: 'BHD',
        locationGovernorate: getRandom(governorates),
        locationArea: getRandom(areas),
        status: ListingStatus.APPROVED,
        postedAt: new Date(),
        approvedAt: new Date(),
        plateDetails: {
          create: {
            plateNumber: plateNum.toString(),
            plateCategory: getRandom(plateCategories),
          }
        }
      }
    });
  }

  // 5. Generate 50 Parts
  console.log('🔧 Generating 50 Parts...');
  for (let i = 0; i < 50; i++) {
    const partCat = getRandom(partCategories);
    const brand = getRandom(brands);
    const price = getRandomInt(20, 1000);

    await prisma.listing.create({
      data: {
        ownerId: userId,
        ownerType: ownerType,
        type: ListingType.PART,
        title: `${brand.make} - ${partCat} أصلي`,
        description: `قطعة ${partCat} عالية الجودة لسيارة ${brand.make}. الحالة ممتازة.`,
        price: price,
        currency: 'BHD',
        locationGovernorate: getRandom(governorates),
        locationArea: getRandom(areas),
        status: ListingStatus.APPROVED,
        postedAt: new Date(),
        approvedAt: new Date(),
        partDetails: {
          create: {
            partCategory: partCat,
            partName: `${partCat} كامل`,
            partNumber: `PN-${getRandomInt(10000, 99999)}`,
            compatibleCarMake: brand.make,
            condition: getRandom(Object.values(PartCondition)),
            brand: 'وكالة',
            deliveryAvailable: Math.random() > 0.5
          }
        },
        media: {
          create: {
            type: MediaType.IMAGE,
            storageProvider: StorageProvider.S3,
            objectKey: `mock/part/${i}`,
            url: 'https://images.unsplash.com/photo-1486262715619-01b8c2297615?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80', // Generic mechanical part
            sortOrder: 0,
            mimeType: 'image/jpeg',
            width: 1000,
            height: 750,
            fileSize: 102400
          }
        }
      }
    });
  }

  // 6. Generate Admin Videos (Tutorials & Promo)
  console.log('🎥 Generating Admin Videos...');
  const adminVideoUrls = [
      'https://videos.pexels.com/video-files/3196236/3196236-uhd_2560_1440_25fps.mp4', 
      'https://videos.pexels.com/video-files/855564/855564-hd_1920_1080_24fps.mp4',
      'https://videos.pexels.com/video-files/4489776/4489776-uhd_3840_2160_25fps.mp4'
  ];
  
  for(let i=0; i<3; i++) {
    await prisma.adminVideo.create({
        data: {
            title: i===0 ? 'طريقة إضافة إعلان' : (i===1 ? 'جولة في المعرض' : 'مراجعة تويوتا كامري'),
            description: 'فيديو توضيحي يشرح كيفية استخدام التطبيق والاستفادة من المميزات.',
            videoUrl: adminVideoUrls[i],
            thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
            viewsCount: getRandomInt(100, 5000),
            isActive: true
        }
    });
  }

  // 7. Generate User Stories
  console.log('📱 Generating Stories...');
  for(let i=0; i<10; i++) {
     const isVideo = Math.random() > 0.5;
     await prisma.story.create({
         data: {
             userId: userId,
             mediaType: isVideo ? MediaType.VIDEO : MediaType.IMAGE,
             mediaUrl: isVideo 
                ? 'https://videos.pexels.com/video-files/5225154/5225154-hd_1920_1080_30fps.mp4' 
                : 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366',
             duration: isVideo ? 15 : 5,
             status: StoryStatus.ACTIVE,
             postedAt: new Date(),
             expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24h
             viewsCount: getRandomInt(10, 200),
             likesCount: getRandomInt(0, 50)
         }
     });
  }

  // 8. Add Videos to some Cars
  console.log('📹 Adding videos to some listings...');
  const someCars = await prisma.listing.findMany({ where: { type: ListingType.CAR }, take: 5 });
  for (const car of someCars) {
      await prisma.media.create({
          data: {
              listingId: car.id,
              type: MediaType.VIDEO,
              storageProvider: StorageProvider.S3,
              objectKey: `mock/car-video/${car.id}`,
              url: 'https://videos.pexels.com/video-files/2882787/2882787-uhd_2560_1440_30fps.mp4',
              mimeType: 'video/mp4',
              sortOrder: 1
          }
      });
  }

  console.log('✅ Done! Generated 200 listings, Admin Videos, and Stories (Arabic).');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
