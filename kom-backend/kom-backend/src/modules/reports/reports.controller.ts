import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, Roles } from '../../common/decorators';
import { UserRole } from '@prisma/client';
import { CreateReportDto, ReportQueryDto, ResolveReportDto } from './dto';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // User endpoints
  @Post()
  @ApiOperation({ summary: 'Create a report or complaint' })
  @ApiResponse({ status: 201, description: 'Report created' })
  async createReport(@CurrentUser('id') userId: string, @Body() dto: CreateReportDto) {
    return this.reportsService.createReport(userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my reports' })
  @ApiResponse({ status: 200, description: 'My reports' })
  async getMyReports(@CurrentUser('id') userId: string, @Query() query: ReportQueryDto) {
    return this.reportsService.getMyReports(userId, query);
  }
}

// Admin controller for reports
@ApiTags('Admin Reports')
@Controller('admin/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
@ApiBearerAuth('JWT-auth')
export class AdminReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all reports (Admin)' })
  @ApiResponse({ status: 200, description: 'All reports' })
  async getAllReports(@Query() query: ReportQueryDto) {
    return this.reportsService.getAllReports(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get report statistics' })
  @ApiResponse({ status: 200, description: 'Report stats' })
  async getReportStats() {
    return this.reportsService.getReportStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get report details' })
  @ApiResponse({ status: 200, description: 'Report details' })
  async getReportById(@Param('id') id: string) {
    return this.reportsService.getReportById(id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve a report' })
  @ApiResponse({ status: 200, description: 'Report resolved' })
  async resolveReport(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
    @Body() dto: ResolveReportDto,
  ) {
    return this.reportsService.resolveReport(id, adminId, dto);
  }
}
