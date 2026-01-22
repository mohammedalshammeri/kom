import { Module, forwardRef } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { S3Service } from './s3.service';
import { CloudinaryService } from './cloudinary.service';
import { ListingsModule } from '../listings/listings.module';

@Module({
  imports: [forwardRef(() => ListingsModule)],
  controllers: [MediaController],
  providers: [MediaService, S3Service, CloudinaryService],
  exports: [MediaService, S3Service, CloudinaryService],
})
export class MediaModule {}
