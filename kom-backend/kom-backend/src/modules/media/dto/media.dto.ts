import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from '@prisma/client';

export class PresignRequestDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiProperty({ example: 'car-photo-1.jpg' })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({ example: 2048576, description: 'File size in bytes' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  fileSize: number;
}

export class UploadMediaDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType)
  type: MediaType;
}

export class FinalizeMediaDto {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  listingId: string;

  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType)
  type: MediaType;

  @ApiProperty({ example: 'listings/uuid/images/filename.jpg' })
  @IsString()
  @IsNotEmpty()
  objectKey: string;

  @ApiProperty({ example: 'https://cdn.kom.bh/listings/uuid/images/filename.jpg' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'https://cdn.kom.bh/listings/uuid/images/filename_thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 1920 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  width?: number;

  @ApiPropertyOptional({ example: 1080 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  height?: number;

  @ApiPropertyOptional({ example: 30, description: 'Duration in seconds for videos' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  duration?: number;

  @ApiPropertyOptional({ example: 2048576, description: 'File size in bytes' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fileSize?: number;

  @ApiPropertyOptional({ example: 'image/jpeg' })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class ReorderMediaDto {
  @ApiProperty({
    type: [String],
    example: ['media-uuid-1', 'media-uuid-2', 'media-uuid-3'],
    description: 'Ordered array of media IDs',
  })
  @IsArray()
  @IsUUID('4', { each: true })
  mediaIds: string[];
}
