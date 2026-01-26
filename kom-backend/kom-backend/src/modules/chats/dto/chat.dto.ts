import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { PaginationDto } from '../../../common/dto';

export class StartChatDto {
  @ApiProperty({ example: 'listing-uuid' })
  @IsUUID()
  listingId: string;

  @ApiPropertyOptional({ example: 'other-user-uuid' })
  @IsOptional()
  @IsUUID()
  otherUserId?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'مرحبا، هل الإعلان متاح؟' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  text: string;
}

export class ChatMessagesQueryDto extends PaginationDto {}
