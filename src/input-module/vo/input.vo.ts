import { baseVo } from '@/shared/vo/base.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'

export class InputVo extends baseVo {
    @IsOptional()
    @ApiProperty({ description: '开始会话标识', required: false })
    begin_session: string
    
    @IsOptional()
    @ApiProperty({ description: '结束会话标识', required: false })
    end_session: string
  
    @IsOptional() 
    @ApiProperty({ description: '会话时间', required: false })
    session_duration: number
  
    @IsOptional() 
    @ApiProperty({ description: '事件埋点', required: false })
    events?: string
  
    @IsOptional() 
    @ApiProperty({ description: '页面埋点', required: false })
    pages: string
  
    @IsOptional() 
    @ApiProperty({ description: '跳出率埋点', required: false })
    bounces: string
  
    @IsOptional() 
    @ApiProperty({ description: '终端基础信息', required: false })
    metrics: string
  
}
