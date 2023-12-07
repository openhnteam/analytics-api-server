import { ApiProperty } from '@nestjs/swagger'

export class InitRspDto {
  @ApiProperty({ description: '设备编号' })
  device_no: number
  @ApiProperty({ description: '设备id' })
  device_id: string
  @ApiProperty({ description: '设备初始化时间戳' })
  create_time: string
  @ApiProperty({ description: '安装渠道' })
  install_channel: string
}
