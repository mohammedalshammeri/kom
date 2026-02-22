import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AdvertisementsService } from './advertisements.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators';
import { UserRole } from '@prisma/client';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';

@ApiTags('Advertisements')
@Controller('advertisements')
export class AdvertisementsController {
  constructor(private readonly advertisementsService: AdvertisementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active advertisements (public)' })
  async findAll() {
    return this.advertisementsService.findAll();
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all advertisements (admin, including inactive)' })
  async findAllAdmin() {
    return this.advertisementsService.findAllAdmin();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload an advertisement (image or video)' })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 150 * 1024 * 1024 }), // 150MB
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() dto: CreateAdvertisementDto,
  ) {
    return this.advertisementsService.create(file, dto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle advertisement active status' })
  async toggle(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.advertisementsService.updateActive(id, isActive);
  }

  @Post(':id/view')
  @ApiOperation({ summary: 'Track a view for an advertisement (public)' })
  async trackView(@Param('id') id: string) {
    return this.advertisementsService.incrementView(id);
  }

  @Post(':id/click')
  @ApiOperation({ summary: 'Track a click for an advertisement (public)' })
  async trackClick(@Param('id') id: string) {
    return this.advertisementsService.incrementClick(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete an advertisement' })
  async remove(@Param('id') id: string) {
    return this.advertisementsService.remove(id);
  }
}
