import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ListingStatus, Prisma } from '@prisma/client';
import { PaginatedResponse } from '../../common/dto';
import { PendingListingsQueryDto, RejectListingDto } from './dto';

@Injectable()
export class ModerationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPendingListings(query: PendingListingsQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {
      status: ListingStatus.PENDING_REVIEW,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.ownerType) {
      where.ownerType = query.ownerType;
    }

    if (query.dateFrom) {
      where.postedAt = { gte: new Date(query.dateFrom) };
    }

    if (query.dateTo) {
      where.postedAt = {
        ...(where.postedAt as Prisma.DateTimeFilter),
        lte: new Date(query.dateTo),
      };
    }

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        include: {
          media: { orderBy: { sortOrder: 'asc' }, take: 1 },
          carDetails: true,
          plateDetails: true,
          partDetails: true,
          owner: {
            select: {
              id: true,
              email: true,
              phone: true,
              role: true,
              isActive: true,
              isBanned: true,
              createdAt: true,
              individualProfile: { select: { fullName: true } },
              showroomProfile: { select: { showroomName: true } },
            },
          },
        },
        orderBy: { postedAt: 'asc' }, // Oldest first for FIFO
        skip,
        take: limit,
      }),
      this.prisma.listing.count({ where }),
    ]);

    return new PaginatedResponse(listings, total, page, limit);
  }

  async getListingForReview(listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        media: { orderBy: { sortOrder: 'asc' } },
        carDetails: true,
        plateDetails: true,
        partDetails: true,
        paymentTransactions: true,
        owner: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            isBanned: true,
            createdAt: true,
            lastLoginAt: true,
            individualProfile: true,
            showroomProfile: {
              include: { contactPhones: true },
            },
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    // Get owner's other listings count
    const ownerListingsCount = await this.prisma.listing.count({
      where: { ownerId: listing.ownerId },
    });

    const ownerApprovedCount = await this.prisma.listing.count({
      where: {
        ownerId: listing.ownerId,
        status: ListingStatus.APPROVED,
      },
    });

    return {
      ...listing,
      ownerStats: {
        totalListings: ownerListingsCount,
        approvedListings: ownerApprovedCount,
      },
    };
  }

  async approveListing(listingId: string, adminId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.PENDING_REVIEW) {
      throw new BadRequestException('Listing is not pending review');
    }

    // Get before state for audit log
    const beforeState = { status: listing.status };

    // Approve listing
    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.APPROVED,
        approvedAt: new Date(),
        rejectedAt: null,
        rejectionReason: null,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'LISTING_APPROVED',
        entityType: 'Listing',
        entityId: listingId,
        before: beforeState,
        after: { status: ListingStatus.APPROVED },
      },
    });

    // Notify owner
    await this.notificationsService.notifyListingApproved(
      listing.ownerId,
      listing.id,
      listing.title,
    );

    return updated;
  }

  async rejectListing(listingId: string, adminId: string, dto: RejectListingDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.PENDING_REVIEW) {
      throw new BadRequestException('Listing is not pending review');
    }

    // Get before state for audit log
    const beforeState = { status: listing.status };

    // Reject listing
    const updated = await this.prisma.listing.update({
      where: { id: listingId },
      data: {
        status: ListingStatus.REJECTED,
        rejectedAt: new Date(),
        rejectionReason: dto.reason,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'LISTING_REJECTED',
        entityType: 'Listing',
        entityId: listingId,
        before: beforeState,
        after: { status: ListingStatus.REJECTED, reason: dto.reason },
      },
    });

    // Notify owner
    await this.notificationsService.notifyListingRejected(
      listing.ownerId,
      listing.id,
      listing.title,
      dto.reason,
    );

    return updated;
  }

  async getRecentModerationActivity(adminId: string, limit: number = 20) {
    const auditLogs = await this.prisma.auditLog.findMany({
      where: {
        actorId: adminId,
        action: { in: ['LISTING_APPROVED', 'LISTING_REJECTED'] },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return auditLogs;
  }

  async getModerationStats() {
    const [pendingCount, approvedToday, rejectedToday, _totalPending] = await Promise.all([
      this.prisma.listing.count({
        where: { status: ListingStatus.PENDING_REVIEW },
      }),
      this.prisma.listing.count({
        where: {
          status: ListingStatus.APPROVED,
          approvedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      this.prisma.listing.count({
        where: {
          status: ListingStatus.REJECTED,
          rejectedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      this.prisma.listing.count({
        where: { status: ListingStatus.PENDING_REVIEW },
      }),
    ]);

    // Get pending by type
    const pendingByType = await this.prisma.listing.groupBy({
      by: ['type'],
      where: { status: ListingStatus.PENDING_REVIEW },
      _count: true,
    });

    return {
      pendingCount,
      approvedToday,
      rejectedToday,
      pendingByType: pendingByType.map((p) => ({
        type: p.type,
        count: p._count,
      })),
    };
  }
}
