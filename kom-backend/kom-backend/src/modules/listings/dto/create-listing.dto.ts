import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType, Currency, ContactPreference } from '@prisma/client';
import { CreateMotorcycleDetailsDto } from './create-motorcycle-details.dto';

export class CreateListingDto {
  @ApiProperty({ enum: ListingType, example: ListingType.CAR })
  @IsEnum(ListingType)
  type: ListingType;

  @ApiProperty({ example: '2020 Toyota Camry LE - Low Mileage' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional({ example: 'Well maintained car with full service history...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ example: 8500, description: 'Price in BHD' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ enum: Currency, default: Currency.BHD })
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @ApiPropertyOptional({ example: 'Capital' })
  @IsOptional()
  @IsString()
  locationGovernorate?: string;

  @ApiPropertyOptional({ example: 'Manama' })
  @IsOptional()
  @IsString()
  locationArea?: string;

  @ApiPropertyOptional({ enum: ContactPreference, default: ContactPreference.CALL })
  @IsOptional()
  @IsEnum(ContactPreference)
  contactPreference?: ContactPreference;

  @ApiPropertyOptional({ type: CreateMotorcycleDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMotorcycleDetailsDto)
  motorcycleDetails?: CreateMotorcycleDetailsDto;
}

export class UpdateListingDto {
  @ApiPropertyOptional({ example: '2020 Toyota Camry LE - Low Mileage' })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ example: 'Well maintained car with full service history...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiPropertyOptional({ example: 8500 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'Capital' })
  @IsOptional()
  @IsString()
  locationGovernorate?: string;

  @ApiPropertyOptional({ example: 'Manama' })
  @IsOptional()
  @IsString()
  locationArea?: string;

  @ApiPropertyOptional({ enum: ContactPreference })
  @IsOptional()
  @IsEnum(ContactPreference)
  contactPreference?: ContactPreference;
}
