import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeaturedPackageDto } from './dto/create-featured-package.dto';

@Injectable()
export class FeaturedService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Admin: manage packages ──────────────────────────────────────────────────

  async createPackage(dto: CreateFeaturedPackageDto) {
    return this.prisma.featuredPackage.create({
      data: {
        nameAr: dto.nameAr,
        price: dto.price,
        durationDays: dto.durationDays,
        sortOrder: dto.sortOrder ?? 0,
        isActive: true,
      },
    });
  }

  async findAllPackages(activeOnly = false) {
    return this.prisma.featuredPackage.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [{ sortOrder: 'asc' }, { price: 'asc' }],
    });
  }

  async updatePackage(id: string, dto: Partial<CreateFeaturedPackageDto> & { isActive?: boolean }) {
    const pkg = await this.prisma.featuredPackage.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundException('Featured package not found');
    return this.prisma.featuredPackage.update({ where: { id }, data: dto });
  }

  async deletePackage(id: string) {
    const pkg = await this.prisma.featuredPackage.findUnique({ where: { id } });
    if (!pkg) throw new NotFoundException('Featured package not found');
    await this.prisma.featuredPackage.delete({ where: { id } });
    return { message: 'Package deleted' };
  }

  // ── Admin: feature a listing manually ──────────────────────────────────────

  async featureListing(listingId: string, packageId: string) {
    const [listing, pkg] = await Promise.all([
      this.prisma.listing.findUnique({ where: { id: listingId } }),
      this.prisma.featuredPackage.findUnique({ where: { id: packageId } }),
    ]);

    if (!listing) throw new NotFoundException('Listing not found');
    if (!pkg) throw new NotFoundException('Featured package not found');
    if (!pkg.isActive) throw new BadRequestException('Package is not active');

    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + pkg.durationDays);

    return this.prisma.listing.update({
      where: { id: listingId },
      data: { isFeatured: true, featuredUntil },
      select: { id: true, isFeatured: true, featuredUntil: true },
    });
  }

  async unfeatureListing(listingId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new NotFoundException('Listing not found');
    return this.prisma.listing.update({
      where: { id: listingId },
      data: { isFeatured: false, featuredUntil: null },
      select: { id: true, isFeatured: true, featuredUntil: true },
    });
  }
}
