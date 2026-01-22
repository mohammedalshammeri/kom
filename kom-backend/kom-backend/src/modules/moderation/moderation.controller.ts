import { Controller, Get, Post, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ModerationService } from './moderation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '@prisma/client';
import { PendingListingsQueryDto, RejectListingDto } from './dto';

@ApiTags('Moderation')
@Controller('admin/moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  @Get('listings/pending')
  @ApiOperation({ summary: 'Get pending listings for review' })
  @ApiResponse({ status: 200, description: 'List of pending listings' })
  async getPendingListings(@Query() query: PendingListingsQueryDto) {
    return this.moderationService.getPendingListings(query);
  }

  @Get('listings/:id')
  @ApiOperation({ summary: 'Get listing details for review' })
  @ApiResponse({ status: 200, description: 'Listing details' })
  async getListingForReview(@Param('id') id: string) {
    return this.moderationService.getListingForReview(id);
  }

  @Post('listings/:id/approve')
  @ApiOperation({ summary: 'Approve a listing' })
  @ApiResponse({ status: 200, description: 'Listing approved' })
  async approveListing(@Param('id') id: string, @CurrentUser('id') adminId: string) {
    return this.moderationService.approveListing(id, adminId);
  }

  @Post('listings/:id/reject')
  @ApiOperation({ summary: 'Reject a listing' })
  @ApiResponse({ status: 200, description: 'Listing rejected' })
  async rejectListing(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: RejectListingDto,
  ) {
    return this.moderationService.rejectListing(id, adminId, dto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get moderation statistics' })
  @ApiResponse({ status: 200, description: 'Moderation stats' })
  async getModerationStats() {
    return this.moderationService.getModerationStats();
  }

  @Get('my-activity')
  @ApiOperation({ summary: 'Get my recent moderation activity' })
  @ApiResponse({ status: 200, description: 'Recent activity' })
  async getMyActivity(@CurrentUser('id') adminId: string) {
    return this.moderationService.getRecentModerationActivity(adminId);
  }
}
