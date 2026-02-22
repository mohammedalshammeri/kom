import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Transmission, FuelType, CarCondition, Prisma } from '@prisma/client';

export class CarDetailsDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2020 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiPropertyOptional({ example: 'LE' })
  @IsOptional()
  @IsString()
  trim?: string;

  @ApiPropertyOptional({ example: 45000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileageKm?: number;

  @ApiPropertyOptional({ enum: Transmission, default: Transmission.AUTO })
  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @ApiPropertyOptional({ enum: FuelType, default: FuelType.PETROL })
  @IsOptional()
  @IsEnum(FuelType)
  fuel?: FuelType;

  @ApiPropertyOptional({ enum: CarCondition, default: CarCondition.USED })
  @IsOptional()
  @IsEnum(CarCondition)
  condition?: CarCondition;

  @ApiPropertyOptional({ example: 'White' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'Beige' })
  @IsOptional()
  @IsString()
  interiorColor?: string;

  @ApiPropertyOptional({ example: 'Good (minor defects)' })
  @IsOptional()
  @IsString()
  bodyCondition?: string;

  @ApiPropertyOptional({ example: 'Original Paint' })
  @IsOptional()
  @IsString()
  paintType?: string;

  @ApiPropertyOptional({ example: '1HGBH41JXMN109186' })
  @IsOptional()
  @IsString()
  vin?: string;

  @ApiPropertyOptional({ example: 'Sedan' })
  @IsOptional()
  @IsString()
  bodyType?: string;

  @ApiPropertyOptional({ example: '2.5L' })
  @IsOptional()
  @IsString()
  engineSize?: string;

  @ApiPropertyOptional({ description: 'Additional specs as JSON' })
  @IsOptional()
  specs?: Prisma.InputJsonValue;
}
