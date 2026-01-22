import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PaymentStatus, ListingType, Currency } from '@prisma/client';
import { InitiatePaymentDto, ManualPaymentDto } from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async initiateListingFeePayment(userId: string, dto: InitiatePaymentDto) {
    // Check if listing exists and belongs to user
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: {
        paymentTransactions: {
          where: { status: PaymentStatus.PAID },
        },
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== userId) {
      throw new ForbiddenException('You can only pay for your own listings');
    }

    // Check if payment is required
    const requirePayment = this.configService.get<boolean>('payment.requirePaymentForCarListing');
    if (!requirePayment && listing.type === ListingType.CAR) {
      throw new BadRequestException('Payment is not required for this listing type');
    }

    // Check if already paid
    if (listing.paymentTransactions.length > 0) {
      throw new BadRequestException('Listing fee already paid');
    }

    // Get listing fee
    const listingFee = this.configService.get<number>('payment.listingFeeBhd') || 3;

    // Create pending transaction
    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        listingId: dto.listingId,
        amount: listingFee,
        currency: Currency.BHD,
        status: PaymentStatus.PENDING,
        provider: dto.provider || 'manual', // Will be actual provider in production
        metadata: {
          initiatedAt: new Date().toISOString(),
          userId,
        },
      },
    });

    // In production, this would integrate with actual payment provider
    // and return payment URL/details
    return {
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
      },
      // Placeholder for payment provider integration
      paymentDetails: {
        provider: transaction.provider,
        message: 'Payment provider integration pending. Use manual payment for testing.',
        // In production: paymentUrl, sessionId, etc.
      },
    };
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            status: true,
            ownerId: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async getListingTransactions(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.ownerId !== userId) {
      throw new ForbiddenException('You can only view your own listing transactions');
    }

    const transactions = await this.prisma.paymentTransaction.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }

  // Webhook handler for payment provider (stub)
  async handlePaymentWebhook(provider: string, payload: Record<string, unknown>) {
    // This would be implemented based on the payment provider
    // For now, it's a stub that logs the webhook

    console.log(`Payment webhook received from ${provider}:`, payload);

    // In production:
    // 1. Verify webhook signature
    // 2. Extract transaction reference
    // 3. Update transaction status
    // 4. Notify user

    return { received: true };
  }

  // Manual payment marking (for Super Admin in testing/manual payments)
  async markPaymentAsPaid(transactionId: string, dto: ManualPaymentDto) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status === PaymentStatus.PAID) {
      throw new BadRequestException('Transaction is already marked as paid');
    }

    const updated = await this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        providerRef: dto.reference || `MANUAL_${Date.now()}`,
        metadata: {
          ...(transaction.metadata as object),
          markedPaidAt: new Date().toISOString(),
          markedPaidBy: dto.adminId,
          note: dto.note,
        },
      },
    });

    return updated;
  }

  // Refund payment (stub for future implementation)
  async refundPayment(transactionId: string, reason: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.status !== PaymentStatus.PAID) {
      throw new BadRequestException('Can only refund paid transactions');
    }

    // In production, this would call the payment provider's refund API
    const updated = await this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatus.REFUNDED,
        metadata: {
          ...(transaction.metadata as object),
          refundedAt: new Date().toISOString(),
          refundReason: reason,
        },
      },
    });

    return updated;
  }

  // Check if listing has paid fee
  async hasListingPaidFee(listingId: string): Promise<boolean> {
    const paidTransaction = await this.prisma.paymentTransaction.findFirst({
      where: {
        listingId,
        status: PaymentStatus.PAID,
      },
    });

    return !!paidTransaction;
  }
}
