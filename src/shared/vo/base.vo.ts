import {IsOptional, IsString, isNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class baseVo {
  @ApiProperty({ description: '应用key', required: true })
  app_key: string

  @ApiProperty({ description: '时间戳', required: true })
  timestamp: number

  @ApiProperty({ description: 'sdk版本', required: true })
  sdk_version: string

  @ApiProperty({ description: 'sdk名称', required: true })
  sdk_name: string

  @IsOptional()
  @ApiProperty({ description: 'sdk版本', required: false })
  app_user_id: number

  @IsOptional()
  @ApiProperty({ description: '会话id', required: true })
  session_id: string

  @IsOptional()
  @ApiProperty({ description: '会话开始时间', required: true })
  session_time: string

  @ApiProperty({ description: '设备编号', required: true })
  device_no: number

  @ApiProperty({ description: '设备id', required: true })
  device_id: string

  @ApiProperty({ description: '设备初始化时间', required: true })
  create_time: string

  @ApiProperty({ description: '安装渠道', required: true })
  install_channel: string

  @ApiProperty({ description: '签名', required: true })
  checksum256: string
}
