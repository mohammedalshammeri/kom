import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType, ListingStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';

export class ListingQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ListingType })
  @IsOptional()
  @IsEnum(ListingType)
  type?: ListingType;

  @ApiPropertyOptional({ enum: ListingStatus })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiPropertyOptional({ example: 'Toyota Camry' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({ example: 'Camry' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ example: 2015 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearMin?: number;

  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearMax?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMin?: number;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  priceMax?: number;

  @ApiPropertyOptional({ example: 'Capital' })
  @IsOptional()
  @IsString()
  governorate?: string;

  @ApiPropertyOptional({
    enum: ['newest', 'oldest', 'price_asc', 'price_desc'],
    default: 'newest',
  })
  @IsOptional()
  @IsString()
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc';
}
