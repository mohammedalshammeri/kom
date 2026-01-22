import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;

  @ApiPropertyOptional({ example: 'benefit', description: 'Payment provider (for future use)' })
  @IsOptional()
  @IsString()
  provider?: string;
}

export class ManualPaymentDto {
  @ApiPropertyOptional({ example: 'REF123456' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: 'Cash payment received' })
  @IsOptional()
  @IsString()
  note?: string;

  // Set by controller
  adminId?: string;
}
