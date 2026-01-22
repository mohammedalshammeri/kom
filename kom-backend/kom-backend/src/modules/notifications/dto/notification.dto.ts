import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'fcm-token-here' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ enum: ['ios', 'android'], example: 'ios' })
  @IsEnum(['ios', 'android'])
  platform: 'ios' | 'android';
}
