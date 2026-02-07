import { Module } from '@nestjs/common';
import { AdminVideosService } from './admin-videos.service';
import { AdminVideosController } from './admin-videos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [PrismaModule, MediaModule],
  controllers: [AdminVideosController],
  providers: [AdminVideosService],
})
export class AdminVideosModule {}
