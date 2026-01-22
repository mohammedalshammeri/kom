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
import { ReportStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto';

export class CreateReportDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;

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
