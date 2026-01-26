import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReportStatus, ListingStatus, Prisma, ReportType } from '@prisma/client';
import { PaginatedResponse } from '../../common/dto';
import { CreateReportDto, ReportQueryDto, ResolveReportDto } from './dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createReport(userId: string, dto: CreateReportDto) {
    const type = dto.type ?? ReportType.LISTING;

    if (type === ReportType.LISTING) {
      if (!dto.listingId) {
        throw new BadRequestException('Listing ID is required for listing reports');
      }

      // Check if listing exists and is visible
      const listing = await this.prisma.listing.findUnique({
        where: { id: dto.listingId },
      });

      if (!listing) {
        throw new NotFoundException('Listing not found');
      }

      if (listing.status !== ListingStatus.APPROVED && listing.status !== ListingStatus.SOLD) {
        throw new BadRequestException('Can only report visible listings');
      }

      // Check if user already reported this listing
      const existingReport = await this.prisma.report.findFirst({
        where: {
          reporterId: userId,
          listingId: dto.listingId,
          status: { in: [ReportStatus.OPEN, ReportStatus.UNDER_REVIEW] },
        },
      });

      if (existingReport) {
        throw new BadRequestException('You have already reported this listing');
      }
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId: userId,
        listingId: type === ReportType.LISTING ? dto.listingId : null,
        type,
        reason: dto.reason,
        details: dto.details,
        status: ReportStatus.OPEN,
      },
    });

    return report;
  }

  async getMyReports(userId: string, query: ReportQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = { reporterId: userId };

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return new PaginatedResponse(reports, total, page, limit);
  }

  // Admin methods
  async getAllReports(query: ReportQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
          listing: {
            select: {
              id: true,
              title: true,
              status: true,
              ownerId: true,
              owner: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.report.count({ where }),
    ]);

    return new PaginatedResponse(reports, total, page, limit);
  }

  async getReportById(reportId: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        listing: {
          include: {
            media: { orderBy: { sortOrder: 'asc' } },
            carDetails: true,
            plateDetails: true,
            partDetails: true,
            owner: {
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                isBanned: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async resolveReport(reportId: string, adminId: string, dto: ResolveReportDto) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status === ReportStatus.RESOLVED || report.status === ReportStatus.DISMISSED) {
      throw new BadRequestException('Report is already resolved');
    }

    const updated = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: dto.action === 'resolve' ? ReportStatus.RESOLVED : ReportStatus.DISMISSED,
        resolvedBy: adminId,
        resolvedAt: new Date(),
        resolution: dto.resolution,
      },
    });

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: dto.action === 'resolve' ? 'REPORT_RESOLVED' : 'REPORT_DISMISSED',
        entityType: 'Report',
        entityId: reportId,
        before: { status: report.status },
        after: { status: updated.status, resolution: dto.resolution },
      },
    });

    const statusLabel = dto.action === 'resolve' ? 'تم حل الشكوى' : 'تم إغلاق الشكوى';
    const body = dto.resolution?.trim()
      ? `${statusLabel}. الرد: ${dto.resolution.trim()}`
      : statusLabel;

    await this.notificationsService.sendSystemNotification(
      report.reporterId,
      'تحديث على الشكوى',
      body,
    );

    return updated;
  }

  async getReportStats() {
    const [openCount, underReviewCount, resolvedCount, dismissedCount] = await Promise.all([
      this.prisma.report.count({ where: { status: ReportStatus.OPEN } }),
      this.prisma.report.count({ where: { status: ReportStatus.UNDER_REVIEW } }),
      this.prisma.report.count({ where: { status: ReportStatus.RESOLVED } }),
      this.prisma.report.count({ where: { status: ReportStatus.DISMISSED } }),
    ]);

    return {
      open: openCount,
      underReview: underReviewCount,
      resolved: resolvedCount,
      dismissed: dismissedCount,
      total: openCount + underReviewCount + resolvedCount + dismissedCount,
    };
  }
}
