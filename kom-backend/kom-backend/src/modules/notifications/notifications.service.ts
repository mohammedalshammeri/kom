import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PushService } from './push.service';
import { NotificationType, Prisma, UserRole } from '@prisma/client';
import { PaginationDto, PaginatedResponse } from '../../common/dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pushService: PushService,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata?: Prisma.InputJsonValue,
    sendPush: boolean = true,
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        metadata,
        isRead: false,
      },
    });

    // Send push notification
    if (sendPush) {
      await this.pushService.sendPushNotification(userId, title, body, {
        notificationId: notification.id,
        type,
        ...(metadata && typeof metadata === 'object' && !Array.isArray(metadata) ? metadata : {}),
      });
    }

    return notification;
  }

  async getUserNotifications(userId: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return new PaginatedResponse(notifications, total, page, limit);
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { unreadCount: count };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { message: 'All notifications marked as read' };
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { message: 'Notification deleted' };
  }

  // Helper methods for creating specific notification types
  async notifyListingApproved(userId: string, listingId: string, listingTitle: string) {
    return this.createNotification(
      userId,
      NotificationType.LISTING_APPROVED,
      'Listing Approved',
      `Your listing "${listingTitle}" has been approved and is now live.`,
      { listingId },
    );
  }

  async notifyListingRejected(
    userId: string,
    listingId: string,
    listingTitle: string,
    reason: string,
  ) {
    return this.createNotification(
      userId,
      NotificationType.LISTING_REJECTED,
      'Listing Rejected',
      `Your listing "${listingTitle}" has been rejected. Reason: ${reason}`,
      { listingId, reason },
    );
  }

  async notifyListingSubmitted(userId: string, listingId: string, listingTitle: string) {
    return this.createNotification(
      userId,
      NotificationType.LISTING_SUBMITTED,
      'Listing Submitted',
      `Your listing "${listingTitle}" has been submitted for review.`,
      { listingId },
    );
  }

  async notifyPaymentReceived(userId: string, listingId: string, amount: number) {
    return this.createNotification(
      userId,
      NotificationType.PAYMENT_RECEIVED,
      'Payment Received',
      `Payment of ${amount} BHD received for your listing.`,
      { listingId, amount },
    );
  }

  async notifyAccountBanned(userId: string, reason: string) {
    return this.createNotification(
      userId,
      NotificationType.ACCOUNT_BANNED,
      'Account Suspended',
      `Your account has been suspended. Reason: ${reason}`,
      { reason },
      false, // Don't send push for banned accounts
    );
  }

  async notifyAccountUnbanned(userId: string) {
    return this.createNotification(
      userId,
      NotificationType.ACCOUNT_UNBANNED,
      'Account Restored',
      'Your account has been restored and is now active.',
      {},
    );
  }

  async notifyStoryApproved(userId: string, storyId: string) {
    return this.createNotification(
      userId,
      NotificationType.STORY_APPROVED,
      'Story Approved',
      'Your story has been approved and is now live.',
      { storyId },
    );
  }

  async notifyStoryRejected(
    userId: string,
    storyId: string,
    reason?: string,
  ) {
    return this.createNotification(
      userId,
      NotificationType.STORY_REJECTED,
      'Story Rejected',
      `Your story has been rejected.${reason ? ' Reason: ' + reason : ''}`,
      { storyId, reason },
    );
  }

  async sendSystemNotification(userId: string, title: string, body: string) {
    return this.createNotification(userId, NotificationType.SYSTEM, title, body, {});
  }

  async notifyAdmins(
    type: NotificationType,
    title: string,
    body: string,
    metadata?: Prisma.InputJsonValue,
  ) {
    const admins = await this.prisma.user.findMany({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
        isActive: true,
        isBanned: false,
      },
      select: { id: true },
    });

    if (admins.length === 0) {
      return { count: 0 };
    }

    await Promise.all(
      admins.map((admin) =>
        this.createNotification(admin.id, type, title, body, metadata, false),
      ),
    );

    return { count: admins.length };
  }
}
