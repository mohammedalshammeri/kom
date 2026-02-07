import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { ListingStatus } from '@prisma/client';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleListingExpiration() {
    this.logger.debug('Checking for expired listings...');

    const now = new Date();

    const result = await this.prisma.listing.updateMany({
      where: {
        status: ListingStatus.APPROVED,
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: ListingStatus.EXPIRED,
      },
    });

    if (result.count > 0) {
      this.logger.log(`Expired ${result.count} listings.`);
    } else {
      this.logger.debug('No listings expired today.');
    }
  }
}
