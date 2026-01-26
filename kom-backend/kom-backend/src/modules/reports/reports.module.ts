import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController, AdminReportsController } from './reports.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [ReportsController, AdminReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
