import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController, AdminStoriesController } from './stories.controller';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [StoriesController, AdminStoriesController],
  providers: [StoriesService],
  exports: [StoriesService],
})
export class StoriesModule {}
