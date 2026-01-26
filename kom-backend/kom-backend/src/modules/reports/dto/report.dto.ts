import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ReportStatus, ReportType } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';

export class CreateReportDto {
  @ApiPropertyOptional({ enum: ReportType, example: ReportType.LISTING })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({ example: 'uuid-of-listing' })
  @IsOptional()
  @IsString()
  @IsUUID()
  listingId?: string;

  @ApiProperty({
    example: 'Suspicious listing',
    description: 'Reason for report',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  reason: string;

  @ApiPropertyOptional({
    example: 'The images look fake and the price is too good to be true.',
    description: 'Additional details',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  details?: string;
}

export class ReportQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ReportStatus })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ enum: ReportType })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;
}

export class ResolveReportDto {
  @ApiProperty({
    enum: ['resolve', 'dismiss'],
    example: 'resolve',
    description: 'Action to take on the report',
  })
  @IsEnum(['resolve', 'dismiss'])
  action: 'resolve' | 'dismiss';

  @ApiPropertyOptional({
    example: 'Listing removed due to policy violation',
    description: 'Resolution notes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  resolution?: string;
}
