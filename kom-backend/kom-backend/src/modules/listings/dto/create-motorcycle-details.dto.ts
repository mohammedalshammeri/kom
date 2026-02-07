import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { Transmission, CarCondition } from '@prisma/client';

export class CreateMotorcycleDetailsDto {
  @ApiProperty({ example: 'Honda' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'CBR600RR' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2021 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @ApiPropertyOptional({ example: 12000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileageKm?: number;

  @ApiProperty({ enum: Transmission, default: Transmission.MANUAL })
  @IsEnum(Transmission)
  transmission: Transmission;

  @ApiProperty({ enum: CarCondition, default: CarCondition.USED })
  @IsEnum(CarCondition)
  condition: CarCondition;

  @ApiPropertyOptional({ example: 'Red' })
  @IsOptional()
  @IsString()
  color?: string;
}
