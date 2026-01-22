import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser, Roles, Public } from '../../common/decorators';
import { UserRole } from '@prisma/client';
import { InitiatePaymentDto, ManualPaymentDto } from './dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('listing-fee/initiate')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Initiate listing fee payment' })
  @ApiResponse({ status: 201, description: 'Payment initiated' })
  async initiateListingFeePayment(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiateListingFeePayment(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transaction/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get transaction details' })
  @ApiResponse({ status: 200, description: 'Transaction details' })
  async getTransaction(@Param('id') id: string) {
    return this.paymentsService.getTransaction(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('listing/:listingId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get transactions for a listing' })
  @ApiResponse({ status: 200, description: 'Listing transactions' })
  async getListingTransactions(
    @CurrentUser('id') userId: string,
    @Param('listingId') listingId: string,
  ) {
    return this.paymentsService.getListingTransactions(userId, listingId);
  }

  @Public()
  @Post('webhook/:provider')
  @ApiOperation({ summary: 'Payment provider webhook (public)' })
  @ApiResponse({ status: 200, description: 'Webhook received' })
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.paymentsService.handlePaymentWebhook(provider, payload);
  }

  // Admin endpoint for manual payment marking
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Post('transaction/:id/mark-paid')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Manually mark payment as paid (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Payment marked as paid' })
  async markPaymentAsPaid(
    @CurrentUser('id') adminId: string,
    @Param('id') transactionId: string,
    @Body() dto: ManualPaymentDto,
  ) {
    return this.paymentsService.markPaymentAsPaid(transactionId, {
      ...dto,
      adminId,
    });
  }
}
