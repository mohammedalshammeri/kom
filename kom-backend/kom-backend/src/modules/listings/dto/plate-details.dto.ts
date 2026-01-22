import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
