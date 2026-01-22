import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';

export class UpdateProfileDto {
  // Individual profile fields
  @ApiPropertyOptional({ example: 'Ahmed Mohammed' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName?: string;

  // Showroom profile fields
  @ApiPropertyOptional({ example: 'ABC Motors' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  showroomName?: string;

  @ApiPropertyOptional({ example: 'CR123456' })
  @IsOptional()
  @IsString()
  crNumber?: string;

  @ApiPropertyOptional({ example: 'Leading car dealership in Bahrain' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'Exhibition Road, Building 123' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiPropertyOptional({ example: 'https://cdn.kom.bh/logos/abc-motors.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  // Common fields
  @ApiPropertyOptional({ example: 'Capital' })
  @IsOptional()
  @IsString()
  governorate?: string;

  @ApiPropertyOptional({ example: 'Manama' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '+97339001001' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number format' })
  phone?: string;
}

export class UpdateShowroomPhoneDto {
  @ApiProperty({ example: '+97317001001' })
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, { message: 'Invalid phone number format' })
  phone: string;

  @ApiPropertyOptional({ example: 'Sales' })
  @IsOptional()
  @IsString()
  label?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
