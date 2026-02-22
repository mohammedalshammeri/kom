import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { ListingStatus, NotificationType, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Runs daily at midnight.
   * - Warns listing owners every 5 days starting at day 20 (days 20, 25, 30)
   * - Auto-deletes listings that have been live for 35+ days
   * - Marks expired subscriptions as EXPIRED
   * - Warns merchants whose subscription expires within 3 days
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyTasks() {
    this.logger.debug('Running daily tasks...');
    await Promise.all([
      this.handleListingExpiryWarnings(),
      this.handleListingAutoDelete(),
      this.handleSubscriptionExpiry(),
    ]);
  }

  private async handleListingExpiryWarnings() {
    const now = new Date();

    // Find approved listings that are between 20 and 34 days old
    // and whose age mod 5 === 0 (i.e., exactly day 20, 25, 30)
    const approvedListings = await this.prisma.listing.findMany({
      where: {
        status: ListingStatus.APPROVED,
        postedAt: { not: null },
      },
      select: { id: true, ownerId: true, title: true, postedAt: true },
    });

    const warningIds: string[] = [];
    for (const listing of approvedListings) {
      if (!listing.postedAt) continue;
      const daysLive = Math.floor(
        (now.getTime() - listing.postedAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      // Warn on day 20, 25, 30 (every 5 days from day 20 up to day 34)
      if (daysLive >= 20 && daysLive < 35 && daysLive % 5 === 0) {
        warningIds.push(listing.id);
        const daysLeft = 35 - daysLive;
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        // Guard against duplicate same-day warning for the same listing
        const existing = await this.prisma.notification.findFirst({
          where: {
            userId: listing.ownerId,
            type: NotificationType.LISTING_EXPIRY_WARNING,
            createdAt: { gte: todayStart },
            metadata: { path: ['listingId'], equals: listing.id },
          },
        });
        if (!existing) {
          await this.prisma.notification.create({
            data: {
              userId: listing.ownerId,
              type: NotificationType.LISTING_EXPIRY_WARNING,
              title: 'إعلانك سينتهي قريباً',
              body: `إعلانك "${listing.title}" سينتهي خلال ${daysLeft} أيام.`,
              metadata: { listingId: listing.id, daysLive, daysLeft },
              isRead: false,
            },
          }).catch(() => {});
        }
      }
    }

    if (warningIds.length > 0) {
      this.logger.log(`Sent expiry warnings for ${warningIds.length} listings.`);
    }
  }

  private async handleListingAutoDelete() {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000);

    const result = await this.prisma.listing.updateMany({
      where: {
        status: ListingStatus.APPROVED,
        postedAt: { lte: cutoff },
      },
      data: {
        status: ListingStatus.EXPIRED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Auto-expired ${result.count} listings at 35-day limit.`);
    }
  }

  private async handleSubscriptionExpiry() {
    const now = new Date();

    // Mark expired subscriptions
    const expired = await this.prisma.subscription.updateMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: { lte: now },
      },
      data: { status: SubscriptionStatus.EXPIRED },
    });

    if (expired.count > 0) {
      this.logger.log(`Marked ${expired.count} subscriptions as expired.`);

      // Notify affected users
      const expiredSubs = await this.prisma.subscription.findMany({
        where: {
          status: SubscriptionStatus.EXPIRED,
          endDate: { lte: now },
          updatedAt: { gte: new Date(now.getTime() - 60 * 1000) }, // just updated
        },
        select: { userId: true },
      });

      for (const sub of expiredSubs) {
        await this.prisma.notification.create({
          data: {
            userId: sub.userId,
            type: NotificationType.SUBSCRIPTION_EXPIRED,
            title: 'انتهى اشتراكك',
            body: 'انتهى اشتراكك الشهري. يرجى تجديد الاشتراك لمتابعة نشر الإعلانات.',
            isRead: false,
          },
        }).catch(() => {});
      }
    }

    // Warn users whose subscription expires within 3 days
    const warnBefore = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const expiringSoon = await this.prisma.subscription.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
        endDate: { gt: now, lte: warnBefore },
      },
      select: { userId: true, endDate: true },
    });

    for (const sub of expiringSoon) {
      const daysLeft = Math.ceil((sub.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      // Check if we already warned today
      const alreadyWarned = await this.prisma.notification.findFirst({
        where: {
          userId: sub.userId,
          type: NotificationType.SUBSCRIPTION_EXPIRY_WARNING,
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          },
        },
      });
      if (!alreadyWarned) {
        await this.prisma.notification.create({
          data: {
            userId: sub.userId,
            type: NotificationType.SUBSCRIPTION_EXPIRY_WARNING,
            title: 'اشتراكك سينتهي قريباً',
            body: `اشتراكك سينتهي خلال ${daysLeft} ${daysLeft === 1 ? 'يوم' : 'أيام'}. يرجى التجديد.`,
            isRead: false,
          },
        }).catch(() => {});
      }
    }

    if (expiringSoon.length > 0) {
      this.logger.log(`Sent subscription expiry warnings to ${expiringSoon.length} users.`);
    }
  }
}

