import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CloudinaryService } from '../media/cloudinary.service';
import { PaymentStatus, ListingType, Currency, NotificationType, UserRole } from '@prisma/client';
import {
  InitiatePaymentDto,
  InitiateSubscriptionPaymentDto,
  InitiateFeaturedPaymentDto,
  SubmitBenefitProofDto,
  ReviewPaymentDto,
  ManualPaymentDto,
} from './dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly notificationsService: NotificationsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ─── Benefit IBAN ────────────────────────────────────────────────────────────

  async getBenefitIban(): Promise<{ iban: string; accountName: string }> {
    const [ibanSetting, nameSetting] = await Promise.all([
      this.prisma.systemSetting.findUnique({ where: { key: 'benefit_iban' } }),
      this.prisma.systemSetting.findUnique({ where: { key: 'benefit_account_name' } }),
    ]);

    return {
      iban: ibanSetting?.value ?? 'BH00XXXX0000000000000000',
      accountName: nameSetting?.value ?? 'King of the Market W.L.L',
    };
  }

  // ─── Initiate listing fee payment ────────────────────────────────────────────

  async initiateListingFeePayment(userId: string, dto: InitiatePaymentDto) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: dto.listingId },
      include: {
        paymentTransactions: {
          where: { status: { in: [PaymentStatus.PAID, PaymentStatus.PENDING_PROOF] } },
        },
      },
    });

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId !== userId) throw new ForbiddenException('You can only pay for your own listings');
    if (listing.paymentTransactions.length > 0) throw new BadRequestException('Payment already submitted for this listing');

    const listingFee = this.configService.get<number>('payment.listingFeeBhd') || 3;

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        listingId: dto.listingId,
        paymentType: 'LISTING_FEE',
        amount: listingFee,
        currency: Currency.BHD,
        status: PaymentStatus.PENDING,
        provider: 'benefit',
        metadata: { initiatedAt: new Date().toISOString() },
      },
    });

    const ibanData = await this.getBenefitIban();

    return { transaction, ...ibanData };
  }

  // ─── Initiate featured listing payment ──────────────────────────────────────

  async initiateFeaturedListingPayment(userId: string, dto: InitiateFeaturedPaymentDto) {
    const [listing, pkg] = await Promise.all([
      this.prisma.listing.findUnique({ where: { id: dto.listingId } }),
      this.prisma.featuredPackage.findUnique({ where: { id: dto.packageId } }),
    ]);

    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId !== userId) throw new ForbiddenException('You can only feature your own listings');
    if (!pkg || !pkg.isActive) throw new NotFoundException('Featured package not found or inactive');

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        listingId: dto.listingId,
        paymentType: 'FEATURED_LISTING',
        amount: pkg.price,
        currency: Currency.BHD,
        status: PaymentStatus.PENDING,
        provider: 'benefit',
        metadata: {
          packageId: dto.packageId,
          packageName: pkg.nameAr,
          durationDays: pkg.durationDays,
          initiatedAt: new Date().toISOString(),
        },
      },
    });

    const ibanData = await this.getBenefitIban();
    return { transaction, ...ibanData };
  }

  // ─── Initiate subscription payment ───────────────────────────────────────────

  async initiateSubscriptionPayment(userId: string, dto: InitiateSubscriptionPaymentDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== UserRole.USER_SHOWROOM) {
      throw new ForbiddenException('Only showroom accounts can subscribe to packages');
    }

    const pkg = await this.prisma.subscriptionPackage.findUnique({ where: { id: dto.packageId } });
    if (!pkg || !pkg.isActive) throw new NotFoundException('Package not found or inactive');

    // Check for existing pending payment for this package
    const existingPending = await this.prisma.paymentTransaction.findFirst({
      where: {
        userId,
        subscriptionId: dto.packageId,
        status: { in: [PaymentStatus.PENDING, PaymentStatus.PENDING_PROOF] },
      },
    });
    if (existingPending) return { transaction: existingPending, ...(await this.getBenefitIban()) };

    const transaction = await this.prisma.paymentTransaction.create({
      data: {
        userId,
        subscriptionId: dto.packageId,
        paymentType: 'SUBSCRIPTION',
        amount: pkg.priceMonthly,
        currency: Currency.BHD,
        status: PaymentStatus.PENDING,
        provider: 'benefit',
        metadata: {
          packageName: pkg.name,
          durationDays: pkg.durationDays,
          initiatedAt: new Date().toISOString(),
        },
      },
    });

    const ibanData = await this.getBenefitIban();
    return { transaction, ...ibanData };
  }

  // ─── Submit Benefit transfer proof ───────────────────────────────────────────

  async submitProof(userId: string, transactionId: string, dto: SubmitBenefitProofDto) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.userId !== userId) throw new ForbiddenException('Not your transaction');
    if (transaction.status === PaymentStatus.PAID) throw new BadRequestException('Already paid');
    if (transaction.status === PaymentStatus.PENDING_PROOF) {
      throw new BadRequestException('Proof already submitted, awaiting admin review');
    }

    const updated = await this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatus.PENDING_PROOF,
        proofImageUrl: dto.proofImageUrl,
        updatedAt: new Date(),
      },
    });

    // Notify admins
    await this.notificationsService.notifyAdmins(
      NotificationType.PAYMENT_PROOF_SUBMITTED,
      'إثبات دفع جديد',
      `قام مستخدم برفع إثبات تحويل بنفت بمبلغ ${transaction.amount} د.ب. يرجى المراجعة.`,
      { transactionId, userId, amount: transaction.amount },
    );

    return updated;
  }

  // ─── Admin: get pending proof payments ───────────────────────────────────────

  private readonly USER_SELECT = {
    id: true,
    email: true,
    phone: true,
    role: true,
    individualProfile: { select: { fullName: true, avatarUrl: true } },
    showroomProfile: { select: { showroomName: true, logoUrl: true, merchantType: true } },
    subscription: {
      select: {
        status: true,
        startDate: true,
        endDate: true,
        listingsUsed: true,
        package: { select: { name: true, maxListings: true, durationDays: true } },
      },
    },
  } as const;

  private async enrichWithPackage<T extends { paymentType: string; subscriptionId: string | null }>(items: T[]) {
    const packageIds = [...new Set(
      items
        .filter(t => t.paymentType === 'SUBSCRIPTION' && t.subscriptionId)
        .map(t => t.subscriptionId!),
    )];

    const packages = packageIds.length > 0
      ? await this.prisma.subscriptionPackage.findMany({
          where: { id: { in: packageIds } },
          select: { id: true, name: true, priceMonthly: true, durationDays: true, maxListings: true },
        })
      : [];

    const pkgMap = Object.fromEntries(packages.map(p => [p.id, p]));
    return items.map(t => ({
      ...t,
      subscriptionPackage: t.subscriptionId ? (pkgMap[t.subscriptionId] ?? null) : null,
    }));
  }

  async getPendingProofPayments() {
    const rows = await this.prisma.paymentTransaction.findMany({
      where: { status: PaymentStatus.PENDING_PROOF },
      orderBy: { updatedAt: 'asc' },
      include: {
        user: { select: this.USER_SELECT },
        listing: { select: { id: true, title: true } },
      },
    });
    return this.enrichWithPackage(rows);
  }

  async getAllPaymentsAdmin(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [rows, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: this.USER_SELECT },
          listing: { select: { id: true, title: true } },
        },
      }),
      this.prisma.paymentTransaction.count(),
    ]);
    const data = await this.enrichWithPackage(rows);
    return { data, total, page, limit };
  }

  // ─── Admin: review payment ────────────────────────────────────────────────────

  async reviewPayment(adminId: string, transactionId: string, dto: ReviewPaymentDto) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status !== PaymentStatus.PENDING_PROOF) {
      throw new BadRequestException('Transaction is not awaiting review');
    }

    if (dto.action === 'APPROVE') {
      // Update transaction to PAID
      const updated = await this.prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: {
          status: PaymentStatus.PAID,
          paidAt: new Date(),
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNote: dto.note,
        },
      });

      // If featured listing payment → mark listing as featured
      if (transaction.paymentType === 'FEATURED_LISTING' && transaction.listingId) {
        const meta = transaction.metadata as Record<string, any> | null;
        const featuredPackageId = meta?.packageId as string | undefined;
        const durationDays = (meta?.durationDays as number | undefined) ?? 7;
        if (featuredPackageId) {
          const featuredUntil = new Date();
          featuredUntil.setDate(featuredUntil.getDate() + durationDays);
          await this.prisma.listing.update({
            where: { id: transaction.listingId },
            data: { isFeatured: true, featuredUntil },
          });
        }
      }

      // If subscription payment → activate subscription
      if (transaction.paymentType === 'SUBSCRIPTION' && transaction.subscriptionId) {
        const pkg = await this.prisma.subscriptionPackage.findUnique({
          where: { id: transaction.subscriptionId },
        });
        if (pkg) {
          const now = new Date();
          const endDate = new Date(now);
          endDate.setDate(endDate.getDate() + (pkg.durationDays ?? 30));

          await this.prisma.subscription.upsert({
            where: { userId: transaction.userId },
            create: {
              userId: transaction.userId,
              packageId: pkg.id,
              status: 'ACTIVE',
              startDate: now,
              endDate,
              listingsUsed: 0,
              paidAmount: transaction.amount,
            },
            update: {
              packageId: pkg.id,
              status: 'ACTIVE',
              startDate: now,
              endDate,
              paidAmount: transaction.amount,
            },
          });
        }
      }

      // Notify user
      await this.notificationsService.createNotification(
        transaction.userId,
        NotificationType.PAYMENT_APPROVED,
        'تم تأكيد الدفع ✅',
        `تم تأكيد تحويلك البنكي بمبلغ ${transaction.amount} د.ب. ${
          transaction.paymentType === 'SUBSCRIPTION' ? 'اشتراكك أصبح نشطاً.' :
          transaction.paymentType === 'FEATURED_LISTING' ? 'تم تمييز إعلانك.' :
          'تم تفعيل إعلانك.'
        }`,
        { transactionId },
      );

      return updated;
    } else {
      // REJECT
      const updated = await this.prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: {
          status: PaymentStatus.FAILED,
          reviewedBy: adminId,
          reviewedAt: new Date(),
          adminNote: dto.note,
        },
      });

      // Notify user
      await this.notificationsService.createNotification(
        transaction.userId,
        NotificationType.PAYMENT_REJECTED,
        'تم رفض الدفع ❌',
        `تم رفض إثبات التحويل.${dto.note ? ' السبب: ' + dto.note : ''} يمكنك إعادة المحاولة.`,
        { transactionId, reason: dto.note },
      );

      return updated;
    }
  }

  // ─── User: get my transactions ────────────────────────────────────────────────

  async getMyTransactions(userId: string) {
    return this.prisma.paymentTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        listing: { select: { id: true, title: true, status: true } },
      },
    });
  }

  async getTransaction(transactionId: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: {
        listing: { select: { id: true, title: true, status: true, ownerId: true } },
      },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async getListingTransactions(userId: string, listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.ownerId !== userId) throw new ForbiddenException('You can only view your own listing transactions');

    return this.prisma.paymentTransaction.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async handlePaymentWebhook(provider: string, payload: Record<string, unknown>) {
    console.log(`Payment webhook received from ${provider}:`, payload);
    return { received: true };
  }

  async markPaymentAsPaid(transactionId: string, dto: ManualPaymentDto) {
    const transaction = await this.prisma.paymentTransaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException('Transaction not found');
    if (transaction.status === PaymentStatus.PAID) throw new BadRequestException('Already paid');

    return this.prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatus.PAID,
        paidAt: new Date(),
        providerRef: dto.reference || `MANUAL_${Date.now()}`,
        reviewedBy: dto.adminId,
        reviewedAt: new Date(),
        adminNote: dto.note,
        metadata: {
          ...(transaction.metadata as object),
          markedPaidAt: new Date().toISOString(),
        },
      },
    });
  }

  async hasListingPaidFee(listingId: string): Promise<boolean> {
    const paidTransaction = await this.prisma.paymentTransaction.findFirst({
      where: { listingId, status: PaymentStatus.PAID },
    });
    return !!paidTransaction;
  }

  async uploadProofImage(buffer: Buffer, mimeType: string): Promise<string> {
    const result = await this.cloudinaryService.uploadBuffer(buffer, {
      folder: 'payment-proofs',
      resourceType: 'image',
    });
    return result.secureUrl;
  }
}
