import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PartCondition } from '@prisma/client';

export class PartDetailsDto {
  @ApiProperty({
    example: 'Engine',
    description: 'Part category (Engine, Body, Interior, Electronics, etc.)',
  })
  @IsString()
  @IsNotEmpty()
  partCategory: string;

  @ApiPropertyOptional({ example: 'Alternator' })
  @IsOptional()
  @IsString()
  partName?: string;

  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  compatibleCarMake?: string;

  @ApiPropertyOptional({ example: 'Camry' })
  @IsOptional()
  @IsString()
  compatibleCarModel?: string;

  @ApiPropertyOptional({ example: 2015 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  compatibleYearFrom?: number;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(new Date().getFullYear() + 1)
  compatibleYearTo?: number;

  @ApiPropertyOptional({ enum: PartCondition, default: PartCondition.USED })
  @IsOptional()
  @IsEnum(PartCondition)
  condition?: PartCondition;

  @ApiPropertyOptional({ example: '27060-0V110' })
  @IsOptional()
  @IsString()
  partNumber?: string;

  @ApiPropertyOptional({ example: 'Denso' })
  @IsOptional()
  @IsString()
  brand?: string;
}
