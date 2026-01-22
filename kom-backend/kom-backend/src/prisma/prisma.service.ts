import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Delete in order to respect foreign key constraints
    await this.$transaction([
      this.auditLog.deleteMany(),
      this.notification.deleteMany(),
      this.report.deleteMany(),
      this.deviceToken.deleteMany(),
      this.refreshToken.deleteMany(),
      this.paymentTransaction.deleteMany(),
      this.media.deleteMany(),
      this.carDetails.deleteMany(),
      this.plateDetails.deleteMany(),
      this.partDetails.deleteMany(),
      this.listing.deleteMany(),
      this.showroomContactPhone.deleteMany(),
      this.showroomProfile.deleteMany(),
      this.individualProfile.deleteMany(),
      this.adminPermission.deleteMany(),
      this.user.deleteMany(),
      this.systemSetting.deleteMany(),
    ]);
  }
}
