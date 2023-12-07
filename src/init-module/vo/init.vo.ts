import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class InitVo {
  @ApiProperty({ description: '应用key', required: true })
  @IsString()
  app_key: string

  @ApiProperty({ description: '设备id', required: true })
  @IsString()
  device_id: string

  @IsString()
  @ApiProperty({ description: '安装渠道', required: true })
  install_channel: string
}
