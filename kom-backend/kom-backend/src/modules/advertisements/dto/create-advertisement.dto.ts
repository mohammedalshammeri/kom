import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdvertisementDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  linkUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortOrder?: string;

  @ApiProperty({ required: false, description: 'ISO date string — ad activation date' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ required: false, description: 'ISO date string — ad expiry date' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
