import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PlateType } from '@prisma/client';

export class PlateDetailsDto {
  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @ApiProperty({ example: 'Private', description: 'Plate category (Private, Special, VIP, etc.)' })
  @IsString()
  @IsNotEmpty()
  plateCategory: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  plateCode?: string;

  @ApiPropertyOptional({ enum: PlateType })
  @IsOptional()
  @IsEnum(PlateType)
  plateType?: PlateType;
}
