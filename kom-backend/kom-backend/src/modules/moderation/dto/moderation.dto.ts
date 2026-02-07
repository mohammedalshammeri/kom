import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, MinLength } from 'class-validator';
import { ListingType, UserRole } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';

export class PendingListingsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ListingType })
  @IsOptional()
  @IsEnum(ListingType)
  type?: ListingType;

  @ApiPropertyOptional({ enum: [UserRole.USER_INDIVIDUAL, UserRole.USER_SHOWROOM] })
  @IsOptional()
  @IsEnum([UserRole.USER_INDIVIDUAL, UserRole.USER_SHOWROOM])
  ownerType?: UserRole;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}

export class AcceptedListingsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ListingType })
  @IsOptional()
  @IsEnum(ListingType)
  type?: ListingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}

export class RejectListingDto {
  @ApiProperty({
    example: 'Images are unclear or insufficient',
    description: 'Reason for rejection',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  reason: string;
}
