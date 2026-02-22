import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole, SubscriptionStatus } from '@prisma/client';
import { CreatePackageDto, UpdatePackageDto, SubscribeDto } from './dto';

@Injectable()
export class PackagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // ------- Public -------

  async getActivePackages() {
    return this.prisma.subscriptionPackage.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // ------- Merchant -------

  async getMySubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { package: true },
    });
    return subscription;
  }

  async subscribe(userId: string, dto: SubscribeDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.USER_SHOWROOM) {
      throw new ForbiddenException('Only showroom accounts can subscribe to packages');
    }

    const pkg = await this.prisma.subscriptionPackage.findUnique({
      where: { id: dto.packageId },
    });
    if (!pkg || !pkg.isActive) {
      throw new NotFoundException('Package not found or inactive');
    }

    const existing = await this.prisma.subscription.findUnique({ where: { userId } });

    if (existing && existing.status === SubscriptionStatus.ACTIVE) {
      const now = new Date();
      if (existing.endDate > now) {
        throw new BadRequestException(
          'You already have an active subscription. You can renew or change packages after it expires.',
        );
      }
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + (pkg.durationDays ?? 30));

    const subscription = await this.prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        packageId: dto.packageId,
        status: SubscriptionStatus.ACTIVE,
        startDate: now,
        endDate,
        listingsUsed: 0,
        paidAmount: pkg.priceMonthly,
      },
      update: {
        packageId: dto.packageId,
        status: SubscriptionStatus.ACTIVE,
        startDate: now,
        endDate,
        listingsUsed: 0,
        paidAmount: pkg.priceMonthly,
      },
      include: { package: true },
    });

    return subscription;
  }

  // ------- Admin -------

  async getAllPackages() {
    return this.prisma.subscriptionPackage.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { subscriptions: true } } },
    });
  }

  async createPackage(dto: CreatePackageDto) {
    return this.prisma.subscriptionPackage.create({
      data: {
        name: dto.name,
        description: dto.description,
        priceMonthly: dto.priceMonthly,
        maxListings: dto.maxListings,
        durationDays: dto.durationDays ?? 30,
        sortOrder: dto.sortOrder ?? 0,
        isActive: true,
      },
    });
  }

  async updatePackage(packageId: string, dto: UpdatePackageDto) {
    const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id: packageId } });
    if (!pkg) throw new NotFoundException('Package not found');

    return this.prisma.subscriptionPackage.update({
      where: { id: packageId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priceMonthly !== undefined && { priceMonthly: dto.priceMonthly }),
        ...(dto.maxListings !== undefined && { maxListings: dto.maxListings }),
        ...(dto.durationDays !== undefined && { durationDays: dto.durationDays }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async deletePackage(packageId: string) {
    const pkg = await this.prisma.subscriptionPackage.findUnique({
      where: { id: packageId },
      include: { _count: { select: { subscriptions: true } } },
    });
    if (!pkg) throw new NotFoundException('Package not found');

    if (pkg._count.subscriptions > 0) {
      // Soft-delete: just deactivate
      return this.prisma.subscriptionPackage.update({
        where: { id: packageId },
        data: { isActive: false },
      });
    }

    return this.prisma.subscriptionPackage.delete({ where: { id: packageId } });
  }

  // ------- Helpers used by other services -------

  async canMerchantPost(userId: string): Promise<{ allowed: boolean; reason?: string }> {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      include: { package: true },
    });

    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      return { allowed: false, reason: 'لا يوجد اشتراك نشط. يرجى الاشتراك في إحدى الباقات.' };
    }

    const now = new Date();
    if (subscription.endDate <= now) {
      return { allowed: false, reason: 'انتهى اشتراكك. يرجى تجديد الاشتراك.' };
    }

    if (subscription.listingsUsed >= subscription.package.maxListings) {
      return {
        allowed: false,
        reason: `لقد وصلت إلى الحد الأقصى من الإعلانات (${subscription.package.maxListings}) لباقتك الحالية.`,
      };
    }

    return { allowed: true };
  }

  async incrementListingsUsed(userId: string) {
    await this.prisma.subscription.updateMany({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      data: { listingsUsed: { increment: 1 } },
    });
  }
}

